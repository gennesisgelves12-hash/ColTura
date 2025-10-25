// /api/chat.js
export default async function handler(req, res) {
  try {
    const { messages } = await req.json();

    const lastUserMessage = messages[messages.length - 1].content;

    const prompt = `Eres Coltura, una IA orgullosamente colombiana 🇨🇴. 
Responde SOLO sobre cultura, historia, música, gastronomía, regiones, fiestas y costumbres de Colombia. 
Si te preguntan algo que no sea colombiano, responde amablemente redirigiendo el tema hacia Colombia. 
Usa expresiones suaves como “parce”, “chévere” o “bacano”.

Usuario: ${lastUserMessage}
Coltura:`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error en Hugging Face: ${response.statusText}`);
    }

    const data = await response.json();
    const reply =
      data[0]?.generated_text?.split("Coltura:")[1]?.trim() ||
      "Uy, no entendí bien eso 😅";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ reply: "Se cayó la conexión 😢 Intenta de nuevo más tarde." });
  }
}
