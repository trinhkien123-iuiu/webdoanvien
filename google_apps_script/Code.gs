/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - API NHẬN THÔNG TIN ĐẠI HỘI ĐOÀN TỈNH HÀ TĨNH
 * =========================================================================
 */

// Hàm xử lý khi nhận POST request từ Website
function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    // Chờ tối đa 30 giây để tránh xung đột khi nhiều người gửi cùng lúc
    lock.waitLock(30000);

    var sheet = getOrCreateTargetSheet();
    var payload = {};

    // 1. Phân tích dữ liệu gửi lên (hỗ trợ cả JSON string và form-data)
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var name = (payload.fullName || payload.name || payload.username || "").trim();
    var role = (payload.role || "").trim();
    var message = (payload.message || "").trim();
    var clientTime = (payload.savedAt || payload.timestamp || "").trim();

    // 2. Lấy thời gian server theo múi giờ Việt Nam (GMT+7)
    var vnTime = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    // 3. Tính số thứ tự (STT)
    var lastRow = sheet.getLastRow();
    var stt = lastRow; // Do dòng 1 là tiêu đề cột

    // 4. Ghi dòng dữ liệu mới vào Google Sheet (đã bỏ trường thiết bị)
    sheet.appendRow([
      stt,                    // Cột A: STT
      clientTime || vnTime,   // Cột B: Thời gian ghi nhận
      name || "Khách",        // Cột C: Họ và tên
      role || "Đoàn viên",    // Cột D: Chức vụ
      message || ""           // Cột E: Lời chúc gửi Đại hội
    ]);

    // Định dạng căn lề cho dòng mới
    var newRowIndex = sheet.getLastRow();
    sheet.getRange(newRowIndex, 1).setHorizontalAlignment("center");
    sheet.getRange(newRowIndex, 2).setHorizontalAlignment("center");

    lock.releaseLock();

    return createJsonResponse({
      success: true,
      message: "Lưu dữ liệu thành công!",
      stt: stt,
      time: vnTime
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      message: "Lỗi ghi dữ liệu: " + error.toString()
    });
  }
}

// Hàm kiểm tra khi mở link trực tiếp trên trình duyệt (GET test)
function doGet(e) {
  var sheet = getOrCreateTargetSheet();
  var count = Math.max(0, sheet.getLastRow() - 1);

  return createJsonResponse({
    success: true,
    status: "ACTIVE",
    service: "Hệ thống API Lưu trữ Thông điệp Đại hội Đoàn tỉnh Hà Tĩnh",
    total_submissions: count,
    server_time: Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss")
  });
}

// Hàm hỗ trợ tạo Sheet và Tiêu đề bảng nếu chưa có
function getOrCreateTargetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "ThongKe_DaiHoi";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // Nếu sheet còn trống, tạo Header row đẹp mắt
  if (sheet.getLastRow() === 0) {
    var headers = [
      "STT",
      "Thời gian",
      "Họ và tên",
      "Chức vụ",
      "Lời chúc gửi Đại hội"
    ];
    sheet.appendRow(headers);

    // Format dòng tiêu đề: Nền xanh Đoàn, chữ trắng đậm
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0056b3");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);

    // Set độ rộng hợp lý cho các cột
    sheet.setColumnWidth(1, 60);   // STT
    sheet.setColumnWidth(2, 160);  // Thời gian
    sheet.setColumnWidth(3, 220);  // Họ tên
    sheet.setColumnWidth(4, 250);  // Chức vụ
    sheet.setColumnWidth(5, 550);  // Lời chúc

    // Đóng băng dòng 1 (Freeze header)
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// Trả về JSON với đầy đủ CORS header
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
