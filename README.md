# Global Chat Bot

![Bot Icon](/picture/global_icon.png)


[Stable version](https://github.com/YSK813/globalchat-bot)  
[Experiment version](https://github.com/YSK813/globalchat-bot/tree/experiment)



# Developer  
Discord : YSK#7011  
Twitter : [@YSK__0813](https://twitter.com/YSK__0813)  
Support : [Discord Server](https://discord.gg/scHkEmcrwR)  

#### If you find a bug, please report it to the support server.



# Discord.js Version used
[Discord.js 13.9.0](https://github.com/discordjs/discord.js/releases/tag/13.9.0)



# Install and used.  
1.Get your bot TOKEN.  
2.`[Run Command]` : `git clone https://github.com/YSK813/globalchat-bot.git`  
3.Create `secret` folder and `secret/token.json` files.  
4.Put TOKEN into `./src/secret/token.json`  
5.`[Run Command]` : `npm install`  
6.`[Bot Run Command]` : `node scsbot.js`  



# `src/secret/token.json` description.
```json
{
    "token": "xxx"
}
```
Please replace `xxx` your bot token.



# `src/commands/settings.json` description.
```json
{
    "prefix": ".",
    "log_channel": "xxx",

    "emojis": {
        "ok": "🔵",
        "no": "⛔"
    },

    "embed": {
        "color": {
            "ok": "#007fff",
            "no": "#ff0000"
        }
    },

    "config": {
        "discordlink": false
    }
}
```  
- "prefix" : This is Set Bot command prefix.
- "log_channel" : Channel to send all bot logs.
- "emojis" : Emoji that reacts to the message.
  - "ok" : If OK.
  - "no" : If NO.
- "embed" : Embed settings.
  - "color": Embed color in your Bot.
    - "ok" : If process success.
    - "no" : If process error.
- "config" : You can change the settings related to global chat.
  - "discordlink" : Do you want to send a Discord invitation link?
    - "true" : Can be sent.
    - "false" : Cannot send.