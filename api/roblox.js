export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { player, action, role, score, totalQuestions } = req.body;

    const WEBHOOK_URL = "https://discord.com/api/webhooks/1472301642144551056/QxYtAEY68AUjVXxc_v5KnQFvv-3FH0bykL_oTrzWjsfR8MMX_X8YnWI1PblP51ildRXO";

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          `🏆 **WIN EVENT**\n\n` +
          `👤 Player: **${player}**\n` +
          `📌 Action: ${action}\n` +
          `🎭 Role: **${role}**\n` +
          `✅ Score: **${score}/${totalQuestions}**`
      })
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false });
  }
}
