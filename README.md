# HANH Mobile · v2

Ứng dụng 4 mục, triển khai theo 5 tệp chính ở thư mục gốc:

| Tệp | Chức năng |
| --- | --- |
| index.html | Giao diện, dữ liệu, KPI, bonus, thuế, đồng bộ phía trình duyệt |
| Code.gs | Google Apps Script đọc/ghi hai chiều tab riêng HANH_APP |
| sw.js | Lưu giao diện để sử dụng ngoại tuyến |
| manifest.webmanifest | Cài ứng dụng lên màn hình chính, biểu tượng nhúng |
| HUONG-DAN.txt | Hướng dẫn triển khai, cài đặt, đồng bộ và sao lưu |

Xem **[HUONG-DAN.txt](HUONG-DAN.txt)** để cài đặt. Không cần npm hoặc bước build khi triển khai.

Đồng bộ theo thao tác người dùng, kiểm tra phiên bản và khóa truy cập. Không ghi vào MIX 1 NEW. Các thao tác ngoại tuyến vẫn lưu tại máy; có mạng bấm đồng bộ. Không tự đồng bộ nền hoặc tự gộp xung đột.

Code.gs cần được chủ tài khoản Google triển khai với SPREADSHEET_ID và SYNC_TOKEN trong Script Properties. Không có khóa hoặc URL triển khai thật trong repo. Hiện chưa kiểm chứng kết nối với Google và cài đặt trên iPhone đầu cuối.

Repo và bản mã hiện có dữ liệu khách hàng khởi tạo; giữ riêng tư và dùng hosting có kiểm soát truy cập. Biểu thuế khởi tạo sao chép từ bảng nguồn, cần đối chiếu với thực tế.

Mã phiên bản trước được giữ trong lịch sử Git. Kiểm tra tự động: `node tests/test.mjs` (Node.js 20+).
