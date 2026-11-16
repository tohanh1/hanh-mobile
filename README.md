# HANH Mobile

Web app ti?ng Vi?t t?i uu di?n tho?i: theo doi thu COF/NON, NTU quay d?u, KPI v� thu nh?p theo th�ng.

## Ch?c nang

- T?ng quan KPI, di?u ki?n nh?n bonus, tr�ch nhi?m v� d?i chi?u ti?n c�ng ty.
- Nh?p ti?n luy k? theo t?ng h?p d?ng; ch?n ki?u thu cu?i c�ng; h? s? ngo?i l?.
- NTU: d? mindue m?i b?t POS v� t�nh tr�ch nhi?m; t? �p 20% khi thanh ly, cho ph�p ghi d�.
- M� ph?ng d?c l?p, thay ti?n thu v� NTU m� kh�ng s?a s? th?c t?.
- Tham s? ri�ng t?ng th�ng; xu?t/nh?p b?n sao luu JSON.

## Ch?y tr�n m�y t�nh

C�i Node.js phi�n b?n 20 tr? l�n, m? thu m?c repo v� ch?y:

```sh
node preview.mjs
```

M? http://127.0.0.1:8765. Kh�ng c?n c�i thu vi?n b? sung.

## Ki?m tra

```sh
npm test
```

Ki?m tra s? li?u ban d?u, ngu?ng mindue, thanh ly, h? s? nh?p tay, c�c m?c bonus, di?u ki?n POS 68%/85%, KPI vu?t 100% v� t�ch bi?t m� ph?ng.

## Tri?n khai

Dua n?i dung thu m?c `dist/` l�n hosting HTTPS c� ki?m so�t truy c?p ph� h?p. Ma ngu?n hi?n ch?a m?t ph?n d? li?u kh?i t?o t? b?ng c?a ch? s? h?u; kh�ng c�ng khai repo ho?c hosting khi chua lo?i b? d? li?u n�y. Repo ri�ng tu kh�ng t? t?o website ri�ng tu.

?ng d?ng chua d?ng b? Google Sheets v� chua c� m�y ch? luu d? li?u. D? li?u du?c luu trong localStorage c?a t?ng tr�nh duy?t, t?ng d?a ch? website. Chuy?n thi?t b? ho?c d?i d?a ch? c?n xu?t/nh?p b?n sao luu. X�a d? li?u tr�nh duy?t c� th? m?t d? li?u chua sao luu.

## Quy t?c t�nh ch�nh

- KPI ti?n = KPI COF x tr?ng s? COF + KPI NON x tr?ng s? NON.
- T?ng ho�n th�nh = KPI ti?n x h? s? theo KPI NTU + KPI NTU x h? s? theo KPI ti?n.
- Bonus = to�n b? POS quy d?i x t? l? thu?ng c?a ngu?ng t?ng ho�n th�nh hi?n t?i.
- POS NTU d?t 68%: nh?n d? bonus; du?i 68%: nh?n 80% bonus.
- POS NTU d?t 85%: nh?n th�m ti?n tr�ch nhi?m c?a c�c h? so d? mindue.
- Luong c?ng c?ng ? m?i tru?ng h?p; thu? t�nh theo tham s? c?a th�ng.

C�c tham s? thu? kh?i t?o du?c sao ch�p t? b?ng ngu?n, chua x�c minh quy d?nh hi?n h�nh. Giao di?n chua du?c ki?m th? tr?c quan tr�n iPhone.

## C?u tr�c

- `dist/index.html`, `dist/style.css`: giao di?n.
- `dist/app.js`: nh?p li?u, luu tr?, m� ph?ng.
- `dist/model.js`: c�ng th?c v� d? li?u kh?i t?o.
- `test.mjs`: ki?m tra t�nh to�n.
- `preview.mjs`: m�y ch? ch?y th? t?i m�y t�nh.
- `portable.mjs`: t?o t?p HTML d?c l?p ? thu m?c cha.

