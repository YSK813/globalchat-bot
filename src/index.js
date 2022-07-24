const discord = require(`discord.js`);
const { Client, MessageEmbed, WebhookClient } = require(`discord.js`);
const client = new Client({ intents: 32767, allowedMentions: {repliedUser: false}});
const fs = require(`fs`)


//Load json files
const setting = require(`./setting.json`);
const { token } = require(`./secret/token.json`);



//Client login : Bot started
client.login(token);



//CLient Events : ready
client.on(`ready`, () => {
    console.log(`Started Bot : ${client.user.tag}`);
    //client.channels
})



//Client Events : messageCreate
client.on(`messageCreate`, (message) => {
    if(message.author.bot || message.channel.type === `DM`) return;
    const prefix = setting.prefix;


    //Error embed templete
    const error = new MessageEmbed()
        .setTitle(`Error`)
        .setColor(setting.embed.color.no)


    //GLobal chat system
    if(message.content.indexOf(prefix) !== 0) {
        if(message.mentions.users.first()) return message.react(`⛔`)

        //"@everyone" and "@here" change message content
        const msgcontent = message.content.replace(/@everyone/g, `[everyone]`).replace(/@here/g, `[here]`)


        /* Config */
        //Not discord invite links
        if(setting.config.discordlink === false) {
            if(message.content.match(/discord.gg/)) return message.reply({embeds: [error.addField(`Invite link Error`, `You cannot include an invitation link for the Discord server.`)]})
        }

        
        try {
            const guildwebhook = JSON.parse(fs.readFileSync(`globalchatfiles/${message.guild.id}/webhook.json`));
            var sentchannelid = guildwebhook.channel;
        } catch(err) {
            return;
        }

        if(message.channel.id === sentchannelid) {
            client.guilds.cache.forEach(guild => {
                try {
                    var webhook = JSON.parse(fs.readFileSync(`globalchatfiles/${guild.id}/webhook.json`));
                } catch (err) {
                    return;
                }

                var channelid = webhook.channel;

                try {
                    client.channels.cache.get(channelid).id;
                } catch(err) {
                    message.react(setting.emojis.no);
                }

                const webhookid = webhook.id;
                const webhooktoken = webhook.token;
                const webhookurl = webhook.url;

                if(message.guild.id === guild.id) return;

                const serverwebhook = new WebhookClient({id: webhookid, token: webhooktoken, url: webhookurl});

                try {
                    serverwebhook.send({content: msgcontent, username: message.author.tag, avatarURL: message.author.avatarURL()})
                    message.react(setting.emojis.ok)
                } catch(err) {
                    console.log(err)
                }
            })
        }
    }



    //
    if(!message.content.startsWith(setting.prefix)) return;
    const cmd = message.content.replace(setting.prefix, ``)



    //Help command
    if(cmd === `help`) return message.reply({content: `Help command`})
    

    
    //Join command
    if(cmd === `join`) {
        if(!message.member.permissions.has(`MANAGE_WEBHOOKS`)) return message.reply({content: `You have no authority`})

        message.channel.createWebhook(`${client.user.username} GC`).then(webhook => {
            const webhookinfo = {
                "id": `${webhook.id}`,
                "token": `${webhook.token}`,
                "url": `${webhook.url}`,
                "channel": `${message.channel.id}`,
            };

            const savedata = JSON.stringify(webhookinfo);


            try {
                fs.mkdirSync(`globalchatfiles/${message.guild.id}/`, {recursive: true});
                fs.writeFileSync(`globalchatfiles/${message.guild.id}/webhook.json`, savedata);
                message.channel.setRateLimitPerUser(1);
            } catch (err) {
                return message.reply({content: `I couldn't join the global chat.\nPlease try again.`});
            }

            const sentchannelid = webhook.channel;

            const webhooks = new WebhookClient({id: webhook.id, token: webhook.token, url: webhook.url});

            webhooks.send({content: `I participated in a global chat.`});


            client.guilds.cache.forEach(guild => {
                try {
                    var webhookjoined = JSON.parse(fs.readFileSync(`globalchatfiles/${guild.id}/webhook.json`));
                } catch (err) {
                    return;
                }

                const channelid = webhookjoined.channel;

                try {
                    client.channels.cache.get(channelid).id;
                } catch (err) {
                    return;
                }

                const webhookid = webhookjoined.id;
                const webhooktoken = webhookjoined.token;

                if(message.channel.id === sentchannelid) return;
                if(message.guild.id === guild.id) return;

                try {
                    new WebhookClient({id: webhookid, token: webhooktoken}).send({content: `__**New Server**__\n\n\`${message.guild.name}\` has joined the global chat.`})
                } catch(err) {
                    return;
                }
            })
        })
    }
})