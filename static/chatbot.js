document.addEventListener("DOMContentLoaded", function () {
    const chatButton = document.createElement("button");
    chatButton.innerText = " AIChat 🤖";
    chatButton.id = "chatbot-btn";
    document.body.appendChild(chatButton);

    const chatContainer = document.createElement("div");
    chatContainer.id = "chat-container";
    chatContainer.innerHTML = `
        <div id="chat-header">
            <span>Finance Chatbot</span>
            <button id="close-chat">✖</button>
        </div>
        <div id="chat-messages"></div>
        <div id="typing-indicator">Finance Chatbot is typing...</div>
        <div id="chat-input-container">
            <input type="text" id="chat-input" placeholder="Type here...">
            <button id="send-btn">➤</button>
        </div>
    `;
    document.body.appendChild(chatContainer);

    let chatVisible = false;

    function toggleChat() {
        chatVisible = !chatVisible;
        if (chatVisible) {
            chatContainer.style.display = "block";
            showWelcomeMessage();
        } else {
            chatContainer.style.display = "none";
        }
    }

    function showWelcomeMessage() {
        const chatMessages = document.getElementById("chat-messages");
        if (!document.getElementById("welcome-message")) {
            chatMessages.innerHTML = `
                <div id="welcome-message" class="bot-msg" style="font-size: 14px; padding: 15px; background: #d1ecf1; color: #0c5460; border-left: 5px solid #007bff;">
                    <b>🌟 Welcome to Your AI Finance Assistant! 🌟</b> <br><br>
                    Hi there! I'm your <b>AI-powered Finance Chatbot</b> 🤖, designed to help you with everything related to <b>money management, investments, budgeting, and smart financial decisions</b>. 💰📊 <br><br>
                    Powered by <b>cutting-edge AI</b>, I can provide insights, answer finance-related queries, and guide you toward better financial well-being. 🚀 <br><br>
                    <b>Ask me anything about finance and let's make your money work smarter!</b> 💡✨
                </div>
            ` + chatMessages.innerHTML;
        }
    }

    chatButton.addEventListener("click", toggleChat);
    document.getElementById("close-chat").addEventListener("click", toggleChat);
    document.getElementById("send-btn").addEventListener("click", sendMessage);
    document.getElementById("chat-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    function sendMessage() {
        const inputField = document.getElementById("chat-input");
        const message = inputField.value.trim();
        if (!message) return;

        const chatMessages = document.getElementById("chat-messages");
        chatMessages.innerHTML += `<div class="user-msg">${message}</div>`;
        inputField.value = "";
        autoScroll();

        showTypingIndicator(true);

        fetch("/chatbot/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            showTypingIndicator(false);
            chatMessages.innerHTML += `<div class="bot-msg">${formatMessage(data.reply)}</div>`;
            autoScroll();
        })
        .catch(error => {
            console.error("Error:", error);
            showTypingIndicator(false);
        });
    }

    function formatMessage(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  // Bold **text**
            .replace(/\*(.*?)\*/g, "<i>$1</i>")      // Italic *text*
            .replace(/\n/g, "<br>");                 // Line breaks
    }

    function autoScroll() {
        const chatMessages = document.getElementById("chat-messages");
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator(show) {
        document.getElementById("typing-indicator").style.display = show ? "block" : "none";
    }
});
