document.addEventListener("DOMContentLoaded", () => {
    // Google Apps Script Web App Deployment URL
    // Deployment ID: AKfycbzSbYYU_YjPhWyFpwGRticZdv4GjYgK5J7I-X-gErII_zO3jl57LG5_hj58QoAVqtJ-
    const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbzSbYYU_YjPhWyFpwGRticZdv4GjYgK5J7I-X-gErII_zO3jl57LG5_hj58QoAVqtJ-/exec";
    const USE_MOCK_TEST = false;
    const SHEET_ID = "1ky8mIRUtOG57mQXaxpSfOAeH_J-aBCiIHCTU-34IIXc";
    const SHEET_GID = "465318084";
    const SHEET_GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;
    const STATS_DATA_KEY = "sheet_youth_union_stats";
    const STATS_USERS_KEY = "sheet_youth_union_users";
    const STATS_LAST_SYNC_KEY = "sheet_stats_last_sync";
    const STATS_TOTAL_KEY = "sheet_stats_total_submissions";
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 giờ tự động làm mới
    const CACHE_UNITS_KEY = "sheet_cached_units";

    const DEFAULT_UNITS = [
        "Đoàn TNCS Hồ Chí Minh UBND tỉnh",
        "Đoàn TNCS Hồ Chí Minh Công an Tỉnh",
        "Đoàn trường Đại học Hà Tĩnh",
        "Đoàn TNCS Hồ Chí Minh các cơ quan Đảng tỉnh",
        "Đoàn TNCS Hồ Chí Minh Bộ chỉquy Quân sự tỉnh",
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

    function loadCachedUnits() {
        const saved = localStorage.getItem(CACHE_UNITS_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) { }
        }
        return [...DEFAULT_UNITS];
    }

    let UNITS = loadCachedUnits();

    const form = document.getElementById("certificateForm");
    const avatarInput = document.getElementById("avatarInput");
    const recropBtn = document.getElementById("recropBtn");
    const nameInput = document.getElementById("username");
    const unitSelect = document.getElementById("unit");
    const unitWrapper = document.getElementById("unitWrapper");
    const unitArrow = document.getElementById("unitArrow");
    const unitDropdown = document.getElementById("unitDropdown");
    const downloadBtn = document.getElementById("downloadBtn");
    const btnText = downloadBtn.querySelector(".btn_text");
    const btnSpinner = document.getElementById("btnSpinner");
    const statusMsg = document.getElementById("statusMsg");

    const avatarPreview = document.getElementById("img_choosen");
    const certAvatarClickable = document.getElementById("certAvatarClickable");
    const previewName = document.getElementById("previewName");
    const previewUnit = document.getElementById("previewUnit");
    const exportCanvas = document.getElementById("exportCanvas");

    const cropModal = document.getElementById("cropModal");
    const cropperImage = document.getElementById("cropperImage");
    const closeCropModal = document.getElementById("closeCropModal");
    const cancelCropBtn = document.getElementById("cancelCropBtn");
    const applyCropBtn = document.getElementById("applyCropBtn");
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const rotateLeftBtn = document.getElementById("rotateLeftBtn");

    const statsSearchInput = document.getElementById("statsSearchInput");
    const statsSortSelect = document.getElementById("statsSortSelect");
    const statsTableBody = document.getElementById("statsTableBody");
    const totalCertCountElem = document.getElementById("totalCertCount");
    const topUnitNameElem = document.getElementById("topUnitName");
    const filteredUnitCountElem = document.getElementById("filteredUnitCount");
    const totalUnitsBadgeElem = document.getElementById("totalUnitsBadge");
    const refreshStatsBtn = document.getElementById("refreshStatsBtn");
    const statsSyncTimeElem = document.getElementById("statsSyncTime");

    let cropper = null;
    let currentRawImageUrl = null;
    let userCroppedImage = null;
    let currentSortMode = "name_asc";
    let activeDropdownIndex = -1;

    function renderUnitDropdown(filterText = "") {
        if (!unitDropdown) return;
        const keyword = (filterText || "").trim().toLowerCase();
        const filtered = UNITS.filter((u) => u.toLowerCase().includes(keyword));

        unitDropdown.innerHTML = "";
        activeDropdownIndex = -1;

        if (filtered.length === 0) {
            const noMatch = document.createElement("div");
            noMatch.className = "searchable_no_match";
            noMatch.textContent = "Không tìm thấy đơn vị phù hợp";
            unitDropdown.appendChild(noMatch);
            return;
        }

        filtered.forEach((unitName) => {
            const item = document.createElement("div");
            item.className = "searchable_option_item";
            if (unitSelect && unitSelect.value.trim() === unitName) {
                item.classList.add("selected");
            }

            if (keyword) {
                const lowerName = unitName.toLowerCase();
                const matchStart = lowerName.indexOf(keyword);
                if (matchStart !== -1) {
                    const before = unitName.substring(0, matchStart);
                    const matched = unitName.substring(matchStart, matchStart + keyword.length);
                    const after = unitName.substring(matchStart + keyword.length);
                    item.innerHTML = `${before}<span class="highlight_match">${matched}</span>${after}`;
                } else {
                    item.textContent = unitName;
                }
            } else {
                item.textContent = unitName;
            }

            item.addEventListener("mousedown", (e) => {
                e.preventDefault();
                selectUnitOption(unitName);
            });

            unitDropdown.appendChild(item);
        });
    }

    function openUnitDropdown() {
        if (!unitDropdown) return;
        renderUnitDropdown(unitSelect ? unitSelect.value : "");
        unitDropdown.style.display = "block";
        if (unitWrapper) unitWrapper.classList.add("is_open");
    }

    function closeUnitDropdown() {
        if (!unitDropdown) return;
        unitDropdown.style.display = "none";
        if (unitWrapper) unitWrapper.classList.remove("is_open");
        activeDropdownIndex = -1;
    }

    function selectUnitOption(unitName) {
        if (!unitSelect) return;
        unitSelect.value = unitName;
        closeUnitDropdown();
        updatePreviewUnit();
    }

    function updateActiveDropdownItem(items) {
        items.forEach((item, idx) => {
            if (idx === activeDropdownIndex) {
                item.classList.add("hovered");
                item.scrollIntoView({ block: "nearest" });
            } else {
                item.classList.remove("hovered");
            }
        });
    }

    function populateUnitSelect(unitList) {
        if (totalUnitsBadgeElem) {
            totalUnitsBadgeElem.textContent = unitList.length;
        }
        if (unitDropdown && unitDropdown.style.display === "block") {
            renderUnitDropdown(unitSelect ? unitSelect.value : "");
        }
    }

    populateUnitSelect(UNITS);

    function updatePreviewName() {
        if (!previewName) return;
        const name = (nameInput.value || "").trim().toUpperCase();
        previewName.textContent = name;
        if (name.length > 26) {
            previewName.style.fontSize = "clamp(7.5px, 1.4cqi, 28px)";
        } else if (name.length > 18) {
            previewName.style.fontSize = "clamp(8.5px, 1.7cqi, 34px)";
        } else {
            previewName.style.fontSize = "clamp(9px, 1.95cqi, 40px)";
        }
    }

    function updatePreviewUnit() {
        if (!previewUnit) return;
        const u = (unitSelect.value || "").trim();
        previewUnit.textContent = u;
        if (u.length > 40) {
            previewUnit.style.fontSize = "clamp(6.5px, 1.15cqi, 22px)";
        } else if (u.length > 28) {
            previewUnit.style.fontSize = "clamp(7px, 1.25cqi, 24px)";
        } else {
            previewUnit.style.fontSize = "clamp(7.5px, 1.35cqi, 26px)";
        }
    }

    nameInput.addEventListener("input", updatePreviewName);

    if (unitSelect) {
        unitSelect.addEventListener("focus", openUnitDropdown);
        unitSelect.addEventListener("click", openUnitDropdown);
        unitSelect.addEventListener("input", () => {
            renderUnitDropdown(unitSelect.value);
            if (unitDropdown && unitDropdown.style.display !== "block") {
                openUnitDropdown();
            }
            updatePreviewUnit();
        });

        unitSelect.addEventListener("keydown", (e) => {
            if (!unitDropdown || unitDropdown.style.display !== "block") {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    openUnitDropdown();
                    e.preventDefault();
                }
                return;
            }

            const items = unitDropdown.querySelectorAll(".searchable_option_item");
            if (items.length === 0) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                activeDropdownIndex = (activeDropdownIndex + 1) % items.length;
                updateActiveDropdownItem(items);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                activeDropdownIndex = (activeDropdownIndex - 1 + items.length) % items.length;
                updateActiveDropdownItem(items);
            } else if (e.key === "Enter") {
                if (activeDropdownIndex >= 0 && activeDropdownIndex < items.length) {
                    e.preventDefault();
                    items[activeDropdownIndex].dispatchEvent(new MouseEvent("mousedown"));
                }
            } else if (e.key === "Escape") {
                closeUnitDropdown();
            }
        });
    }

    if (unitArrow) {
        unitArrow.addEventListener("click", (e) => {
            e.stopPropagation();
            if (unitDropdown && unitDropdown.style.display === "block") {
                closeUnitDropdown();
            } else {
                if (unitSelect) unitSelect.focus();
                openUnitDropdown();
            }
        });
    }

    document.addEventListener("click", (e) => {
        if (unitWrapper && !unitWrapper.contains(e.target)) {
            closeUnitDropdown();
        }
    });

    function updateSyncTimeDisplay(timestamp) {
        if (!statsSyncTimeElem) return;
        statsSyncTimeElem.textContent = "Bảng theo dõi số lượt tải chứng nhận thực tế (hệ thống tự động cập nhật vào 24h hàng ngày)";
    }

    function loadLocalCachedData() {
        const stats = {};
        UNITS.forEach((u) => { stats[u] = 0; });

        const savedStats = localStorage.getItem(STATS_DATA_KEY);
        if (savedStats) {
            try {
                const parsed = JSON.parse(savedStats);
                UNITS.forEach((u) => {
                    if (typeof parsed[u] === "number") stats[u] = parsed[u];
                });
            } catch (e) { }
        }

        const savedUsers = localStorage.getItem(STATS_USERS_KEY);
        const usersSet = new Set();
        if (savedUsers) {
            try {
                const parsed = JSON.parse(savedUsers);
                if (Array.isArray(parsed)) parsed.forEach((u) => usersSet.add(u));
            } catch (e) { }
        }

        return { stats, usersSet };
    }

    function saveLocalCachedData(stats, usersSet, total = null) {
        localStorage.setItem(STATS_DATA_KEY, JSON.stringify(stats));
        localStorage.setItem(STATS_USERS_KEY, JSON.stringify(Array.from(usersSet)));
        if (total !== null) {
            localStorage.setItem(STATS_TOTAL_KEY, String(total));
        }
    }

    const { stats: realStats, usersSet: realUsersSet } = loadLocalCachedData();
    let totalSubmissionsCount = parseInt(localStorage.getItem(STATS_TOTAL_KEY) || "0", 10);

    function renderStatsTable(filterText = "") {
        if (!statsTableBody) return;

        const keyword = filterText.toLowerCase().trim();
        let list = UNITS.map((unit) => ({
            unit: unit,
            count: realStats[unit] || 0
        }));

        if (keyword) {
            list = list.filter((item) => item.unit.toLowerCase().includes(keyword));
        }

        if (filteredUnitCountElem) {
            filteredUnitCountElem.textContent = list.length;
        }
        if (totalUnitsBadgeElem) {
            totalUnitsBadgeElem.textContent = UNITS.length;
        }

        const sumCount = Object.values(realStats).reduce((a, b) => a + b, 0);
        const displayTotal = Math.max(totalSubmissionsCount, sumCount);
        if (totalCertCountElem) {
            totalCertCountElem.textContent = displayTotal.toLocaleString("vi-VN");
        }

        let maxUnit = null;
        let maxVal = 0;
        Object.entries(realStats).forEach(([u, count]) => {
            if (count > maxVal) {
                maxVal = count;
                maxUnit = u;
            }
        });

        if (topUnitNameElem) {
            if (maxVal > 0 && maxUnit) {
                topUnitNameElem.textContent = `${maxUnit} (${maxVal} lượt)`;
            } else {
                topUnitNameElem.textContent = "Chưa có dữ liệu";
            }
        }

        list.sort((a, b) => {
            if (currentSortMode === "name_asc") {
                return a.unit.localeCompare(b.unit, "vi", { sensitivity: "base" });
            } else if (currentSortMode === "name_desc") {
                return b.unit.localeCompare(a.unit, "vi", { sensitivity: "base" });
            } else if (currentSortMode === "count_desc") {
                if (b.count !== a.count) return b.count - a.count;
                return a.unit.localeCompare(b.unit, "vi", { sensitivity: "base" });
            } else if (currentSortMode === "count_asc") {
                if (a.count !== b.count) return a.count - b.count;
                return a.unit.localeCompare(b.unit, "vi", { sensitivity: "base" });
            }
            return 0;
        });

        statsTableBody.innerHTML = "";

        if (list.length === 0) {
            statsTableBody.innerHTML = `<tr><td colspan="4" class="table_empty_row">Không tìm thấy đơn vị phù hợp với từ khóa "${filterText}".</td></tr>`;
            return;
        }

        list.forEach((item, index) => {
            const row = document.createElement("tr");
            if (item.count > 0) row.classList.add("has_downloads");

            let pillClass = "count_pill zero";
            if (item.count > 0) {
                pillClass = (item.count === maxVal && maxVal > 0) ? "count_pill leader" : "count_pill active";
            }

            const percent = maxVal > 0 ? Math.round((item.count / maxVal) * 100) : 0;

            row.innerHTML = `
                <td class="col_stt">${index + 1}</td>
                <td class="col_unit">${item.unit}</td>
                <td class="col_count"><span class="${pillClass}">${item.count} lượt</span></td>
                <td class="col_progress">
                    <div class="table_progress_track">
                        <div class="table_progress_fill" style="width: ${percent}%;"></div>
                    </div>
                </td>
            `;
            statsTableBody.appendChild(row);
        });
    }

    async function fetchStatsFromSheet(force = false) {
        const now = Date.now();
        const lastSync = localStorage.getItem(STATS_LAST_SYNC_KEY);

        // 1. Hiển thị ngay dữ liệu cache để trang tải tức thì 0ms
        if (lastSync) {
            updateSyncTimeDisplay(lastSync);
            renderStatsTable(statsSearchInput ? statsSearchInput.value : "");
        }

        if (refreshStatsBtn) refreshStatsBtn.classList.add("loading");

        let syncSuccess = false;

        try {
            // 1. Luôn đồng bộ danh sách đơn vị và số liệu thống kê mới nhất từ Google Apps Script
            try {
                const apiRes = await fetch(`${API_ENDPOINT}?_t=${now}`, {
                    cache: "no-store"
                });
                const apiJson = await apiRes.json();
                if (apiJson && apiJson.success) {
                    // Cập nhật danh sách đơn vị từ tab DanhSach_DonVi trên Sheet
                    if (Array.isArray(apiJson.units) && apiJson.units.length > 0) {
                        UNITS = apiJson.units;
                        localStorage.setItem(CACHE_UNITS_KEY, JSON.stringify(UNITS));
                        populateUnitSelect(UNITS);
                    }

                    // Cập nhật số liệu thống kê từng đơn vị theo dữ liệu thực tế trên Sheet
                    UNITS.forEach((u) => {
                        realStats[u] = (apiJson.unit_counts && apiJson.unit_counts[u]) || 0;
                    });

                    // Cập nhật tổng số lượt tải
                    if (typeof apiJson.total_submissions === "number") {
                        totalSubmissionsCount = apiJson.total_submissions;
                    } else {
                        totalSubmissionsCount = Object.values(realStats).reduce((a, b) => a + b, 0);
                    }

                    // Nếu trên Sheet đã bị xóa sạch (0 lượt), đặt lại danh sách trùng lặp
                    if (totalSubmissionsCount === 0) {
                        realUsersSet.clear();
                    }

                    saveLocalCachedData(realStats, realUsersSet, totalSubmissionsCount);
                    localStorage.setItem(STATS_LAST_SYNC_KEY, String(now));
                    updateSyncTimeDisplay(now);

                    renderStatsTable(statsSearchInput ? statsSearchInput.value : "");
                    syncSuccess = true;
                }
            } catch (apiErr) {
                console.warn("API Apps Script chưa phản hồi, thử tải qua GViz:", apiErr);
            }

            // 2. Dự phòng: Nếu API chưa trả về, tải trực tiếp qua GViz từ Google Sheet
            if (!syncSuccess) {
                try {
                    const response = await fetch(`${SHEET_GVIZ_URL}&_t=${now}`, {
                        cache: "no-store"
                    });
                    if (!response.ok) throw new Error("HTTP error: " + response.status);
                    const text = await response.text();

                    const jsonStart = text.indexOf("{");
                    const jsonEnd = text.lastIndexOf("}");
                    if (jsonStart === -1 || jsonEnd === -1) throw new Error("Phản hồi GViz không hợp lệ");

                    const gvizData = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
                    const rows = (gvizData.table && gvizData.table.rows) || [];

                    const newStats = {};
                    UNITS.forEach((u) => { newStats[u] = 0; });
                    const newUsersSet = new Set();
                    let validRowCount = 0;

                    const normalizeText = (s) => (s || "").toLowerCase().trim().replace(/\s+/g, " ");
                    const unitLookup = new Map();
                    UNITS.forEach((u) => {
                        unitLookup.set(normalizeText(u), u);
                    });

                    rows.forEach((row) => {
                        if (!row || !row.c) return;
                        const col0 = row.c[0]?.v ? String(row.c[0].v).trim() : "";
                        const name = row.c[2]?.v ? String(row.c[2].v).trim() : "";
                        const unitVal = row.c[3]?.v ? String(row.c[3].v).trim() : "";
                        const branchVal = row.c[4]?.v ? String(row.c[4].v).trim() : "";

                        // Bỏ qua dòng tiêu đề
                        if (col0 === "STT" || name === "Họ và tên" || unitVal === "Địa phương / Đơn vị") return;
                        if (!unitVal) return;

                        const normUnit = normalizeText(unitVal);
                        let matchedUnit = unitLookup.get(normUnit);

                        if (!matchedUnit) {
                            for (const u of UNITS) {
                                const normU = normalizeText(u);
                                if (normUnit.includes(normU) || normU.includes(normUnit)) {
                                    matchedUnit = u;
                                    break;
                                }
                            }
                        }

                        if (matchedUnit) {
                            validRowCount++;
                            const fingerprint = `${normalizeText(name)}|${normalizeText(matchedUnit)}|${normalizeText(branchVal)}`;
                            if (!newUsersSet.has(fingerprint)) {
                                newUsersSet.add(fingerprint);
                                newStats[matchedUnit] = (newStats[matchedUnit] || 0) + 1;
                            }
                        }
                    });

                    UNITS.forEach((u) => {
                        realStats[u] = newStats[u] || 0;
                    });
                    realUsersSet.clear();
                    newUsersSet.forEach((u) => realUsersSet.add(u));
                    totalSubmissionsCount = validRowCount;

                    saveLocalCachedData(realStats, realUsersSet, totalSubmissionsCount);
                    localStorage.setItem(STATS_LAST_SYNC_KEY, String(now));

                    updateSyncTimeDisplay(now);
                    renderStatsTable(statsSearchInput ? statsSearchInput.value : "");
                    syncSuccess = true;

                } catch (error) {
                    console.warn("Không thể tải qua GViz:", error);
                    const cachedTime = localStorage.getItem(STATS_LAST_SYNC_KEY);
                    if (cachedTime) {
                        updateSyncTimeDisplay(cachedTime);
                    } else if (statsSyncTimeElem) {
                        statsSyncTimeElem.textContent = "Chưa kết nối được Sheet";
                    }
                    renderStatsTable(statsSearchInput ? statsSearchInput.value : "");
                }
            }
        } finally {
            if (refreshStatsBtn) refreshStatsBtn.classList.remove("loading");
        }
    }

    renderStatsTable();
    fetchStatsFromSheet(true);

    if (refreshStatsBtn) {
        refreshStatsBtn.addEventListener("click", () => {
            fetchStatsFromSheet(true);
        });
    }

    // Tự động làm mới khi người dùng quay lại tab trình duyệt
    window.addEventListener("focus", () => {
        fetchStatsFromSheet(true);
    });

    // Định kỳ tự động đồng bộ mỗi 30 giây
    setInterval(() => {
        fetchStatsFromSheet(true);
    }, 30000);

    if (statsSearchInput) {
        statsSearchInput.addEventListener("input", (e) => {
            renderStatsTable(e.target.value);
        });
    }

    if (statsSortSelect) {
        statsSortSelect.addEventListener("change", (e) => {
            currentSortMode = e.target.value;
            renderStatsTable(statsSearchInput ? statsSearchInput.value : "");
        });
    }

    function initCropper() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }

        cropper = new Cropper(cropperImage, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: "move",
            autoCropArea: 0.9,
            restore: false,
            guides: false,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
            minCropBoxWidth: 100,
            minCropBoxHeight: 100
        });
    }

    function openModalWithImage(imgUrl) {
        cropperImage.src = imgUrl;
        cropModal.style.display = "flex";
        setTimeout(() => {
            initCropper();
        }, 100);
    }

    function closeModal() {
        cropModal.style.display = "none";
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }

    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (currentRawImageUrl) {
            URL.revokeObjectURL(currentRawImageUrl);
        }

        currentRawImageUrl = URL.createObjectURL(file);
        openModalWithImage(currentRawImageUrl);
        recropBtn.style.display = "inline-flex";
    });

    recropBtn.addEventListener("click", () => {
        if (currentRawImageUrl) {
            openModalWithImage(currentRawImageUrl);
        } else {
            avatarInput.click();
        }
    });

    if (certAvatarClickable) {
        certAvatarClickable.addEventListener("click", () => {
            if (currentRawImageUrl) {
                openModalWithImage(currentRawImageUrl);
            } else {
                avatarInput.click();
            }
        });
    }

    closeCropModal.addEventListener("click", closeModal);
    cancelCropBtn.addEventListener("click", closeModal);

    zoomInBtn.addEventListener("click", () => {
        if (cropper) cropper.zoom(0.1);
    });

    zoomOutBtn.addEventListener("click", () => {
        if (cropper) cropper.zoom(-0.1);
    });

    rotateLeftBtn.addEventListener("click", () => {
        if (cropper) cropper.rotate(-90);
    });

    applyCropBtn.addEventListener("click", () => {
        if (!cropper) return;

        const croppedCanvas = cropper.getCroppedCanvas({
            width: 600,
            height: 600,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high"
        });

        const croppedDataUrl = croppedCanvas.toDataURL("image/png");
        avatarPreview.src = croppedDataUrl;

        const img = new Image();
        img.onload = () => {
            userCroppedImage = img;
        };
        img.src = croppedDataUrl;

        closeModal();
    });

    async function sendDataToDatabase(data) {
        if (USE_MOCK_TEST) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            return { success: true, message: "Mock saved" };
        }

        try {
            await fetch(API_ENDPOINT, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(data)
            });
            return { success: true };
        } catch (err) {
            console.warn("Gửi dữ liệu Google Apps Script thất bại:", err);
            return { success: false, error: err };
        }
    }

    async function generateAndDownloadCertificate(fullName, unit) {
        if (document.fonts) {
            await document.fonts.ready;
        }

        const ctx = exportCanvas.getContext("2d");
        exportCanvas.width = 2880;
        exportCanvas.height = 1620;

        const bgImg = new Image();
        bgImg.src = "pics/cc.png";
        if (bgImg.decode) {
            try {
                await bgImg.decode();
            } catch (e) {
                await new Promise((res, rej) => {
                    bgImg.onload = res;
                    bgImg.onerror = rej;
                });
            }
        } else {
            await new Promise((res, rej) => {
                if (bgImg.complete && bgImg.naturalWidth > 0) return res();
                bgImg.onload = res;
                bgImg.onerror = rej;
            });
        }

        ctx.drawImage(bgImg, 0, 0, 2880, 1620);

        const avatarCenterX = 474;
        const avatarCenterY = 625;
        const avatarRadius = 382;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.clip();

        const imgToDraw = userCroppedImage || avatarPreview;
        if (imgToDraw && imgToDraw.complete && imgToDraw.naturalWidth > 0) {
            ctx.drawImage(
                imgToDraw,
                avatarCenterX - avatarRadius,
                avatarCenterY - avatarRadius,
                avatarRadius * 2,
                avatarRadius * 2
            );
        } else {
            ctx.fillStyle = "#CBD5E1";
            ctx.fillRect(avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        }
        ctx.restore();

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius - 7, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        const displayName = (fullName || "").trim().toUpperCase();
        let nameFontSize = 52;
        if (displayName.length > 26) {
            nameFontSize = 38;
        } else if (displayName.length > 18) {
            nameFontSize = 44;
        }

        ctx.font = `800 ${nameFontSize}px 'Montserrat', sans-serif`;
        const maxLineWidth = 980;
        while ((ctx.measureText("ĐỒNG CHÍ: ").width + ctx.measureText(displayName).width > maxLineWidth) && nameFontSize > 26) {
            nameFontSize -= 1;
            ctx.font = `800 ${nameFontSize}px 'Montserrat', sans-serif`;
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("ĐỒNG CHÍ: ", 1020, 520);
        const nameLabelWidth = ctx.measureText("ĐỒNG CHÍ: ").width;

        ctx.fillStyle = "#FFE66D";
        ctx.fillText(displayName, 1020 + nameLabelWidth, 520);

        ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        const displayUnit = (unit || "").trim();
        let unitFontSize = 38;
        if (displayUnit.length > 40) {
            unitFontSize = 32;
        } else if (displayUnit.length > 28) {
            unitFontSize = 35;
        }

        ctx.font = `700 ${unitFontSize}px 'Montserrat', sans-serif`;
        const maxUnitLineWidth = 1500;
        while ((ctx.measureText("ĐƠN VỊ: ").width + ctx.measureText(displayUnit).width > maxUnitLineWidth) && unitFontSize > 20) {
            unitFontSize -= 1;
            ctx.font = `700 ${unitFontSize}px 'Montserrat', sans-serif`;
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("ĐƠN VỊ: ", 1020, 650);
        const unitLabelWidth = ctx.measureText("ĐƠN VỊ: ").width;

        ctx.fillText(displayUnit, 1020 + unitLabelWidth, 650);
        ctx.shadowColor = "transparent";

        exportCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, "_");
            a.download = `Thong_Diep_${cleanName || "Doan_Vien"}.png`;
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!userCroppedImage) {
            alert("Vui lòng chọn ảnh đại biểu và căn chỉnh góc mặt trước khi tiếp tục!");
            return;
        }

        const fullName = nameInput.value.trim();
        let unit = (unitSelect.value || "").trim();

        if (!fullName) {
            alert("Vui lòng nhập Họ và tên!");
            nameInput.focus();
            return;
        }

        if (!unit) {
            alert("Vui lòng chọn hoặc tìm kiếm Địa phương/Đơn vị!");
            unitSelect.focus();
            openUnitDropdown();
            return;
        }

        // Tự động chuẩn hóa nếu người dùng gõ tìm kiếm nhưng chưa bấm chọn từ danh sách
        const matchedUnit = UNITS.find((u) => u.toLowerCase() === unit.toLowerCase());
        if (matchedUnit) {
            unit = matchedUnit;
            unitSelect.value = matchedUnit;
        } else {
            const partial = UNITS.find((u) => u.toLowerCase().includes(unit.toLowerCase()));
            if (partial) {
                unit = partial;
                unitSelect.value = partial;
            } else {
                alert("Vui lòng chọn một đơn vị hợp lệ từ danh sách gợi ý!");
                unitSelect.focus();
                openUnitDropdown();
                return;
            }
        }

        downloadBtn.disabled = true;
        btnSpinner.style.display = "block";
        btnText.textContent = "Đang tạo ảnh...";
        statusMsg.textContent = "";

        try {
            const payload = {
                savedAt: new Date().toLocaleString("vi-VN"),
                fullName: fullName,
                unit: unit,
                avatarStatus: userCroppedImage ? "Đã tải ảnh" : "Chưa tải ảnh"
            };

            const sendPromise = sendDataToDatabase(payload);
            await generateAndDownloadCertificate(fullName, unit);
            await sendPromise;

            const cleanFullName = fullName.trim().toLowerCase().replace(/\s+/g, " ");
            const cleanUnit = unit.trim().toLowerCase();
            const userFingerprint = `${cleanFullName}|${cleanUnit}`;
            const isDuplicate = realUsersSet.has(userFingerprint);

            if (!isDuplicate) {
                realUsersSet.add(userFingerprint);
                saveLocalCachedData(realStats, realUsersSet, totalSubmissionsCount);

                statusMsg.className = "status_msg success";
                statusMsg.textContent = `✓ Đã lưu ảnh thành công! Lượt tham gia của bạn đã được ghi nhận vào hệ thống.`;
            } else {
                statusMsg.className = "status_msg success";
                statusMsg.textContent = "✓ Tải ảnh thành công! (Lưu ý: Bạn đã hoàn thành trước đó nên hệ thống không tính thêm lượt trùng)";
            }

            // Đồng bộ lại số liệu thống kê thực tế từ Google Sheet
            setTimeout(() => {
                fetchStatsFromSheet(true);
            }, 1200);

            if (typeof confetti === "function") {
                confetti({
                    particleCount: 150,
                    spread: 85,
                    origin: { y: 0.6 }
                });
            }
        } catch (error) {
            console.error(error);
            statusMsg.className = "status_msg error";
            statusMsg.textContent = "Lỗi kết nối máy chủ. Vẫn đang tạo chứng nhận cho bạn...";

            await generateAndDownloadCertificate(fullName, unit);
        } finally {
            downloadBtn.disabled = false;
            btnSpinner.style.display = "none";
            btnText.textContent = "Tải ảnh về";
        }
    });
});