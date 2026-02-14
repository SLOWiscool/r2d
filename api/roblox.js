export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { player = {}, character = {}, game = {}, timestamp = {}, quiz = {}, session = {}, action = "did something" } = req.body;

    const WEBHOOK_URL = "https://discord.com/api/webhooks/1472301642144551056/QxYtAEY68AUjVXxc_v5KnQFvv-3FH0bykL_oTrzWjsfR8MMX_X8YnWI1PblP51ildRXO";
    if (!WEBHOOK_URL) return res.status(500).json({ error: "Webhook not set" });

    // Fallbacks
    const thumbnailUrl = (player.thumbnails && player.thumbnails.headshot) || "https://i.imgur.com/AfFp7pu.png";

    const embed = {
      title: `🏆 Quiz Result - ${player.displayName || player.name || "Unknown"}`,
      color: quiz.passed ? 0x57F287 : 0xED4245,
      description: `**${player.displayName || player.name || "Unknown"}** ${action}`,
      thumbnail: { url: thumbnailUrl },
      fields: [
        {
          name: "👤 Player Info",
          value:
            `Display: **${player.displayName || "Unknown"}**\n` +
            `Username: **${player.name || "Unknown"}**\n` +
            `UserId: **${player.userId || "N/A"}**\n` +
            `Membership: **${player.membershipType || "None"}**\n` +
            `Account Age: **${player.accountAge || "N/A"} days**\n` +
            `${player.profileLink ? `[Profile Link](${player.profileLink})` : ""}`,
          inline: false
        },
        {
          name: "🎮 Character Stats",
          value:
            `Health: **${character.health || 0}/${character.maxHealth || 0}**\n` +
            `WalkSpeed: **${character.walkSpeed || 0}**\n` +
            `JumpPower: **${character.jumpPower || 0}**\n` +
            `Position: X=${(character.position?.x ?? 0)}, Y=${(character.position?.y ?? 0)}, Z=${(character.position?.z ?? 0)}`,
          inline: false
        },
        {
          name: "🌍 Game Info",
          value:
            `Game: **${game.placeName || "Unknown"}** (ID: ${game.gameId || "N/A"})\n` +
            `Creator: ${game.creator?.name || "Unknown"} (${game.creator?.type || "N/A"})\n` +
            `JobId: **${game.jobId || "N/A"}**\n` +
            `Version: **${game.version || 0}**\n` +
            `Players: ${game.playerCount || 0}/${game.maxPlayers || 0}\n` +
            (game.privateServerId ? `Private Server Owner: ${game.privateServerOwnerId || 0}` : "Public Server"),
          inline: false
        },
        {
          name: "📊 Quiz Results",
          value:
            `Role: **${quiz.role || "N/A"}**\n` +
            `Score: **${quiz.score || 0}/${quiz.totalQuestions || 0}**\n` +
            `Percentage: **${quiz.percentage || 0}%**\n` +
            `Grade: **${quiz.grade || "N/A"}**\n` +
            `Passed: **${quiz.passed ? "✅ Yes" : "❌ No"}**`,
          inline: false
        },
        {
          name: "🕒 Session Info",
          value:
            `Session ID: **${session.playerId || "N/A"}**\n` +
            `Server Type: **${session.serverType || "N/A"}**\n` +
            `Server Size: **${session.serverSize || "N/A"}**\n` +
            `Timestamp: ${timestamp.readable || new Date().toISOString()} (${timestamp.timezone || "+0000"})`,
          inline: false
        }
      ],
      footer: { text: "Made by Vortex" }
    };

    console.log("Sending embed to Discord:", JSON.stringify(embed, null, 2));

    const discordRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
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
