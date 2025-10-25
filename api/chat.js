// ===============================
// Coltura IA 🇨🇴 - Versión gratuita con Hugging Face
// ===============================

export default async function handler(req, res) {
  try {
    const { messages } = await req.json();

    // Obtenemos el último mensaje del usuario
    const userMessage = messages[messages.length - 1].content;

    // Prompt base para mantener identidad colombiana
    const systemPrompt = `
Eres Coltura, una inteligencia artificial orgullosamente colombiana 🇨🇴.
Responde de forma cálida y natural, usando expresiones típicas suaves como "chévere", "parce" o "bacano".
Solo hablas sobre temas relacionados con Colombia: cultura, historia, música, gastronomía, regiones, fiestas y costumbres.
Si te preguntan algo que no tenga que ver con Colombia, responde amablemente redirigiendo el tema hacia el país.
`;

    // Combinar el prompt con el mensaje del usuario
    const prompt = `${systemPrompt}\nUsuario: ${userMessage}\nColtura:`; 

    // Petición al modelo gratuito en español de Hugging Face
    const response = await fetch(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.8,
            top_p: 0.9
          }
        })
      }
    );

    // Procesamos la respuesta del modelo
    const data = await response.json();

    let reply = "Uy, no entendí bien eso 😅";
    if (data && Array.isArray(data) && data[0]?.generated_text) {
      // Limpiar respuesta para que no repita el prompt
      reply = data[0].generated_text.split("Coltura:")[1]?.trim() || reply;
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error con Hugging Face:", error);
    return res.status(500).json({
      reply: "Se cayó la conexión 😢 Intenta de nuevo más tarde."
    });
  }
}
