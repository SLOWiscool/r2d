const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const WEBHOOK_URL = "https://discord.com/api/webhooks/1472301642144551056/QxYtAEY68AUjVXxc_v5KnQFvv-3FH0bykL_oTrzWjsfR8MMX_X8YnWI1PblP51ildRXO";

// endpoint roblox will send to
app.post("/roblox", async (req, res) => {
    try {
        const { player, action } = req.body;

        await axios.post(WEBHOOK_URL, {
            content: `👤 **${player}**\n📌 ${action}`
        });

        res.status(200).json({ success: true });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false });
    }
});

app.listen(3000, () => console.log("Website running on port 3000"));
