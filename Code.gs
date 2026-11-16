/* HANH Mobile API. Configure Script Properties before deployment. */
var HANH_HEADERS=['MONTH','TYPE','ID','NAME','CONTRACT','GROUP','KIND','AMOUNT','POS','MINDUE','MANUAL_RATE','OVERRIDE_RATE','SETTINGS_JSON'];
function doGet(){return reply_({ok:true,service:'HANH Mobile',version:2});}
function reply_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
function doPost(e){var lock=LockService.getScriptLock();try{
 var req=JSON.parse(e.postData.contents||'{}'),p=PropertiesService.getScriptProperties(),secret=p.getProperty('SYNC_TOKEN');
 if(!secret||secret.length<32||req.token!==secret)throw Error('UNAUTHORIZED');
 if(['pull','push'].indexOf(req.action)<0)throw Error('BAD_ACTION');
 if(!lock.tryLock(20000))throw Error('BUSY');
 var id=p.getProperty('SPREADSHEET_ID');if(!id)throw Error('MISSING_SPREADSHEET_ID');
 var book=SpreadsheetApp.openById(id),sheet=book.getSheetByName('HANH_APP');
 if(!sheet){sheet=book.insertSheet('HANH_APP');sheet.getRange(1,1,1,HANH_HEADERS.length).setValues([HANH_HEADERS]);sheet.setFrozenRows(1);}
 if(JSON.stringify(sheet.getRange(1,1,1,HANH_HEADERS.length).getValues()[0])!==JSON.stringify(HANH_HEADERS))throw Error('HEADER_MISMATCH');
 var rows=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,HANH_HEADERS.length).getValues():[];
 var revision=digest_(rows),state=decode_(rows);
 if(req.action==='pull')return reply_({ok:true,revision:revision,state:state});
 if(req.baseRevision!==revision)return reply_({ok:false,error:'CONFLICT',message:'Google Sheets đã thay đổi. Tải bản mới trước khi gửi lại.'});
 validate_(req.state);var values=encode_(req.state),last=Math.max(values.length,rows.length);
 if(last>10000)throw Error('TOO_MANY_ROWS');
 // One write replaces the dedicated data range; unrelated tabs are never touched.
 while(values.length<last)values.push(Array(HANH_HEADERS.length).fill(''));
 if(last){if(sheet.getMaxRows()<last+1)sheet.insertRowsAfter(sheet.getMaxRows(),last+1-sheet.getMaxRows());sheet.getRange(2,1,last,HANH_HEADERS.length).setNumberFormat('@').setValues(values);}
 SpreadsheetApp.flush();var actual=last?sheet.getRange(2,1,last,HANH_HEADERS.length).getValues():[];
 return reply_({ok:true,revision:digest_(actual),savedAt:new Date().toISOString()});
 }catch(err){return reply_({ok:false,error:String(err.message||err)});}finally{if(lock.hasLock())lock.releaseLock();}}
function clean_(rows){return rows.filter(function(r){return r.some(function(v){return v!=='';});});}
function digest_(rows){return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(clean_(rows))));}
function safeText_(v){var s=String(v||'');return /^[=+\-@']/.test(s)?"'"+s:s;}
function restore_(v){var s=String(v||'');return /^'[=+\-@']/.test(s)?s.slice(1):s;}
function encode_(state){var out=[];Object.keys(state.months).sort().forEach(function(m){var d=state.months[m];out.push([m,'SETTINGS','','','','','','','','','','',JSON.stringify(d.settings)]);['cash','ntu'].forEach(function(type){d[type].forEach(function(r){out.push([m,type,r.id,safeText_(r.name),safeText_(r.contract),r.group||'',r.kind||'',r.amount,r.pos||'',r.mindue||'',r.manual,r.override==null?'':r.override,'']);});});});return out;}
function decode_(rows){var state={month:'',months:{}};clean_(rows).forEach(function(r){var m=String(r[0]);if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(m))throw Error('INVALID_SHEET_MONTH');if(!state.months[m])state.months[m]={settings:null,cash:[],ntu:[]};var d=state.months[m];if(r[1]==='SETTINGS'){if(d.settings)throw Error('DUPLICATE_SETTINGS');d.settings=JSON.parse(r[12]);}else if(r[1]==='cash'||r[1]==='ntu'){var item={id:String(r[2]),name:restore_(r[3]),contract:restore_(r[4]),amount:Number(r[7]),manual:Number(r[10])};if(r[1]==='cash'){item.group=String(r[5]);item.kind=String(r[6]);}else{item.pos=Number(r[8]);item.mindue=Number(r[9]);item.override=r[11]===''?null:Number(r[11]);}d[r[1]].push(item);}else throw Error('INVALID_ROW_TYPE');});var months=Object.keys(state.months).sort();if(!months.length)return null;state.month=months[months.length-1];validate_(state);return state;}
function validate_(state){if(!state||!state.months||typeof state.months!=='object'||Array.isArray(state.months)||!Object.prototype.hasOwnProperty.call(state.months,state.month))throw Error('INVALID_STATE');var count=0;Object.keys(state.months).forEach(function(m){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(m))throw Error('INVALID_MONTH');var d=state.months[m],s=d.settings;if(!s||!Array.isArray(d.cash)||!Array.isArray(d.ntu))throw Error('INVALID_MONTH_DATA');['cof','non','ntu','done','wcof','wnon','salary','dependents','deduct','perDependent','insurance'].forEach(function(k){num_(s[k]);});['ntu','done','dependents'].forEach(function(k){if(!Number.isInteger(s[k]))throw Error('INVALID_INTEGER');});if(Math.abs(s.wcof+s.wnon-1)>1e-8)throw Error('INVALID_WEIGHTS');if(s.company!==null)num_(s.company);if(!s.bands)throw Error('INVALID_BANDS');['cash','ntu','bonus'].forEach(function(k){table_(s.bands[k]);});table_(s.taxBands);['cash','ntu'].forEach(function(type){var ids={};d[type].forEach(function(r){count++;if(typeof r.id!=='string'||!r.id||ids[r.id]||typeof r.name!=='string'||typeof r.contract!=='string'||r.name.length>500||r.contract.length>100)throw Error('INVALID_RECORD');ids[r.id]=true;num_(r.amount);num_(r.manual);if(type==='cash'){if(['COF','NON'].indexOf(r.group)<0||!(/^(period|overdue|exception|cof|b([3-9]|1[0-2]))$/).test(r.kind))throw Error('INVALID_CASH');}else{num_(r.pos);num_(r.mindue);if(r.pos<=0||r.mindue<=0||r.manual>1)throw Error('INVALID_NTU');if(r.override!==null){num_(r.override);if(r.override>1)throw Error('INVALID_RATE');}}});});});if(count>9000||JSON.stringify(state).length>2000000)throw Error('TOO_LARGE');}
function num_(n){if(typeof n!=='number'||!isFinite(n)||n<0)throw Error('INVALID_NUMBER');}
function table_(a){if(!Array.isArray(a)||!a.length||a.length>100||a[0][0]!==0)throw Error('INVALID_TABLE');a.forEach(function(r,i){if(!Array.isArray(r)||r.length!==2)throw Error('INVALID_TABLE');num_(r[0]);num_(r[1]);if(r[1]>1||(i&&r[0]<=a[i-1][0]))throw Error('INVALID_TABLE');});}
