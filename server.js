const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public")); // serves html

const WEBHOOK_URL = "PASTE_WEBHOOK_URL_HERE";

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
