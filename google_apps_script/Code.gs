/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - API NHẬN THÔNG TIN & THỐNG KÊ ĐẠI HỘI ĐOÀN TỈNH HÀ TĨNH
 * Hỗ trợ:
 * 1. Tự động quản lý danh sách đơn vị trong tab "DanhSach_DonVi"
 * 2. Lưu thông tin đăng ký vào tab "ThongKe_DaiHoi" (đã đổi trường Lời chúc -> Tổ chức đoàn sinh hoạt)
 * 3. Cung cấp API GET trả về danh sách đơn vị + số liệu thống kê cho Web
 * 4. Trigger tự động chốt thống kê lúc 24h hàng ngày vào tab "ThongKe_TongHop_24h"
 * =========================================================================
 */

// Danh sách 74 đơn vị ban đầu của Tỉnh Đoàn Hà Tĩnh (Dùng khởi tạo tab DanhSach_DonVi)
function getDefaultUnitsList() {
  return [
    "Đoàn TNCS Hồ Chí Minh UBND tỉnh",
    "Đoàn TNCS Hồ Chí Minh Công an Tỉnh",
    "Đoàn trường Đại học Hà Tĩnh",
    "Đoàn TNCS Hồ Chí Minh các cơ quan Đảng tỉnh",
    "Đoàn TNCS Hồ Chí Minh Bộ chỉ huy Quân sự tỉnh",
    "Đoàn phường Thành Sen",
    "Đoàn phường Trần Phú",
    "Đoàn phường Hà Huy Tập",
    "Đoàn Xã Thạch Lạc",
    "Đoàn Xã Đồng Tiến",
    "Đoàn Xã Thạch Khê",
    "Đoàn Xã Cẩm Bình",
    "Đoàn Phường Sông Trí",
    "Đoàn Phường Hải Ninh",
    "Đoàn Phường Hoành Sơn",
    "Đoàn Phường Vũng Áng",
    "Đoàn Phường Bắc Hồng Lĩnh",
    "Đoàn Phường Nam Hồng Lĩnh",
    "Đoàn Xã Kỳ Xuân",
    "Đoàn Xã Kỳ Anh",
    "Đoàn Xã Kỳ Hoa",
    "Đoàn Xã Kỳ Văn",
    "Đoàn Xã Kỳ Khang",
    "Đoàn Xã Kỳ Lạc",
    "Đoàn Xã Kỳ Thượng",
    "Đoàn Xã Cẩm Xuyên",
    "Đoàn Xã Thiên Cầm",
    "Đoàn Xã Cẩm Duệ",
    "Đoàn Xã Cẩm Hưng",
    "Đoàn Xã Cẩm Lạc",
    "Đoàn Xã Cẩm Trung",
    "Đoàn Xã Yên Hòa",
    "Đoàn Xã Thạch Hà",
    "Đoàn Xã Toàn Lưu",
    "Đoàn Xã Việt Xuyên",
    "Đoàn Xã Đông Kinh",
    "Đoàn Xã Thạch Xuân",
    "Đoàn Xã Lộc Hà",
    "Đoàn Xã Hồng Lộc",
    "Đoàn Xã Mai Phụ",
    "Đoàn Xã Can Lộc",
    "Đoàn Xã Tùng Lộc",
    "Đoàn Xã Gia Hanh",
    "Đoàn Xã Trường Lưu",
    "Đoàn Xã Xuân Lộc",
    "Đoàn Xã Đồng Lộc",
    "Đoàn Xã Tiên Điền",
    "Đoàn Xã Nghi Xuân",
    "Đoàn Xã Cổ Đạm",
    "Đoàn Xã Đan Hải",
    "Đoàn Xã Đức Thọ",
    "Đoàn Xã Đức Đồng",
    "Đoàn Xã Đức Quang",
    "Đoàn Xã Đức Thịnh",
    "Đoàn Xã Đức Minh",
    "Đoàn Xã Hương Sơn",
    "Đoàn Xã Sơn Tây",
    "Đoàn Xã Tứ Mỹ",
    "Đoàn Xã Sơn Giang",
    "Đoàn Xã Sơn Tiến",
    "Đoàn Xã Sơn Hồng",
    "Đoàn Xã Kim Hoa",
    "Đoàn Xã Sơn Kim 1",
    "Đoàn Xã Sơn Kim 2",
    "Đoàn Xã Vũ Quang",
    "Đoàn Xã Mai Hoa",
    "Đoàn Xã Thượng Đức",
    "Đoàn Xã Hương Khê",
    "Đoàn Xã Hương Phố",
    "Đoàn Xã Hương Đô",
    "Đoàn Xã Hà Linh",
    "Đoàn Xã Hương Bình",
    "Đoàn Xã Phúc Trạch",
    "Đoàn Xã Hương Xuân"
  ];
}

