export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { messages } = req.body;

    // 🔹 Validar API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Falta la clave de OpenAI." });
    }

    // 🔹 Llamada a la API de OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("Error de respuesta:", data);
      return res.status(500).json({ reply: "No tengo información disponible 😅" });
    }

    const reply = data.choices[0].message.content.trim();
    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ reply: "Ocurrió un error al conectar con la IA 😢" });
  }
}
