document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("messageForm");
    const avatarInput = document.getElementById("avatarInput");
    const nameInput = document.getElementById("username");
    const roleInput = document.getElementById("role");
    const messageInput = document.getElementById("message");

    const previewName = document.querySelector(".name_content");
    const previewRole = document.querySelector(".title_content");
    const previewMessage = document.querySelector(".message_content");
    const avatarPreview = document.getElementById("img_choosen");
    const messageBox = document.querySelector(".message_box");
    const templateImage = document.querySelector(".template_img");
    const chosenImageWrapper = document.querySelector(".image_choosen");

    const placeholderName = "Họ và tên";
    const placeholderRole = "Chức vụ";
    const messagePlaceholder = "Gửi lời nhắn đến đại hội...";
    const messageSafetyPadding = 5;
    let lastValidMessage = "";

    const syncText = (input, target, fallback) => {
        const value = input.value.trim();
        target.textContent = value || fallback;
    };

    nameInput.addEventListener("input", () =>
        syncText(nameInput, previewName, placeholderName)
    );

    roleInput.addEventListener("input", () =>
        syncText(roleInput, previewRole, placeholderRole)
    );

    messageInput.addEventListener("input", () => {
        const currentValue = messageInput.value;
        previewMessage.textContent = currentValue.trim() || messagePlaceholder;

        const allowedHeight = messageBox.clientHeight - messageSafetyPadding;
        const contentHeight = previewMessage.scrollHeight;

        if (contentHeight > allowedHeight - 20) {
            messageInput.value = lastValidMessage;
            previewMessage.textContent =
                lastValidMessage.trim() || messagePlaceholder;
        } else {
            lastValidMessage = currentValue;
        }
    });

    avatarInput.addEventListener("change", (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target && e.target.result;
            if (typeof src === "string") {
                avatarPreview.src = src;
            }
        };
        reader.readAsDataURL(file);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
    });

    const responsiveOverlayState = {
        baseCanvasWidth: 0,
        image: {
            width: 0,
            height: 0,
            border: 0,
        },
        message: {
            width: 0,
            height: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            fontSize: 0,
            lineHeight: 0,
        },
    };

    const cacheOverlayMetrics = () => {
        if (!templateImage) return;
        responsiveOverlayState.baseCanvasWidth =
            templateImage.clientWidth || templateImage.naturalWidth || 0;

        if (!responsiveOverlayState.baseCanvasWidth) {
            return;
        }

        const imageStyles = getComputedStyle(chosenImageWrapper);
        responsiveOverlayState.image.width = chosenImageWrapper.offsetWidth;
        responsiveOverlayState.image.height = chosenImageWrapper.offsetHeight;
        responsiveOverlayState.image.border = parseFloat(
            imageStyles.borderWidth || "0"
        );

        const messageStyles = getComputedStyle(messageBox);
        responsiveOverlayState.message.width = messageBox.offsetWidth;
        responsiveOverlayState.message.height = messageBox.offsetHeight;
        responsiveOverlayState.message.paddingTop = parseFloat(
            messageStyles.paddingTop || "0"
        );
        responsiveOverlayState.message.paddingRight = parseFloat(
            messageStyles.paddingRight || "0"
        );
        responsiveOverlayState.message.paddingBottom = parseFloat(
            messageStyles.paddingBottom || "0"
        );
        responsiveOverlayState.message.paddingLeft = parseFloat(
            messageStyles.paddingLeft || "0"
        );

        const messageContentStyles = getComputedStyle(previewMessage);
        responsiveOverlayState.message.fontSize = parseFloat(
            messageContentStyles.fontSize || "0"
        );

        const parsedLineHeight = parseFloat(
            messageContentStyles.lineHeight || "0"
        );
        responsiveOverlayState.message.lineHeight = Number.isNaN(parsedLineHeight)
            ? responsiveOverlayState.message.fontSize * 1.5
            : parsedLineHeight;
    };

    const scaleOverlays = () => {
        if (!templateImage || !responsiveOverlayState.baseCanvasWidth) return;
        const currentWidth = templateImage.clientWidth;
        if (!currentWidth) return;

        const scale =
            currentWidth / responsiveOverlayState.baseCanvasWidth;

        chosenImageWrapper.style.width = `${
            responsiveOverlayState.image.width * scale
        }px`;
        chosenImageWrapper.style.height = `${
            responsiveOverlayState.image.height * scale
        }px`;
        chosenImageWrapper.style.borderWidth = `${
            responsiveOverlayState.image.border * scale
        }px`;

        messageBox.style.width = `${
            responsiveOverlayState.message.width * scale
        }px`;
        messageBox.style.height = `${
            responsiveOverlayState.message.height * scale
        }px`;
        messageBox.style.paddingTop = `${
            responsiveOverlayState.message.paddingTop * scale
        }px`;
        messageBox.style.paddingRight = `${
            responsiveOverlayState.message.paddingRight * scale
        }px`;
        messageBox.style.paddingBottom = `${
            responsiveOverlayState.message.paddingBottom * scale
        }px`;
        messageBox.style.paddingLeft = `${
            responsiveOverlayState.message.paddingLeft * scale
        }px`;

        previewMessage.style.fontSize = `${
            responsiveOverlayState.message.fontSize * scale
        }px`;
        previewMessage.style.lineHeight = `${
            responsiveOverlayState.message.lineHeight * scale
        }px`;
    };

    const initResponsiveOverlay = () => {
        cacheOverlayMetrics();
        scaleOverlays();
    };

    if (templateImage) {
        const setupResponsiveBehavior = () => {
            initResponsiveOverlay();

            window.addEventListener("resize", () => {
                window.requestAnimationFrame(scaleOverlays);
            });
        };

        if (templateImage.complete) {
            setupResponsiveBehavior();
        } else {
            templateImage.addEventListener("load", setupResponsiveBehavior, {
                once: true,
            });
        }
    }
});
