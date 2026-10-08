# HƯỚNG DẪN CẬP NHẬT GOOGLE APPS SCRIPT CHO GOOGLE SHEET

### Bước 1: Mở trình soạn thảo Google Apps Script
1. Mở trang Google Sheet của bạn:
   `https://docs.google.com/spreadsheets/d/1ky8mIRUtOG57mQXaxpSfOAeH_J-aBCiIHCTU-34IIXc/edit`
2. Trên thanh menu, chọn **Tiện ích mở rộng** (Extensions) > **Apps Script**.

### Bước 2: Dán mã nguồn mới
1. Xóa toàn bộ nội dung trong file `Mã.gs` (hoặc `Code.gs`).
2. Sao chép và dán toàn bộ nội dung từ file `google_apps_script/Code.gs` vào.
3. Nhấn biểu tượng 💾 **Lưu dự án** (Ctrl + S).

### Bước 3: Triển khai Web App (Deploy)
1. Ở góc trên bên phải, nhấn nút xanh **Triển khai** (Deploy) > **Quản lý bản triển khai** (Manage deployments) hoặc **Bản triển khai mới** (New deployment).
2. Nếu chọn **Quản lý bản triển khai**:
   - Nhấn vào biểu tượng bút chì ✏️ (Chỉnh sửa).
   - Mục **Phiên bản** (Version): Chọn **Bản mới** (New version).
   - Nhấn **Triển khai** (Deploy).
3. Nếu chọn **Bản triển khai mới**:
   - Chọn loại: **Ứng dụng web** (Web app).
   - Mô tả: `Cập nhật trường đơn vị & tổ chức đoàn`.
   - Thực thi dưới dạng (Execute as): **Tôi** (Me - email của bạn).
   - Người có quyền truy cập (Who has access): **Bất kỳ ai** (Anyone).
   - Nhấn **Triển khai** (Deploy).
4. Sao chép link **URL ứng dụng web** (có dạng `https://script.google.com/macros/s/.../exec`) và kiểm tra xem có khớp với link `API_ENDPOINT` trong `script.js` không.

---
### Bước 4 (Tùy chọn): Cài đặt Trigger tự động chốt số liệu vào 24h hàng ngày
1. Trong màn hình Apps Script, nhìn sang cột menu bên trái, nhấn vào biểu tượng ⏰ **Trình kích hoạt** (Triggers).
2. Nhấn nút xanh **+ Thêm trình kích hoạt** (Add Trigger) ở góc dưới cùng bên phải.
3. Thiết lập các thông số như sau:
   - **Chọn hàm sẽ chạy**: `dailySnapshotTrigger`
   - **Chọn bản triển khai sẽ chạy**: `Head` (hoặc bản triển khai hiện tại).
   - **Chọn nguồn sự kiện**: `Theo thời gian` (Time-driven).
   - **Chọn loại trình kích hoạt theo thời gian**: `Bộ hẹn giờ theo ngày` (Day timer).
   - **Chọn khoảng thời gian trong ngày**: `Từ 23h đến nửa đêm` (hoặc `Nửa đêm đến 1 giờ sáng`).
4. Nhấn **Lưu** (Save).
👉 Cứ đúng 24h hàng ngày, Google Apps Script sẽ tự động chốt số liệu, sắp xếp bảng xếp hạng và lưu vào tab `ThongKe_TongHop_24h` trên Google Sheet của bạn!

---
### Các cột dữ liệu mới trong Google Sheet (Tab ThongKe_DaiHoi):
- **Cột A**: STT
- **Cột B**: Thời gian ghi nhận
- **Cột C**: Họ và tên
- **Cột D**: Địa phương / Đơn vị
- **Cột E**: Tổ chức đoàn nơi tham gia sinh hoạt (đã thay thế trường Lời chúc)

---
### Quản lý Danh sách đơn vị trong hộp chọn (Tab DanhSach_DonVi):
- Code mới sẽ **tự động tạo tab `DanhSach_DonVi`** và điền sẵn 74 đơn vị ban đầu.
- Khi muốn **thêm đơn vị mới, đổi tên hoặc xóa đơn vị**:
  - Bạn chỉ cần mở tab `DanhSach_DonVi` trên Google Sheet và chỉnh sửa trực tiếp ở **Cột B (Tên địa phương / Đơn vị)**.
  - Trang web sẽ tự động đồng bộ danh sách đơn vị mới này vào hộp chọn `<select id="unit">` trên trang web!