// Hàm hỗ trợ tạo Sheet lưu Danh sách đơn vị nếu chưa có
function getOrCreateUnitsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "DanhSach_DonVi";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // Nếu sheet còn trống, tự động nạp tiêu đề và 74 đơn vị ban đầu
  if (sheet.getLastRow() === 0) {
    var headers = ["STT", "Tên địa phương / Đơn vị", "Ghi chú"];
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1e40af");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);

    var defaultList = getDefaultUnitsList();
    var rowsToInsert = [];
    for (var i = 0; i < defaultList.length; i++) {
      rowsToInsert.push([i + 1, defaultList[i], ""]);
    }
    sheet.getRange(2, 1, rowsToInsert.length, 3).setValues(rowsToInsert);

    sheet.setColumnWidth(1, 60);   // STT
    sheet.setColumnWidth(2, 350);  // Tên đơn vị
    sheet.setColumnWidth(3, 200);  // Ghi chú
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// Đọc danh sách các đơn vị từ tab DanhSach_DonVi trên Google Sheet
function getUnitsListFromSheet() {
  var unitsSheet = getOrCreateUnitsSheet();
  var lastRow = unitsSheet.getLastRow();
  var units = [];

  if (lastRow >= 2) {
    var values = unitsSheet.getRange(2, 2, lastRow - 1, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      var name = (values[i][0] || "").toString().trim();
      if (name && units.indexOf(name) === -1) {
        units.push(name);
      }
    }
  }

  return units.length > 0 ? units : getDefaultUnitsList();
}

// Hàm xử lý khi nhận POST request từ Website (Lưu đăng ký)
function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);

    var sheet = getOrCreateTargetSheet();
    var payload = {};

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
    var unit = (payload.unit || payload.role || "").trim();
    var branch = (payload.youthUnionBranch || payload.branch || "").trim();
    var clientTime = (payload.savedAt || payload.timestamp || "").trim();

    var vnTime = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    var lastRow = sheet.getLastRow();
    var stt = Math.max(1, lastRow);

    sheet.appendRow([
      stt,                    // Cột A: STT
      clientTime || vnTime,   // Cột B: Thời gian ghi nhận
      name || "Khách",        // Cột C: Họ và tên
      unit || "Đoàn viên",    // Cột D: Địa phương / Đơn vị
      branch || ""            // Cột E: Tổ chức đoàn nơi tham gia sinh hoạt
    ]);

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

// Hàm kiểm tra và cung cấp Danh sách đơn vị + Thống kê khi Web gọi GET request
function doGet(e) {
  var sheet = getOrCreateTargetSheet();
  var lastRow = sheet.getLastRow();
  var count = Math.max(0, lastRow - 1);
  var action = (e && e.parameter && e.parameter.action) || "";

  var unitsList = getUnitsListFromSheet();
  var unitCounts = {};
  var submissions = [];

  if (lastRow > 1) {
    var values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      var u = (row[3] || "").toString().trim();
      if (u) {
        unitCounts[u] = (unitCounts[u] || 0) + 1;
      }
      if (action === "all" || action === "details") {
        submissions.push({
          stt: row[0],
          time: row[1],
          fullName: row[2],
          unit: row[3],
          youthUnionBranch: row[4]
        });
      }
    }
  }

  return createJsonResponse({
    success: true,
    status: "ACTIVE",
    service: "Hệ thống API Lưu trữ Thông tin Đại hội Đoàn tỉnh Hà Tĩnh",
    total_submissions: count,
    units: unitsList,
    unit_counts: unitCounts,
    data: (action === "all" || action === "details") ? submissions : undefined,
    server_time: Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss")
  });
}

