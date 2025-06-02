import identity from "../core/identity.js";
import contextManager from "../connectivity/contextManager.js";
import interactionHandler from "./interactionHandler.js";
import fileManager from "../utils/fileManager.js";
import { scrollHandler } from './scrollHandler.js';
import { transparencyHandler } from '../connectivity/transparencyHandler.js';
import { conversationHistory } from '../memory/conversationHistory.js';
import unicodeIcons from '../utils/unicodeIcons.js';

// متغير لتتبع الثيم النشط في التطبيق
let activeAppTheme = localStorage.getItem("activeAppTheme") || "dark"; // تحميل الثيم المحفوظ أو الافتراضي "dark"

const uiConfig = {
    theming: {
        themes: {
            dark: {
                name: "داكن",
                backgroundColor: "black",
                textColor: "white",
                userBubbleBg: "#333333",
                userBubbleText: "white",
                userBubbleBorder: "gold",
                modelBubbleBg: "#222222",
                modelBubbleText: "white",
                modelBubbleBorder: "gold",
                inputBoxBg: "black",
                inputBoxText: "#D3D3D3",
                inputBoxBorder: "gold",
                buttonColor: "white",
                topBarBgMale: "rgba(0, 0, 128, 0.5)",
                topBarBgFemale: "rgba(139, 0, 0, 0.5)",
                navItemActive: "gold",
                navItemInactive: "white",
            },
            light: {
                name: "فاتح",
                backgroundColor: "#F8F8F8",
                textColor: "black",
                userBubbleBg: "#E0E0E0",
                userBubbleText: "black",
                userBubbleBorder: "black",
                modelBubbleBg: "#F0F0F0",
                modelBubbleText: "black",
                modelBubbleBorder: "black",
                inputBoxBg: "#F8F8F8",
                inputBoxText: "black",
                inputBoxBorder: "black",
                buttonColor: "black",
                topBarBgMale: "rgba(100, 100, 255, 0.5)",
                topBarBgFemale: "rgba(255, 100, 100, 0.5)",
                navItemActive: "gold",
                navItemInactive: "black",
            },
            shipoTheme: {
                name: "ثيم شيبو",
                backgroundColor: "#0F1C33",
                textColor: "#E0E0E0",
                userBubbleBg: "#1F3A5C",
                userBubbleText: "#E0E0E0",
                userBubbleBorder: "#4CAF50",
                modelBubbleBg: "#0A1426",
                modelBubbleText: "#E0E0E0",
                modelBubbleBorder: "#4CAF50",
                inputBoxBg: "#050A1A",
                inputBoxText: "#E0E0E0",
                inputBoxBorder: "#4CAF50",
                buttonColor: "#4CAF50",
                topBarBgMale: "rgba(0, 50, 150, 0.5)",
                topBarBgFemale: "rgba(139, 0, 0, 0.5)",
                navItemActive: "#4CAF50",
                navItemInactive: "#E0E0E0",
            },
            noriTheme: {
                name: "ثيم نوري",
                backgroundColor: "#330F1C",
                textColor: "#E0E0E0",
                userBubbleBg: "#5C1F3A",
                userBubbleText: "#E0E0E0",
                userBubbleBorder: "#FF5722",
                modelBubbleBg: "#260A14",
                modelBubbleText: "#E0E0E0",
                modelBubbleBorder: "#FF5722",
                inputBoxBg: "#1A050A",
                inputBoxText: "#E0E0E0",
                inputBoxBorder: "#FF5722",
                buttonColor: "#FF5722",
                topBarBgMale: "rgba(0, 0, 128, 0.5)",
                topBarBgFemale: "rgba(150, 50, 0, 0.5)",
                navItemActive: "#FF5722",
                navItemInactive: "#E0E0E0",
            },
        },
        setTheme: (themeName) => {
            if (uiConfig.theming.themes[themeName]) {
                activeAppTheme = themeName;
                localStorage.setItem("activeAppTheme", themeName);
                document.body.className = '';
                document.body.classList.add(`theme-${themeName}`);
                const toast = document.createElement("div");
                toast.className = "toast";
                toast.innerText = `تم تطبيق ثيم ${uiConfig.theming.themes[themeName].name}!`;
                toast.style.cssText = `position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: ${themeName === 'dark' || themeName === 'shipoTheme' ? '#333' : '#F8F8F8'}; color: ${themeName === 'dark' || themeName === 'shipoTheme' ? '#FFF' : '#000'}; padding: 10px; border-radius: 5px; z-index: 1000;`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
                console.log(`تم تغيير الثيم إلى: ${themeName}`);
                uiConfig.applyCurrentTheme(); // تحديث الواجهة بعد تغيير الثيم
            } else {
                console.warn(`الثيم '${themeName}' غير موجود.`);
            }
        },
        getCurrentTheme: () => uiConfig.theming.themes[activeAppTheme],
    },

    topBar: {
        logo: {
            text: "ShipoAssistant",
            style: () => ({
                color: "gold",
                fontSize: "24px",
            }),
        },
        toggleModelButton: {
            icon: () => unicodeIcons[identity.activeGenderModel === "male" ? "shipo" : "nori"],
            action: () => {
                identity.toggleActiveGenderModel();
                console.log(`تم تبديل النموذج النشط إلى: ${identity.activeGenderModel}`);
                uiConfig.updateUIBasedOnGender();
                uiConfig.applyCurrentTheme();
            },
            getStyle: () => ({
                color: uiConfig.theming.getCurrentTheme().buttonColor,
                backgroundColor: "transparent",
                transition: "color 0.3s ease",
            }),
        },
        newConversationButton: {
            icon: unicodeIcons.newConversation,
            action: () => {
                conversationHistory.saveCurrentConversation();
                document.getElementById(uiConfig.conversationArea.containerId).innerHTML = '';
                console.log("تم إنشاء محادثة جديدة");
                uiConfig.displayWelcomeMessage();
            },
            getStyle: () => ({
                color: uiConfig.theming.getCurrentTheme().buttonColor,
                backgroundColor: "transparent",
                transition: "color 0.3s ease",
            }),
        },
        menuButton: {
            icon: unicodeIcons.menu,
            action: () => {
                const settingsPanel = document.getElementById("settings-panel");
                if (settingsPanel) {
                    settingsPanel.classList.toggle("open");
                    transparencyHandler.setTransparency(settingsPanel, 0.5);
                }
            },
            getStyle: () => ({
                color: uiConfig.theming.getCurrentTheme().buttonColor,
                transition: "color 0.3s ease",
            }),
        },
    },

    conversationArea: {
        containerId: "chat-messages",
        userBubble: {
            style: () => ({
                backgroundColor: uiConfig.theming.getCurrentTheme().userBubbleBg,
                color: uiConfig.theming.getCurrentTheme().userBubbleText,
                border: `2px solid ${uiConfig.theming.getCurrentTheme().userBubbleBorder}`,
                borderRadius: "15px 15px 0 15px",
                padding: "10px",
                margin: "5px 0",
                maxWidth: "70%",
            }),
            editButton: {
                icon: unicodeIcons.edit,
                action: async (messageElement, currentText) => {
                    const newText = prompt("عدّل رسالتك:", currentText);
                    if (newText !== null && newText.trim() !== currentText.trim()) {
                        const messageTextElement = messageElement.querySelector(".message-text");
                        if (messageTextElement) messageTextElement.innerText = newText;
                        console.log(`تم تعديل الرسالة إلى: ${newText}. سيتم إعادة توليد الرد.`);
                        const response = await interactionHandler.reprocessMessage(messageElement.dataset.messageId, newText, await contextManager.buildContext());
                        if (response) uiConfig.displayResponse(response);
                    }
                },
            },
            copyButton: {
                icon: unicodeIcons.copy,
                action: (text) => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(text).then(() => console.log("تم نسخ النص إلى الحافظة"));
                    } else {
                        console.warn("Clipboard API غير مدعوم. يرجى استخدام طريقة أخرى.");
                    }
                },
            },
        },
        modelBubble: {
            style: () => ({
                backgroundColor: uiConfig.theming.getCurrentTheme().modelBubbleBg,
                color: uiConfig.theming.getCurrentTheme().modelBubbleText,
                border: `2px solid ${uiConfig.theming.getCurrentTheme().modelBubbleBorder}`,
                borderRadius: "15px 15px 15px 0",
                padding: "10px",
                margin: "5px 0",
                maxWidth: "70%",
            }),
            getModelNameStyle: (emotion) => {
                const activeModelData = identity.getActiveModelData();
                const emotionColors = activeModelData.emotionalPalette;
                const color = emotionColors[emotion] || emotionColors.neutral || uiConfig.theming.getCurrentTheme().textColor;
                return { color, fontWeight: "bold" };
            },
            ratingButtons: {
                up: unicodeIcons.like,
                down: unicodeIcons.dislike,
                action: (rating, messageId) => console.log(`تم تقييم الرد (ID: ${messageId}): ${rating}`),
            },
            copyButton: {
                icon: unicodeIcons.copy,
                action: (text) => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(text).then(() => console.log("تم نسخ رد النموذج إلى الحافظة"));
                    } else {
                        console.warn("Clipboard API غير مدعوم. يرجى استخدام طريقة أخرى.");
                    }
                },
            },
        },
        thinkingPopup: {
            show: false,
            stages: ["تحليل لغوي", "تحليل سياقي", "بحث خارجي", "بحث داخلي", "تركيب منطقي"],
            style: () => ({
                backgroundColor: uiConfig.theming.getCurrentTheme().modelBubbleBg,
                color: uiConfig.theming.getCurrentTheme().modelBubbleText,
                border: `1px solid ${uiConfig.theming.getCurrentTheme().modelBubbleBorder}`,
                borderRadius: "10px",
                padding: "10px",
                margin: "5px 0",
                maxWidth: "50%",
                position: "absolute",
                zIndex: 100,
            }),
        },
    },

    inputBox: {
        containerId: "input-box",
        textAreaId: "user-input",
        style: () => ({
            backgroundColor: uiConfig.theming.getCurrentTheme().inputBoxBg,
            color: uiConfig.theming.getCurrentTheme().inputBoxText,
            border: `2px solid ${uiConfig.theming.getCurrentTheme().inputBoxBorder}`,
            borderRadius: "10px",
        }),
        buttons: {
            send: { id: "send-button", icon: unicodeIcons.send },
            mic: { id: "mic-button", icon: unicodeIcons.microphone, action: () => console.log("زر الميكروفون - لم ينفذ بعد") },
            thinkMode: { id: "think-mode-button", icon: unicodeIcons.thinkMode, action: () => console.log("زر Think Mode - لم ينفذ بعد") },
            deepSearch: { id: "deep-search-button", icon: unicodeIcons.deepSearch, action: () => console.log("زر DeepSearch - لم ينفذ بعد") },
            attach: {
                id: "attach-button",
                icon: unicodeIcons.attach,
                action: async () => {
                    console.log("زر الإرفاق - جاري فتح نافذة اختيار الملفات...");
                    try {
                        const fileHandle = await fileManager.openFilePicker();
                        if (fileHandle) {
                            const fileContent = await fileManager.readFile(fileHandle);
                            console.log("تم قراءة الملف بنجاح:", fileHandle.name);
                            uiConfig.displayResponse({ text: `تم إرفاق الملف: ${fileHandle.name} بنجاح. جاري معالجته...`, isUser: true });
                        } else console.log("لم يتم اختيار أي ملف.");
                    } catch (error) {
                        console.error("حدث خطأ أثناء إرفاق الملف:", error);
                        alert("حدث خطأ أثناء إرفاق الملف. يرجى المحاولة مرة أخرى.");
                    }
                },
            },
            search: { id: "search-button", icon: unicodeIcons.globalSearch, action: () => console.log("زر البحث - لم ينفذ بعد") },
            getStyle: () => ({
                color: uiConfig.theming.getCurrentTheme().buttonColor,
                backgroundColor: "transparent",
                border: `2px solid ${uiConfig.theming.getCurrentTheme().buttonColor}`,
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "20px",
            }),
        },
    },

    bottomNav: {
        containerId: "bottom-nav",
        items: [
            { id: "nav-chat", icon: unicodeIcons.chat, label: "محادثة", active: true },
            { id: "nav-read", icon: unicodeIcons.read, label: "قراءة", active: false },
            { id: "nav-edit", icon: unicodeIcons.write, label: "تحرير", active: false },
            { id: "nav-calendar", icon: unicodeIcons.calendar, label: "تقويم", active: false },
            { id: "nav-mail", icon: unicodeIcons.email, label: "بريد", active: false },
            { id: "nav-weather", icon: unicodeIcons.weather, label: "طقس", active: false },
            { id: "nav-maps", icon: unicodeIcons.map, label: "خرائط", active: false },
            { id: "nav-references", icon: unicodeIcons.references, label: "مراجع", active: false },
            { id: "nav-translate", icon: unicodeIcons.translate, label: "ترجمة", active: false },
        ],
        getStyle: (active) => ({
            color: active ? uiConfig.theming.getCurrentTheme().navItemActive : uiConfig.theming.getCurrentTheme().navItemInactive,
        }),
    },

    getUserName: () => {
        const usernameInput = document.getElementById("username-input");
        if (usernameInput && usernameInput.value.trim()) return usernameInput.value.trim();
        const userEmail = localStorage.getItem("userEmail");
        return userEmail && userEmail.trim() ? userEmail.split("@")[0] : "الزائر الكريم";
    },

    displayWelcomeMessage: () => {
        const userName = uiConfig.getUserName();
        const message = identity.getWelcomeMessage(userName);
        const welcomeMessageElement = document.getElementById("welcome-message");
        if (welcomeMessageElement) welcomeMessageElement.innerText = message;
        else {
            const chatContainer = document.getElementById(uiConfig.conversationArea.containerId);
            if (chatContainer) {
                const welcomeElement = document.createElement("div");
                welcomeElement.id = "welcome-message";
                welcomeElement.classList.add("message-bubble", "model-message");
                welcomeElement.style.alignSelf = "flex-start";
                Object.assign(welcomeElement.style, uiConfig.conversationArea.modelBubble.style());
                welcomeElement.innerText = message;
                chatContainer.appendChild(welcomeElement);
                scrollHandler.scrollToBottom(chatContainer);
            }
        }
    },

    applyCurrentTheme: () => {
        const currentTheme = uiConfig.theming.getCurrentTheme();
        const bodyElement = document.body;
        if (bodyElement) {
            bodyElement.style.transition = "background-color 0.3s ease, color 0.3s ease";
            bodyElement.style.backgroundColor = currentTheme.backgroundColor;
            bodyElement.style.color = currentTheme.textColor;
        }

        const logoElement = document.getElementById("shipo-logo");
        if (logoElement) logoElement.style.color = uiConfig.topBar.logo.style().color;

        const toggleModelBtn = document.getElementById("toggle-model-button");
        if (toggleModelBtn) Object.assign(toggleModelBtn.style, uiConfig.topBar.toggleModelButton.getStyle());

        const newConversationBtn = document.getElementById("new-conversation-button");
        if (newConversationBtn) Object.assign(newConversationBtn.style, uiConfig.topBar.newConversationButton.getStyle());

        const menuBtn = document.getElementById("menu-button");
        if (menuBtn) Object.assign(menuBtn.style, uiConfig.topBar.menuButton.getStyle());

        const inputBoxElement = document.getElementById(uiConfig.inputBox.containerId);
        if (inputBoxElement) {
            Object.assign(inputBoxElement.style, uiConfig.inputBox.style());
            Object.values(uiConfig.inputBox.buttons).forEach(btnConfig => {
                if (btnConfig && btnConfig.id) {
                    const btnElement = document.getElementById(btnConfig.id);
                    if (btnElement) {
                        Object.assign(btnElement.style, uiConfig.inputBox.buttons.getStyle());
                    }
                }
            });
        }

        const navItems = document.querySelectorAll(`#${uiConfig.bottomNav.containerId} .nav-item`);
        navItems.forEach(item => {
            const isActive = item.classList.contains("active");
            Object.assign(item.style, uiConfig.bottomNav.getStyle(isActive));
        });

        const messages = document.querySelectorAll(".message-bubble");
        messages.forEach(msg => {
            const isUserMessage = msg.classList.contains("user-message");
            const bubbleStyle = isUserMessage ? uiConfig.conversationArea.userBubble.style() : uiConfig.conversationArea.modelBubble.style();
            Object.assign(msg.style, bubbleStyle);
            if (!isUserMessage) {
                const modelNameElement = msg.querySelector(".model-name");
                if (modelNameElement) {
                    const currentEmotion = msg.dataset.emotion || identity.currentEmotion || "neutral";
                    const nameStyle = uiConfig.conversationArea.modelBubble.getModelNameStyle(currentEmotion);
                    Object.assign(modelNameElement.style, nameStyle);
                }
            }
        });

        const headerElement = document.querySelector(".top-bar");
        if (headerElement) {
            transparencyHandler.setTransparency(headerElement, 0.5);
            headerElement.style.backgroundColor = identity.activeGenderModel === "male" ? currentTheme.topBarBgMale : currentTheme.topBarBgFemale;
        }

        const bottomNavElement = document.querySelector(`#${uiConfig.bottomNav.containerId}`);
        if (bottomNavElement) {
            transparencyHandler.setTransparency(bottomNavElement, 0.5);
            bottomNavElement.style.backgroundColor = identity.activeGenderModel === "male" ? currentTheme.topBarBgMale : currentTheme.topBarBgFemale;
        }

        const settingsPanel = document.getElementById("settings-panel");
        if (settingsPanel) {
            settingsPanel.style.backgroundColor = currentTheme.backgroundColor;
            settingsPanel.style.color = currentTheme.textColor;
            const settingsButtons = settingsPanel.querySelectorAll(".settings-button");
            settingsButtons.forEach(btn => {
                btn.style.color = currentTheme.buttonColor;
                btn.style.border = `2px solid ${currentTheme.buttonColor}`;
            });
        }

        console.log(`تم تطبيق الثيم: ${activeAppTheme}`);
    },

    updateModelEmotionDisplay: (emotion) => {
        const modelNameElements = document.querySelectorAll(".model-name");
        modelNameElements.forEach(modelNameElement => {
            const nameStyle = uiConfig.conversationArea.modelBubble.getModelNameStyle(emotion);
            Object.assign(modelNameElement.style, nameStyle);
        });
        console.log(`تم تحديث عرض العاطفة في الواجهة إلى: ${emotion}`);
    },

    updateUIBasedOnGender: async () => {
        uiConfig.displayWelcomeMessage();

        const currentTheme = uiConfig.theming.getCurrentTheme();
        const headerElement = document.querySelector(".top-bar");
        if (headerElement) {
            transparencyHandler.setTransparency(headerElement, 0.5);
            headerElement.style.backgroundColor = identity.activeGenderModel === "male" ? currentTheme.topBarBgMale : currentTheme.topBarBgFemale;
        } else console.warn("العنصر .top-bar غير موجود في DOM.");

        const bottomNavElement = document.querySelector(`#${uiConfig.bottomNav.containerId}`);
        if (bottomNavElement) {
            transparencyHandler.setTransparency(bottomNavElement, 0.5);
            bottomNavElement.style.backgroundColor = identity.activeGenderModel === "male" ? currentTheme.topBarBgMale : currentTheme.topBarBgFemale;
        }

        const toggleModelBtn = document.getElementById("toggle-model-button");
        if (toggleModelBtn) toggleModelBtn.innerText = unicodeIcons[identity.activeGenderModel === "male" ? "shipo" : "nori"];

        const modelNameElements = document.querySelectorAll(".model-name");
        modelNameElements.forEach(modelNameElement => {
            modelNameElement.innerText = `${identity.getActiveModelData().name}:`;
            const parentMessage = modelNameElement.closest(".model-message");
            const currentEmotion = (parentMessage && parentMessage.dataset.emotion) ? parentMessage.dataset.emotion : (identity.currentEmotion || "neutral");
            const nameStyle = uiConfig.conversationArea.modelBubble.getModelNameStyle(currentEmotion);
            Object.assign(modelNameElement.style, nameStyle);
        });

        console.log(`تم تحديث الواجهة للنموذج: ${identity.activeGenderModel}`);
    },

    displayResponse: (responseObj) => {
        const chatContainer = document.getElementById(uiConfig.conversationArea.containerId);
        if (!chatContainer) {
            console.warn(`عنصر حاوية الدردشة (#${uiConfig.conversationArea.containerId}) غير موجود.`);
            return;
        }

        const messageElement = document.createElement("div");
        messageElement.classList.add("message-bubble");
        messageElement.dataset.messageId = responseObj.messageId || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        if (responseObj.emotion) messageElement.dataset.emotion = responseObj.emotion;

        messageElement.style.opacity = "0";
        messageElement.style.transition = "opacity 0.3s ease";
        setTimeout(() => {
            messageElement.style.opacity = "1";
        }, 100);

        const messageTextElement = document.createElement("span");
        messageTextElement.classList.add("message-text");

        let formattedText = responseObj.text || "";
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<span data-style="italic">$1</span>');
        formattedText = formattedText.replace(/#(.*?)#(?=\s|$)/g, '<span data-style="bold">$1</span>');
        formattedText = formattedText.replace(/#\*([^*]*?)\*#/g, '<span data-style="bold-italic">$1</span>');
        messageTextElement.innerHTML = formattedText;

        const actionsContainer = document.createElement("div");
        actionsContainer.classList.add("message-actions");
        actionsContainer.style.display = "flex";
        actionsContainer.style.gap = "5px";
        actionsContainer.style.marginTop = "5px";

        const timestampElement = document.createElement("span");
        timestampElement.classList.add("message-timestamp");
        const now = new Date();
        timestampElement.innerText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        timestampElement.style.fontSize = "0.8em";
        timestampElement.style.opacity = "0.6";
        timestampElement.style.marginLeft = "10px";

        if (responseObj.isUser) {
            messageElement.classList.add("user-message");
            Object.assign(messageElement.style, uiConfig.conversationArea.userBubble.style());
            messageElement.style.alignSelf = "flex-end";

            const editBtn = document.createElement("button");
            editBtn.innerHTML = uiConfig.conversationArea.userBubble.editButton.icon;
            editBtn.onclick = () => uiConfig.conversationArea.userBubble.editButton.action(messageElement, responseObj.text);
            editBtn.classList.add("message-action-button");
            editBtn.style.cursor = "pointer";
            actionsContainer.appendChild(editBtn);

            const copyBtn = document.createElement("button");
            copyBtn.innerHTML = uiConfig.conversationArea.userBubble.copyButton.icon;
            copyBtn.onclick = () => uiConfig.conversationArea.userBubble.copyButton.action(responseObj.text);
            copyBtn.classList.add("message-action-button");
            copyBtn.style.cursor = "pointer";
            actionsContainer.appendChild(copyBtn);

            messageElement.appendChild(messageTextElement);
            messageElement.appendChild(timestampElement);
            messageElement.appendChild(actionsContainer);
        } else {
            messageElement.classList.add("model-message");
            Object.assign(messageElement.style, uiConfig.conversationArea.modelBubble.style());
            messageElement.style.alignSelf = "flex-start";

            const modelNameSpan = document.createElement("span");
            modelNameSpan.classList.add("model-name");
            modelNameSpan.innerText = `${responseObj.modelName || identity.getActiveModelData().name}: `;
            const emotionToDisplay = responseObj.emotion || identity.currentEmotion || "neutral";
            const nameStyle = uiConfig.conversationArea.modelBubble.getModelNameStyle(emotionToDisplay);
            Object.assign(modelNameSpan.style, nameStyle);

            const likeBtn = document.createElement("button");
            likeBtn.innerHTML = uiConfig.conversationArea.modelBubble.ratingButtons.up;
            likeBtn.onclick = () => uiConfig.conversationArea.modelBubble.ratingButtons.action("up", responseObj.messageId);
            likeBtn.classList.add("message-action-button");
            likeBtn.style.cursor = "pointer";
            actionsContainer.appendChild(likeBtn);

            const dislikeBtn = document.createElement("button");
            dislikeBtn.innerHTML = uiConfig.conversationArea.modelBubble.ratingButtons.down;
            dislikeBtn.onclick = () => uiConfig.conversationArea.modelBubble.ratingButtons.action("down", responseObj.messageId);
            dislikeBtn.classList.add("message-action-button");
            dislikeBtn.style.cursor = "pointer";
            actionsContainer.appendChild(dislikeBtn);

            const copyBtn = document.createElement("button");
            copyBtn.innerHTML = uiConfig.conversationArea.modelBubble.copyButton.icon;
            copyBtn.onclick = () => uiConfig.conversationArea.modelBubble.copyButton.action(responseObj.text);
            copyBtn.classList.add("message-action-button");
            copyBtn.style.cursor = "pointer";
            actionsContainer.appendChild(copyBtn);

            messageElement.appendChild(modelNameSpan);
            messageElement.appendChild(messageTextElement);
            messageElement.appendChild(timestampElement);
            messageElement.appendChild(actionsContainer);
        }

        if (responseObj.attachment) {
            const attachmentElement = document.createElement("div");
            attachmentElement.classList.add("message-attachment");
            attachmentElement.style.marginTop = "10px";
            attachmentElement.style.maxWidth = "100%";

            if (responseObj.attachment.type.startsWith("image/")) {
                const imgElement = document.createElement("img");
                imgElement.src = responseObj.attachment.url;
                imgElement.alt = "مرفق صورة";
                imgElement.style.maxWidth = "200px";
                imgElement.style.borderRadius = "10px";
                attachmentElement.appendChild(imgElement);
            } else {
                const fileLink = document.createElement("a");
                fileLink.href = responseObj.attachment.url;
                fileLink.innerText = `ملف: ${responseObj.attachment.name}`;
                fileLink.style.color = uiConfig.theming.getCurrentTheme().textColor;
                fileLink.style.textDecoration = "underline";
                attachmentElement.appendChild(fileLink);
            }

            messageElement.appendChild(attachmentElement);
        }

        chatContainer.appendChild(messageElement);
        scrollHandler.scrollToBottom(chatContainer);
    },

    displayThemeSettings: () => {
        const settingsContainer = document.querySelector("#settings-appearance");
        if (settingsContainer) {
            fileManager.getCurrentStoragePath().then(currentPath => {
                settingsContainer.innerHTML = `
                    <h4>اختر الثيم:</h4>
                    ${Object.keys(uiConfig.theming.themes).map(theme => `
                        <div class="theme-option" onmouseover="this.querySelector('.preview').style.display='block'" onmouseout="this.querySelector('.preview').style.display='none'">
                            <input type="radio" name="theme" value="${theme}" ${activeAppTheme === theme ? "checked" : ""} onchange="uiConfig.theming.setTheme('${theme}')">
                            <label>${uiConfig.theming.themes[theme].name}</label>
                            <span class="preview" style="display:none; width:20px; height:20px; background:${theme === 'shipoTheme' ? 'linear-gradient(135deg, #1F3A5C, #0A1426)' : theme === 'noriTheme' ? 'linear-gradient(135deg, #5C1F3A, #260A14)' : theme === 'dark' ? '#333333' : '#E0E0E0'}; margin-left:10px;"></span>
                        </div>
                    `).join('')}
                    <h4>إعدادات التخزين:</h4>
                    <p>المسار الحالي: ${currentPath}</p>
                    <button id="change-storage-path" style="color: ${uiConfig.theming.getCurrentTheme().buttonColor}; background-color: transparent; border: 2px solid ${uiConfig.theming.getCurrentTheme().buttonColor}; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                        ${unicodeIcons.openFolder} تغيير مسار التخزين
                    </button>
                `;
                window.uiConfig = uiConfig;

                const changeStorageBtn = document.getElementById("change-storage-path");
                if (changeStorageBtn) {
                    changeStorageBtn.addEventListener("click", async () => {
                        try {
                            const newPath = await fileManager.setStoragePath(); // يستخدم Directory.Data الآن
                            if (newPath) {
                                const toast = document.createElement("div");
                                toast.className = "toast";
                                toast.innerText = `تم تغيير مسار التخزين إلى: ${newPath}`;
                                toast.style.cssText = `position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: ${activeAppTheme === 'dark' || activeAppTheme === 'shipoTheme' ? '#333' : '#F8F8F8'}; color: ${activeAppTheme === 'dark' || activeAppTheme === 'shipoTheme' ? '#FFF' : '#000'}; padding: 10px; border-radius: 5px; z-index: 1000;`;
                                document.body.appendChild(toast);
                                setTimeout(() => toast.remove(), 3000);
                                console.log(`تم تغيير مسار التخزين إلى: ${newPath}`);
                                uiConfig.displayThemeSettings(); // تحديث الواجهة لعرض المسار الجديد
                            }
                        } catch (error) {
                            console.error("خطأ أثناء تغيير مسار التخزين:", error);
                            alert("حدث خطأ أثناء تغيير مسار التخزين. يرجى المحاولة مرة أخرى.");
                        }
                    });
                }
            }).catch(error => {
                console.error("خطأ أثناء جلب مسار التخزين الحالي:", error);
                settingsContainer.innerHTML = `
                    <h4>اختر الثيم:</h4>
                    ${Object.keys(uiConfig.theming.themes).map(theme => `
                        <div class="theme-option" onmouseover="this.querySelector('.preview').style.display='block'" onmouseout="this.querySelector('.preview').style.display='none'">
                            <input type="radio" name="theme" value="${theme}" ${activeAppTheme === theme ? "checked" : ""} onchange="uiConfig.theming.setTheme('${theme}')">
                            <label>${uiConfig.theming.themes[theme].name}</label>
                            <span class="preview" style="display:none; width:20px; height:20px; background:${theme === 'shipoTheme' ? 'linear-gradient(135deg, #1F3A5C, #0A1426)' : theme === 'noriTheme' ? 'linear-gradient(135deg, #5C1F3A, #260A14)' : theme === 'dark' ? '#333333' : '#E0E0E0'}; margin-left:10px;"></span>
                        </div>
                    `).join('')}
                    <h4>إعدادات التخزين:</h4>
                    <p>خطأ في جلب المسار الحالي. حاول مرة أخرى.</p>
                `;
            });
        }
    },

    initialize: async () => {
        const savedGender = localStorage.getItem("activeGenderModel");
        if (savedGender && (savedGender === "male" || savedGender === "female")) identity.activeGenderModel = savedGender;
        else identity.activeGenderModel = "female";

        identity.registerEmotionChangeCallback(uiConfig.updateModelEmotionDisplay);

        const savedAppTheme = localStorage.getItem("activeAppTheme");
        uiConfig.theming.setTheme(savedAppTheme || "dark");

        await uiConfig.updateUIBasedOnGender();

        const toggleModelBtnElement = document.getElementById("toggle-model-button");
        if (toggleModelBtnElement) {
            toggleModelBtnElement.textContent = uiConfig.topBar.toggleModelButton.icon();
            toggleModelBtnElement.addEventListener("click", uiConfig.topBar.toggleModelButton.action);
            toggleModelBtnElement.style.color = uiConfig.theming.getCurrentTheme().buttonColor;
        } else console.warn("زر تبديل النموذج (#toggle-model-button) غير موجود في DOM.");

        const newConversationBtnElement = document.getElementById("new-conversation-button");
        if (newConversationBtnElement) {
            newConversationBtnElement.textContent = uiConfig.topBar.newConversationButton.icon;
            newConversationBtnElement.addEventListener("click", uiConfig.topBar.newConversationButton.action);
            newConversationBtnElement.style.color = uiConfig.theming.getCurrentTheme().buttonColor;
        } else console.warn("زر إنشاء المحادثة (#new-conversation-button) غير موجود في DOM.");

        const menuButtonElement = document.getElementById("menu-button");
        if (menuButtonElement) {
            menuButtonElement.textContent = uiConfig.topBar.menuButton.icon;
            menuButtonElement.addEventListener("click", uiConfig.topBar.menuButton.action);
            menuButtonElement.style.color = uiConfig.theming.getCurrentTheme().buttonColor;
        } else console.warn("زر القائمة (#menu-button) غير موجود في DOM.");

        const userInputField = document.getElementById(uiConfig.inputBox.textAreaId);
        const sendButton = document.getElementById(uiConfig.inputBox.buttons.send.id);

        if (userInputField) {
            userInputField.style.resize = "vertical";
            userInputField.style.minHeight = "40px";
            userInputField.style.maxHeight = "200px";
            userInputField.style.overflowY = "auto";

            userInputField.addEventListener("keypress", async (event) => {
                if (event.key === "Enter" && !event.shiftKey && userInputField.value.trim()) {
                    event.preventDefault();
                    const inputText = userInputField.value.trim();
                    userInputField.value = "";
                    uiConfig.displayResponse({ text: inputText, isUser: true });
                    const response = await interactionHandler.processUserInput(inputText, uiConfig.getUserName());
                    if (response) {
                        identity.setEmotion(response.emotion || "neutral");
                        uiConfig.displayResponse(response);
                    }
                }
            });
        } else console.warn(`حقل إدخال المستخدم (#${uiConfig.inputBox.textAreaId}) غير موجود في DOM.`);

        if (sendButton) {
            sendButton.textContent = uiConfig.inputBox.buttons.send.icon;
            sendButton.addEventListener("click", async () => {
                const inputText = userInputField.value.trim();
                if (inputText) {
                    userInputField.value = "";
                    uiConfig.displayResponse({ text: inputText, isUser: true });
                    const response = await interactionHandler.processUserInput(inputText, uiConfig.getUserName());
                    if (response) {
                        identity.setEmotion(response.emotion || "neutral");
                        uiConfig.displayResponse(response);
                    }
                }
            });
            sendButton.style.color = uiConfig.theming.getCurrentTheme().buttonColor;
        } else console.warn(`زر الإرسال (#${uiConfig.inputBox.buttons.send.id}) غير موجود في DOM.`);

        Object.values(uiConfig.inputBox.buttons).forEach(btnConfig => {
            if (btnConfig.id !== uiConfig.inputBox.buttons.send.id) {
                const btnElement = document.getElementById(btnConfig.id);
                if (btnElement && typeof btnConfig.action === 'function') {
                    btnElement.textContent = btnConfig.icon;
                    btnElement.addEventListener("click", btnConfig.action);
                    btnElement.style.color = uiConfig.theming.getCurrentTheme().buttonColor;
                } else if (!btnElement) {
                    console.warn(`زر ${btnConfig.id} غير موجود في DOM.`);
                }
            }
        });
    },
};

export default uiConfig;