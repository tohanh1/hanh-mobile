# HANH Mobile

Web app tiếng Việt tối ưu điện thoại: theo dõi thu COF/NON, NTU quay đầu, KPI và thu nhập theo tháng.

## Chức năng

- Tổng quan KPI, điều kiện nhận bonus, trách nhiệm và đối chiếu tiền công ty.
- Nhập tiền lũy kế theo từng hợp đồng; chọn kiểu thu cuối cùng; hệ số ngoại lệ.
- NTU: đủ mindue mới bật POS và tính trách nhiệm; tự áp 20% khi thanh lý, cho phép ghi đè.
- Mô phỏng độc lập, thay tiền thu và NTU mà không sửa số thực tế.
- Tham số riêng từng tháng; xuất/nhập bản sao lưu JSON.

## Chạy trên máy tính

Cài Node.js phiên bản 20 trở lên, mở thư mục repo và chạy:

```sh
node preview.mjs
```

Mở http://127.0.0.1:8765. Không cần cài thư viện bổ sung.

## Kiểm tra

```sh
npm test
```

Kiểm tra số liệu ban đầu, ngưỡng mindue, thanh lý, hệ số nhập tay, các mốc bonus, điều kiện POS 68%/85%, KPI vượt 100% và tách biệt mô phỏng.

## Triển khai

Đưa nội dung thư mục `dist/` lên hosting HTTPS có kiểm soát truy cập phù hợp. Mã nguồn hiện chứa một phần dữ liệu khởi tạo từ bảng của chủ sở hữu; không công khai repo hoặc hosting khi chưa loại bỏ dữ liệu này. Repo riêng tư không tự tạo website riêng tư.

Ứng dụng chưa đồng bộ Google Sheets và chưa có máy chủ lưu dữ liệu. Dữ liệu được lưu trong localStorage của từng trình duyệt, từng địa chỉ website. Chuyển thiết bị hoặc đổi địa chỉ cần xuất/nhập bản sao lưu. Xóa dữ liệu trình duyệt có thể mất dữ liệu chưa sao lưu.

## Quy tắc tính chính

- KPI tiền = KPI COF × trọng số COF + KPI NON × trọng số NON.
- Tổng hoàn thành = KPI tiền × hệ số theo KPI NTU + KPI NTU × hệ số theo KPI tiền.
- Bonus = toàn bộ POS quy đổi × tỷ lệ thưởng của ngưỡng tổng hoàn thành hiện tại.
- POS NTU đạt 68%: nhận đủ bonus; dưới 68%: nhận 80% bonus.
- POS NTU đạt 85%: nhận thêm tiền trách nhiệm của các hồ sơ đủ mindue.
- Lương cứng cộng ở mọi trường hợp; thuế tính theo tham số của tháng.

Các tham số thuế khởi tạo được sao chép từ bảng nguồn, chưa xác minh quy định hiện hành. Giao diện chưa được kiểm thử trực quan trên iPhone.

## Cấu trúc

- `dist/index.html`, `dist/style.css`: giao diện.
- `dist/app.js`: nhập liệu, lưu trữ, mô phỏng.
- `dist/model.js`: công thức và dữ liệu khởi tạo.
- `test.mjs`: kiểm tra tính toán.
- `preview.mjs`: máy chủ chạy thử tại máy tính.
- `portable.mjs`: tạo tệp HTML độc lập ở thư mục cha.