// Hàm hỗ trợ tạo Sheet lưu đăng ký và Tiêu đề bảng nếu chưa có
function getOrCreateTargetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "ThongKe_DaiHoi";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    var headers = [
      "STT",
      "Thời gian ghi nhận",
      "Họ và tên",
      "Địa phương / Đơn vị",
      "Tổ chức đoàn nơi tham gia sinh hoạt"
    ];
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0056b3");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);

    sheet.setColumnWidth(1, 60);   // STT
    sheet.setColumnWidth(2, 160);  // Thời gian
    sheet.setColumnWidth(3, 220);  // Họ tên
    sheet.setColumnWidth(4, 280);  // Địa phương / Đơn vị
    sheet.setColumnWidth(5, 380);  // Tổ chức đoàn nơi tham gia sinh hoạt

    sheet.setFrozenRows(1);
  }

  return sheet;
}

// Trả về JSON với đầy đủ MIME type
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * TRIGGER CHỐT THỐNG KÊ 24H HÀNG NGÀY (CHẠY TỰ ĐỘNG BẰNG GOOGLE APPS SCRIPT)
 * Cài đặt: Trình kích hoạt (Triggers) > Thêm trình kích hoạt > Chọn dailySnapshotTrigger
 * Loại sự kiện: Theo thời gian > Bộ hẹn giờ theo ngày > 23h đến 24h (nửa đêm)
 */
function dailySnapshotTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = getOrCreateTargetSheet();
  var snapshotSheetName = "ThongKe_TongHop_24h";
  var snapshotSheet = ss.getSheetByName(snapshotSheetName);

  if (!snapshotSheet) {
    snapshotSheet = ss.insertSheet(snapshotSheetName);
  }

  var lastRow = sourceSheet.getLastRow();
  var unitCounts = {};
  var totalRows = 0;

  if (lastRow > 1) {
    var values = sourceSheet.getRange(2, 1, lastRow - 1, 5).getValues();
    totalRows = values.length;
    for (var i = 0; i < values.length; i++) {
      var unit = (values[i][3] || "").toString().trim();
      if (unit) {
        unitCounts[unit] = (unitCounts[unit] || 0) + 1;
      }
    }
  }

  snapshotSheet.clear();

  var nowStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  snapshotSheet.appendRow(["BẢNG CHỐT SỐ LIỆU ĐẠI HỘI - TỰ ĐỘNG LÚC 24H HÀNG NGÀY", "", ""]);
  snapshotSheet.appendRow(["Thời điểm chốt số liệu:", nowStr, "Tổng lượt ghi nhận: " + totalRows]);
  snapshotSheet.appendRow([]);
  snapshotSheet.appendRow(["STT", "Địa phương / Đơn vị", "Số lượt tham gia"]);

  var titleRange = snapshotSheet.getRange(1, 1, 1, 3);
  titleRange.setBackground("#1e40af");
  titleRange.setFontColor("#ffffff");
  titleRange.setFontWeight("bold");

  var headerRange = snapshotSheet.getRange(4, 1, 1, 3);
  headerRange.setBackground("#0056b3");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");

  var sortedUnits = Object.keys(unitCounts).sort(function(a, b) {
    return unitCounts[b] - unitCounts[a];
  });

  for (var j = 0; j < sortedUnits.length; j++) {
    snapshotSheet.appendRow([j + 1, sortedUnits[j], unitCounts[sortedUnits[j]]]);
  }

  snapshotSheet.setColumnWidth(1, 60);
  snapshotSheet.setColumnWidth(2, 320);
  snapshotSheet.setColumnWidth(3, 160);
}
