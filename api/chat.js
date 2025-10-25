export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { messages } = req.body;

  try {
    // Verificamos que la clave exista
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "Error: No se encontró la API key 😢" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await response.json();

    // 🔹 Para depurar, imprimimos si hay error
    if (data.error) {
      console.error("Error de OpenAI:", data.error);
      return res.status(500).json({ reply: "Error con la API: " + data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "No tengo información disponible 😅";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({ reply: "Error al conectar con la IA 😢" });
  }
}
