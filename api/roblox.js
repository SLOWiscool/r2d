export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { player, game, quiz, action } = req.body;

    const WEBHOOK_URL = "https://discord.com/api/webhooks/1472301642144551056/QxYtAEY68AUjVXxc_v5KnQFvv-3FH0bykL_oTrzWjsfR8MMX_X8YnWI1PblP51ildRXO";

    // green if passed, red if failed
    const color = quiz.passed ? 0x57F287 : 0xED4245;

    const embed = {
      title: "🏆 Quiz Result",
      color: color,
      description: `**${player.displayName}** (${player.name}) ${action}`,
      fields: [
        {
          name: "👤 Player",
          value:
            `Display: **${player.displayName}**\n` +
            `Username: **${player.name}**\n` +
            `UserId: **${player.userId}**\n` +
            `Account Age: **${player.accountAge} days**`,
          inline: false
        },
        {
          name: "🎭 Quiz",
          value:
            `Role: **${quiz.role}**\n` +
            `Score: **${quiz.score}/${quiz.totalQuestions}**\n` +
            `Percentage: **${quiz.percentage}%**`,
          inline: false
        },
        {
          name: "🌍 Server",
          value:
            `GameId: **${game.gameId}**\n` +
            `PlaceId: **${game.placeId}**\n` +
            `JobId: **${game.jobId}**`,
          inline: false
        }
      ],
      footer: {
        text: `⏰ ${game.timestamp}`
      },
      thumbnail: {
        url: `https://www.roblox.com/headshot-thumbnail/image?userId=${player.userId}&width=420&height=420&format=png`
      }
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false });
  }
}

