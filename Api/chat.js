export default async function handler(req, res) {
  const { messages } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: messages,
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "No pude responder eso 😅";

  res.status(200).json({ reply });
}
