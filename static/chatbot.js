document.addEventListener("DOMContentLoaded", function () {
    const chatButton = document.createElement("button");
    chatButton.innerText = "💬 AIChat";
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
        <input type="text" id="chat-input" placeholder="Ask me anything...">
        <button id="send-btn">Send</button>
    `;
    document.body.appendChild(chatContainer);
    
    chatButton.addEventListener("click", () => {
        chatContainer.style.display = "block";
    });

    document.getElementById("close-chat").addEventListener("click", () => {
        chatContainer.style.display = "none";
    });

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

        fetch("/chatbot/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            chatMessages.innerHTML += `<div class="bot-msg">${data.reply}</div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => console.error("Error:", error));
    }
});
