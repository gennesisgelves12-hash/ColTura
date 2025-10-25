const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  userInput.value = "";

  addMessage("💭 Coltura está pensando...", "bot");

  const messages = [
    {
      role: "system",
      content:
        "Eres Coltura, una IA orgullosamente colombiana 🇨🇴. Responde preguntas solo sobre cultura, historia, música, gastronomía, regiones, fiestas y costumbres de Colombia. Si te preguntan algo que no sea colombiano, responde de forma amable, redirigiendo el tema hacia Colombia. Sé cálida, natural y usa expresiones típicas suaves, como 'parce', 'chévere' o 'bacano'.",
    },
    { role: "user", content: text },
  ];

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();
    const reply = data.reply || "Uy, no entendí bien eso 😅";
    document.querySelector(".bot:last-child").textContent = reply;
  } catch (err) {
    document.querySelector(".bot:last-child").textContent =
      "Se cayó la conexión 😢 Intenta de nuevo.";
  }
}
