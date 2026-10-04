document.addEventListener("DOMContentLoaded", () => {
    const API_ENDPOINT = "https://api-cua-ban-kia.com/api/register"; 
    const USE_MOCK_TEST = true;

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
    const previewBranch = document.getElementById("previewBranch");
    const exportCanvas = document.getElementById("exportCanvas");

    const cropModal = document.getElementById("cropModal");
    const cropperImage = document.getElementById("cropperImage");
    const closeCropModal = document.getElementById("closeCropModal");
    const cancelCropBtn = document.getElementById("cancelCropBtn");
    const applyCropBtn = document.getElementById("applyCropBtn");
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const rotateLeftBtn = document.getElementById("rotateLeftBtn");

    let cropper = null;
    let currentRawImageUrl = null;
    let userCroppedImage = null;

    UNITS.forEach((unitName) => {
        const opt = document.createElement("option");
        opt.value = unitName;
        opt.textContent = unitName;
        unitSelect.appendChild(opt);
    });

    nameInput.addEventListener("input", (e) => {
        previewName.textContent = e.target.value.trim().toUpperCase() || "NGUYỄN VĂN A";
    });

    unitSelect.addEventListener("change", (e) => {
        previewUnit.textContent = e.target.value || "Đoàn trường Đại học Hà Tĩnh";
    });

    branchInput.addEventListener("input", (e) => {
        previewBranch.textContent = e.target.value.trim() || "Chi đoàn Cán bộ Giảng viên";
    });

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

    function drawMetaPill(ctx, label, value, y) {
        ctx.font = "700 26px 'Montserrat', sans-serif";
        const labelW = ctx.measureText(label).width;
        ctx.font = "700 26px 'Montserrat', sans-serif";
        const valW = ctx.measureText(value).width;
        const totalTextW = labelW + valW + 12;

        const pillPadX = 32;
        const pillW = totalTextW + pillPadX * 2;
        const pillH = 52;
        const pillX = 960 - pillW / 2;
        const pillY = y - pillH / 2;

        ctx.fillStyle = "rgba(239, 246, 255, 0.85)";
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 26);
        ctx.fill();

        ctx.strokeStyle = "#BFDBFE";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const startTextX = 960 - totalTextW / 2;
        ctx.textAlign = "left";
        ctx.fillStyle = "#1E40AF";
        ctx.font = "700 26px 'Montserrat', sans-serif";
        ctx.fillText(label, startTextX, y + 8);

        ctx.fillStyle = "#0F172A";
        ctx.font = "700 26px 'Montserrat', sans-serif";
        ctx.fillText(value, startTextX + labelW + 12, y + 8);
        ctx.textAlign = "center";
    }

    async function generateAndDownloadCertificate(fullName, unit, branch) {
        if (document.fonts) {
            await document.fonts.ready;
        }

        const ctx = exportCanvas.getContext("2d");
        exportCanvas.width = 1920;
        exportCanvas.height = 1080;

        const bgGrad = ctx.createRadialGradient(960, 480, 150, 960, 540, 1100);
        bgGrad.addColorStop(0, "#FFFFFF");
        bgGrad.addColorStop(0.7, "#F8FAFD");
        bgGrad.addColorStop(1, "#EFF6FF");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1920, 1080);

        ctx.strokeStyle = "#1E40AF";
        ctx.lineWidth = 7;
        ctx.strokeRect(36, 36, 1848, 1008);

        ctx.strokeStyle = "#FDE68A";
        ctx.lineWidth = 2;
        ctx.strokeRect(46, 46, 1828, 988);

        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 3;
        ctx.strokeRect(54, 54, 1812, 972);

        function drawCornerBracket(x, y, dx, dy) {
            ctx.strokeStyle = "#D4AF37";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(x, y + dy * 36);
            ctx.lineTo(x, y);
            ctx.lineTo(x + dx * 36, y);
            ctx.stroke();
        }
        drawCornerBracket(64, 64, 1, 1);
        drawCornerBracket(1920 - 64, 64, -1, 1);
        drawCornerBracket(64, 1080 - 64, 1, -1);
        drawCornerBracket(1920 - 64, 1080 - 64, -1, -1);

        ctx.textAlign = "center";

        ctx.fillStyle = "#1E40AF";
        ctx.font = "800 28px 'Montserrat', sans-serif";
        ctx.fillText("ĐOÀN TNCS HỒ CHÍ MINH TỈNH HÀ TĨNH", 960, 175);

        ctx.fillStyle = "#B91C1C";
        ctx.font = "900 84px 'Playfair Display', serif";
        ctx.fillText("GIẤY CHỨNG NHẬN", 960, 265);

        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(960 - 160, 295);
        ctx.lineTo(960 - 25, 295);
        ctx.moveTo(960 + 25, 295);
        ctx.lineTo(960 + 160, 295);
        ctx.stroke();

        ctx.fillStyle = "#D4AF37";
        ctx.font = "700 22px 'Montserrat', sans-serif";
        ctx.fillText("★", 960, 302);

        const avatarCenterX = 960;
        const avatarCenterY = 460;
        const avatarRadius = 120;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        if (userCroppedImage) {
            ctx.drawImage(
                userCroppedImage,
                avatarCenterX - avatarRadius,
                avatarCenterY - avatarRadius,
                avatarRadius * 2,
                avatarRadius * 2
            );
        } else {
            ctx.fillStyle = "#EFF6FF";
            ctx.fillRect(avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        }
        ctx.restore();

        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#1E40AF";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius + 4, 0, Math.PI * 2);
        ctx.stroke();

        const badgeW = 160;
        const badgeH = 34;
        const badgeY = avatarCenterY + avatarRadius - 12;
        ctx.fillStyle = "#1E40AF";
        ctx.beginPath();
        ctx.roundRect(avatarCenterX - badgeW / 2, badgeY, badgeW, badgeH, 17);
        ctx.fill();
        ctx.strokeStyle = "#FDE68A";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#FEF08A";
        ctx.font = "800 16px 'Montserrat', sans-serif";
        ctx.fillText("ĐẠI BIỂU", avatarCenterX, badgeY + 23);

        ctx.fillStyle = "#0A2558";
        ctx.font = "900 66px 'Montserrat', sans-serif";
        ctx.fillText(fullName.toUpperCase(), 960, 680);

        const nameLineGrad = ctx.createLinearGradient(960 - 200, 705, 960 + 200, 705);
        nameLineGrad.addColorStop(0, "transparent");
        nameLineGrad.addColorStop(0.5, "#D4AF37");
        nameLineGrad.addColorStop(1, "transparent");
        ctx.strokeStyle = nameLineGrad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(960 - 200, 705);
        ctx.lineTo(960 + 200, 705);
        ctx.stroke();

        drawMetaPill(ctx, "Địa phương / Đơn vị: ", unit || "Đoàn trường Đại học Hà Tĩnh", 775);
        drawMetaPill(ctx, "Tổ chức đoàn nơi tham gia sinh hoạt: ", branch || "Chi đoàn Cán bộ Giảng viên", 845);

        exportCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, "_");
            a.download = `Giay-Chung-Nhan-${cleanName}.png`;
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

            statusMsg.className = "status_msg success";
            statusMsg.textContent = "✓ Cấp và tải giấy chứng nhận thành công!";

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