export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { player, character, game, timestamp, quiz, session, action } = req.body;

    const WEBHOOK_URL = "https://discord.com/api/webhooks/1472301642144551056/QxYtAEY68AUjVXxc_v5KnQFvv-3FH0bykL_oTrzWjsfR8MMX_X8YnWI1PblP51ildRXO";

    if (!WEBHOOK_URL) return res.status(500).json({ error: "Webhook not set" });

    // Embed color: green = pass, red = fail
    const color = quiz.passed ? 0x57F287 : 0xED4245;

    const embed = {
      title: `🏆 Quiz Result - ${player.displayName}`,
      color: color,
      description: `**${player.displayName}** (${player.name}) ${action}`,
      thumbnail: { url: player.thumbnails.headshot },
      fields: [
        {
          name: "👤 Player Info",
          value:
            `Display: **${player.displayName}**\n` +
            `Username: **${player.name}**\n` +
            `UserId: **${player.userId}**\n` +
            `Membership: **${player.membershipType}**\n` +
            `Account Age: **${player.accountAge} days**\n` +
            `[Profile Link](${player.profileLink})`,
          inline: false
        },
        {
          name: "🎮 Character Stats",
          value:
            `Health: **${character.health}/${character.maxHealth}**\n` +
            `WalkSpeed: **${character.walkSpeed}**\n` +
            `JumpPower: **${character.jumpPower}**\n` +
            `Position: X=${character.position.x}, Y=${character.position.y}, Z=${character.position.z}`,
          inline: false
        },
        {
          name: "🌍 Game Info",
          value:
            `Game: **${game.placeName}** (ID: ${game.gameId})\n` +
            `Creator: ${game.creator.name} (${game.creator.type})\n` +
            `JobId: **${game.jobId}**\n` +
            `Version: **${game.version}**\n` +
            `Players: ${game.playerCount}/${game.maxPlayers}\n` +
            (game.privateServerId ? `Private Server Owner: ${game.privateServerOwnerId}` : "Public Server"),
          inline: false
        },
        {
          name: "📊 Quiz Results",
          value:
            `Role: **${quiz.role}**\n` +
            `Score: **${quiz.score}/${quiz.totalQuestions}**\n` +
            `Percentage: **${quiz.percentage}%**\n` +
            `Grade: **${quiz.grade}**\n` +
            `Passed: **${quiz.passed ? "✅ Yes" : "❌ No"}**`,
          inline: false
        },
        {
          name: "🕒 Session Info",
          value:
            `Session ID: **${session.playerId}**\n` +
            `Server Type: **${session.serverType}**\n` +
            `Server Size: **${session.serverSize}**\n` +
            `Timestamp: ${timestamp.readable} (${timestamp.timezone})`,
          inline: false
        }
      ],
      footer: { text: "Made by Vortex" }
    };

    // Send to Discord
    const discordRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }) // MUST be embeds array
    });

    if (!discordRes.ok) {
      const text = await discordRes.text();
      console.log("Discord rejected:", text);
      return res.status(500).json({ ok: false, discordError: text });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.log("Server error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
