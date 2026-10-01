document.addEventListener("DOMContentLoaded", () => {
    const API_ENDPOINT = "https://api-cua-ban-kia.com/api/register"; 
    const USE_MOCK_TEST = true;

    const form = document.getElementById("messageForm");
    const avatarInput = document.getElementById("avatarInput");
    const nameInput = document.getElementById("username");
    const roleInput = document.getElementById("role");
    const messageInput = document.getElementById("message");
    const downloadBtn = document.getElementById("download");
    const btnText = downloadBtn.querySelector(".btn_text");
    const btnSpinner = document.getElementById("btnSpinner");
    const statusMsg = document.getElementById("statusMsg");

    const avatarPreview = document.getElementById("img_choosen");
    const avatarPreviewWrapper = document.getElementById("avatarPreviewWrapper");
    const previewName = document.querySelector(".name_content");
    const previewRole = document.querySelector(".title_content");
    const previewMessage = document.querySelector(".message_content");
    const messageBox = document.querySelector(".message_box");
    const templateImg = document.getElementById("templateImg");
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
    let lastValidMessage = "";

    nameInput.addEventListener("input", (e) => {
        previewName.textContent = e.target.value.trim().toUpperCase() || "HỌ VÀ TÊN";
    });

    roleInput.addEventListener("input", (e) => {
        previewRole.textContent = e.target.value.trim() || "Chức vụ";
    });

    messageInput.addEventListener("input", () => {
        const currentValue = messageInput.value;
        previewMessage.textContent = currentValue.trim() || "Gửi lời nhắn đến đại hội...";

        const allowedHeight = messageBox.clientHeight;
        const contentHeight = previewMessage.scrollHeight;

        if (allowedHeight > 0 && contentHeight > allowedHeight) {
            messageInput.value = lastValidMessage;
            previewMessage.textContent = lastValidMessage.trim() || "Gửi lời nhắn đến đại hội...";
            statusMsg.className = "status_msg error";
            statusMsg.textContent = "⚠️ Đã đạt giới hạn tối đa số dòng của khung thông điệp!";
        } else {
            lastValidMessage = currentValue;
            if (statusMsg.textContent.includes("giới hạn")) {
                statusMsg.textContent = "";
            }
        }
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
            center: false,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            toggleDragModeOnDblclick: false,
        });
    }

    function openCropper(imageSrc) {
        currentRawImageUrl = imageSrc;
        cropperImage.src = imageSrc;
        cropModal.style.display = "flex";

        if (cropperImage.complete) {
            initCropper();
        } else {
            cropperImage.onload = () => {
                initCropper();
            };
        }
    }

    function closeCropper() {
        cropModal.style.display = "none";
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }

    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            openCropper(event.target.result);
        };
        reader.readAsDataURL(file);
    });

    avatarPreviewWrapper.addEventListener("click", () => {
        if (currentRawImageUrl) {
            openCropper(currentRawImageUrl);
        } else {
            avatarInput.click();
        }
    });

    closeCropModal.addEventListener("click", closeCropper);
    cancelCropBtn.addEventListener("click", closeCropper);

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
            imageSmoothingQuality: "high",
        });

        const croppedDataUrl = croppedCanvas.toDataURL("image/png");

        avatarPreview.src = croppedDataUrl;

        const img = new Image();
        img.onload = () => {
            userCroppedImage = img;
        };
        img.src = croppedDataUrl;

        closeCropper();
    });

    async function sendDataToDatabase(userData) {
        if (USE_MOCK_TEST) {
            console.log("Mock API gửi dữ liệu:", userData);
            await new Promise((resolve) => setTimeout(resolve, 600));
            return { success: true, message: "Lưu thành công (Mock Test)" };
        }

        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `Lỗi máy chủ (${response.status})`);
        }

        return await response.json();
    }

    function renderWrappedText(ctx, text, startX, startY, maxWidth, lineHeight, maxHeight) {
        const paragraphs = text.split(/\r?\n/);
        let currentY = startY;

        for (let p = 0; p < paragraphs.length; p++) {
            const paragraph = paragraphs[p];
            if (paragraph.trim() === "") {
                currentY += lineHeight * 0.7;
                continue;
            }

            const words = paragraph.split(" ");
            let line = "";

            for (let w = 0; w < words.length; w++) {
                let word = words[w];

                if (ctx.measureText(word).width > maxWidth) {
                    if (line.length > 0) {
                        ctx.fillText(line, startX, currentY);
                        currentY += lineHeight;
                        line = "";
                        if (maxHeight && (currentY - startY) > maxHeight) return currentY;
                    }

                    for (let c = 0; c < word.length; c++) {
                        const char = word[c];
                        if (ctx.measureText(line + char).width > maxWidth) {
                            ctx.fillText(line, startX, currentY);
                            currentY += lineHeight;
                            line = char;
                            if (maxHeight && (currentY - startY) > maxHeight) return currentY;
                        } else {
                            line += char;
                        }
                    }
                    line += " ";
                    continue;
                }

                const testLine = line + word + " ";
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && w > 0) {
                    ctx.fillText(line, startX, currentY);
                    line = word + " ";
                    currentY += lineHeight;

                    if (maxHeight && (currentY - startY) > maxHeight) {
                        return currentY;
                    }
                } else {
                    line = testLine;
                }
            }

            if (line.trim().length > 0) {
                if (maxHeight && (currentY - startY) > maxHeight) {
                    return currentY;
                }
                ctx.fillText(line, startX, currentY);
                currentY += lineHeight;
            }
        }
        return currentY;
    }

    async function generateAndDownloadImage(fullName, role, message) {
        if (document.fonts) {
            await document.fonts.ready;
        }

        const ctx = exportCanvas.getContext("2d");
        exportCanvas.width = 1920;
        exportCanvas.height = 1080;

        const avatarCenterX = 370; 
        const avatarCenterY = 513; 
        const avatarRadius = 180;

        if (userCroppedImage) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(
                userCroppedImage,
                avatarCenterX - avatarRadius,
                avatarCenterY - avatarRadius,
                avatarRadius * 2,
                avatarRadius * 2
            );
            ctx.restore();
        }

        ctx.drawImage(templateImg, 0, 0, 1920, 1080);

        ctx.textAlign = "center";
        ctx.fillStyle = "#FFE600";
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 4;

        let nameFontSize = 32;
        ctx.font = `bold ${nameFontSize}px 'Roboto', sans-serif`;
        while (ctx.measureText(fullName.toUpperCase()).width > 350 && nameFontSize > 22) {
            nameFontSize -= 2;
            ctx.font = `bold ${nameFontSize}px 'Roboto', sans-serif`;
        }
        ctx.fillText(fullName.toUpperCase(), avatarCenterX, 740);

        if (role) {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "italic 22px 'Roboto', sans-serif";
            ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
            ctx.shadowBlur = 3;
            ctx.fillText(role, avatarCenterX, 780);
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(710, 380, 1070, 480);
        ctx.clip();

        ctx.textAlign = "left";
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.font = "italic 400 28px 'Roboto', sans-serif";

        const formattedMsg = message.startsWith('"') ? message : `"${message}"`;
        renderWrappedText(ctx, formattedMsg, 730, 415, 1020, 44, 440);
        ctx.restore();

        exportCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, "_");
            a.download = `Dai-bieu-${cleanName}.png`;
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!userCroppedImage) {
            alert("Vui lòng chọn ảnh và căn chỉnh góc mặt trước khi tải về!");
            return;
        }

        const fullName = nameInput.value.trim();
        const role = roleInput.value.trim();
        const message = messageInput.value.trim();

        downloadBtn.disabled = true;
        btnSpinner.style.display = "block";
        btnText.textContent = "Đang lưu & xử lý...";
        statusMsg.textContent = "";

        try {
            const payload = {
                savedAt: new Date().toLocaleString("vi-VN"),
                fullName: fullName,
                role: role,
                message: message,
                avatarStatus: userCroppedImage ? "Đã tải ảnh" : "Chưa tải ảnh"
            };

            await sendDataToDatabase(payload);
            await generateAndDownloadImage(fullName, role, message);

            statusMsg.className = "status_msg success";
            statusMsg.textContent = "✓ Đã lưu thông tin và tải ảnh thành công!";

            if (typeof confetti === "function") {
                confetti({
                    particleCount: 120,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }
        } catch (error) {
            console.error(error);
            statusMsg.className = "status_msg error";
            statusMsg.textContent = `Lỗi mạng khi lưu dữ liệu. Đang tải ảnh cho bạn...`;

            await generateAndDownloadImage(fullName, role, message);
        } finally {
            downloadBtn.disabled = false;
            btnSpinner.style.display = "none";
            btnText.textContent = "Tải lời nhắn về";
        }
    });
});