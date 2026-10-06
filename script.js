document.addEventListener("DOMContentLoaded", () => {
    const API_ENDPOINT = "https://api-cua-ban-kia.com/api/register"; 
    const USE_MOCK_TEST = true;
    const STATS_DATA_KEY = "real_youth_union_stats";
    const STATS_USERS_KEY = "real_youth_union_users";

    const UNITS = [
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

    const form = document.getElementById("certificateForm");
    const avatarInput = document.getElementById("avatarInput");
    const recropBtn = document.getElementById("recropBtn");
    const nameInput = document.getElementById("username");
    const unitSelect = document.getElementById("unit");
    const branchInput = document.getElementById("youthUnionBranch");
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

    let cropper = null;
    let currentRawImageUrl = null;
    let userCroppedImage = null;
    let currentSortMode = "name_asc";

    UNITS.forEach((unitName) => {
        const opt = document.createElement("option");
        opt.value = unitName;
        opt.textContent = unitName;
        unitSelect.appendChild(opt);
    });

    function updatePreviewName() {
        if (!previewName) return;
        const name = (nameInput.value || "").trim().toUpperCase() || "NGUYỄN VĂN A";
        previewName.textContent = name;
        if (name.length > 26) {
            previewName.style.fontSize = "clamp(8px, 1.65cqi, 32px)";
        } else if (name.length > 18) {
            previewName.style.fontSize = "clamp(9px, 1.95cqi, 38px)";
        } else {
            previewName.style.fontSize = "clamp(10px, 2.3cqi, 46px)";
        }
    }

    function updatePreviewUnit() {
        if (!previewUnit) return;
        const u = (unitSelect.value || "").trim() || "Đoàn trường Đại học Hà Tĩnh";
        previewUnit.textContent = u;
        if (u.length > 36) {
            previewUnit.style.fontSize = "clamp(7px, 1.25cqi, 24px)";
        } else if (u.length > 25) {
            previewUnit.style.fontSize = "clamp(8px, 1.45cqi, 28px)";
        } else {
            previewUnit.style.fontSize = "clamp(8.5px, 1.65cqi, 32px)";
        }
    }

    nameInput.addEventListener("input", updatePreviewName);
    unitSelect.addEventListener("change", updatePreviewUnit);

    function loadRealStats() {
        const stats = {};
        UNITS.forEach((u) => {
            stats[u] = 0;
        });

        const saved = localStorage.getItem(STATS_DATA_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                UNITS.forEach((u) => {
                    if (typeof parsed[u] === "number") {
                        stats[u] = parsed[u];
                    }
                });
            } catch (e) {}
        }
        return stats;
    }

    function loadRealUsers() {
        const saved = localStorage.getItem(STATS_USERS_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return new Set(Array.isArray(parsed) ? parsed : []);
            } catch (e) {}
        }
        return new Set();
    }

    function saveRealData(stats, usersSet) {
        localStorage.setItem(STATS_DATA_KEY, JSON.stringify(stats));
        localStorage.setItem(STATS_USERS_KEY, JSON.stringify(Array.from(usersSet)));
    }

    const realStats = loadRealStats();
    const realUsersSet = loadRealUsers();

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

        const totalCount = Object.values(realStats).reduce((a, b) => a + b, 0);
        if (totalCertCountElem) {
            totalCertCountElem.textContent = totalCount.toLocaleString("vi-VN");
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

    renderStatsTable();

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

        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }

        return await response.json();
    }

    async function generateAndDownloadCertificate(fullName, unit, branch) {
        if (document.fonts) {
            await document.fonts.ready;
        }

        const ctx = exportCanvas.getContext("2d");
        exportCanvas.width = 1920;
        exportCanvas.height = 1080;

        const bgImg = new Image();
        bgImg.src = "pics/thongdiep.png";
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

        ctx.drawImage(bgImg, 0, 0, 1920, 1080);

        const avatarCenterX = 265;
        const avatarCenterY = 475;
        const avatarRadius = 184;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
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

        ctx.textAlign = "left";
        ctx.fillStyle = "#FFE66D";
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        const displayName = (fullName || "NGUYỄN VĂN A").trim().toUpperCase();
        let nameFontSize = 48;
        if (displayName.length > 26) {
            nameFontSize = 36;
        } else if (displayName.length > 18) {
            nameFontSize = 42;
        }
        ctx.font = `800 ${nameFontSize}px 'Montserrat', sans-serif`;
        const maxNameWidth = 760;
        while (ctx.measureText(displayName).width > maxNameWidth && nameFontSize > 24) {
            nameFontSize -= 1;
            ctx.font = `800 ${nameFontSize}px 'Montserrat', sans-serif`;
        }
        ctx.fillText(displayName, 875, 295);

        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        const displayUnit = (unit || "Đoàn trường Đại học Hà Tĩnh").trim();
        let unitFontSize = 34;
        if (displayUnit.length > 36) {
            unitFontSize = 26;
        } else if (displayUnit.length > 25) {
            unitFontSize = 30;
        }
        ctx.font = `700 ${unitFontSize}px 'Montserrat', sans-serif`;
        const maxUnitWidth = 750;
        while (ctx.measureText(displayUnit).width > maxUnitWidth && unitFontSize > 18) {
            unitFontSize -= 1;
            ctx.font = `700 ${unitFontSize}px 'Montserrat', sans-serif`;
        }
        ctx.fillText(displayUnit, 825, 380);

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
        const unit = unitSelect.value.trim();
        const youthUnionBranch = branchInput.value.trim();

        if (!fullName) {
            alert("Vui lòng nhập Họ và tên!");
            nameInput.focus();
            return;
        }

        if (!unit) {
            alert("Vui lòng chọn Địa phương/Đơn vị!");
            unitSelect.focus();
            return;
        }

        if (!youthUnionBranch) {
            alert("Vui lòng nhập Tổ chức đoàn nơi tham gia sinh hoạt!");
            branchInput.focus();
            return;
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
                youthUnionBranch: youthUnionBranch,
                avatarStatus: userCroppedImage ? "Đã tải ảnh" : "Chưa tải ảnh"
            };

            await sendDataToDatabase(payload);
            await generateAndDownloadCertificate(fullName, unit, youthUnionBranch);

            const cleanFullName = fullName.trim().toLowerCase().replace(/\s+/g, " ");
            const cleanUnit = unit.trim().toLowerCase();
            const cleanBranch = youthUnionBranch.trim().toLowerCase().replace(/\s+/g, " ");
            const userFingerprint = `${cleanFullName}|${cleanUnit}|${cleanBranch}`;
            const isDuplicate = realUsersSet.has(userFingerprint);

            if (!isDuplicate) {
                realUsersSet.add(userFingerprint);
                realStats[unit] = (realStats[unit] || 0) + 1;
                saveRealData(realStats, realUsersSet);
                renderStatsTable(statsSearchInput ? statsSearchInput.value : "");

                statusMsg.className = "status_msg success";
                statusMsg.textContent = `✓ Cấp và tải giấy chứng nhận thành công! (+1 lượt tham gia cho ${unit})`;
            } else {
                statusMsg.className = "status_msg success";
                statusMsg.textContent = "✓ Tải giấy chứng nhận thành công! (Lưu ý: Bạn đã hoàn thành trước đó nên hệ thống không tính thêm lượt trùng)";
            }

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

            await generateAndDownloadCertificate(fullName, unit, youthUnionBranch);
        } finally {
            downloadBtn.disabled = false;
            btnSpinner.style.display = "none";
            btnText.textContent = "Tải ảnh về";
        }
    });
});