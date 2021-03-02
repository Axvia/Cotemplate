const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', ()=>{
    console.log(`[DSB] :: ${client.user.username} is ready.`)
})

const Prefix = '@'
client.on('message', async message => {
    if (message.author.bot) return;
    if (message.author.id !== client.user.id) return;
    const args = message.content.slice(Prefix.length).trim().split(/ +/);
    const timer = ms => new Promise(res => setTimeout(res, ms));
    const thisServer = client.guilds.get(message.guild.id)
    if (message.content.startsWith(Prefix + 'clone')) {
        try {
            const input = args[1];
            const thatServer = client.guilds.get(input)
            if (!input) return message.channel.send('Please provide a server id to clone')
    
            if (message.content.endsWith("information")) return serverInformation();
            async function serverInformation() {
                try {
                    await thisServer.setIcon(thatServer.iconURL).then(icon => {
                        console.log("Set server icon to "+icon.iconURL)
                    })//.catch(console.log("Failed to set server icon"))
            
                    await thisServer.setRegion(thatServer.region).then(reg => {
                        console.log("Set server region to "+reg.region)
                    })//.catch(console.log("Failed to set server region"))
            
                    await thisServer.setDefaultMessageNotifications(thatServer.defaultMessageNotifications).then(notif => {
                        console.log("Set default notification to "+notif.defaultMessageNotifications)
                    })//.catch(console.log("Failed to set default message notification"))
            
                    await thisServer.setName(thatServer.name).then(nme => {
                        console.log("Set server name to "+nme.name)
                    })//.catch(console.log("Failed to set server name"))
            
                    await thisServer.setPosition(thatServer.position).then(post => {
                        console.log("Set server position to "+post.position)
                    })//.catch(console.log("Failed to set server position"))
            
                    await thisServer.setSystemChannel(thatServer.systemChannel).then(scn => {
                        console.log("Set server system channel to "+scn.systemChannel)
                    })//.catch(console.log("Failed to set server system channel"))
            
                    await thisServer.setAFKTimeout(thatServer.afkTimeout).then(afk => {
                        console.log("Set server afk timeout to "+afk.afkTimeout)
                    })//.catch(console.log("Failed to set server afk timeout"))
            
                    await thisServer.setExplicitContentFilter(thatServer.explicitContentFilter).then(expl => {
                        console.log("Set server explicit content filter to"+expl.explicitContentFilter)
                    })//.catch(console.log("Failed to set explicit content filter"))
            
                    await thisServer.setVerificationLevel(thatServer.verificationLevel).then(verf =>{
                        console.log("Set server verification level to "+verf.verificationLevel)
                    })//.catch(console.log("Failed to set server verification level"))

                    await thisServer.setSplash(thatServer.splashURL).then(spl =>{
                        console.log("Set server splash "+spl.splashURL)
                    })//.catch(console.log("Failed to set server splash"))

                    console.log("Successfully cloning server information")
                    console.clear()

                } catch (error) {
                    return console.log("Error while cloning server information :: "+error)
                }
            }
    
            if (message.content.endsWith("roles")) return serverRoles();
            async function serverRoles(){
                try {
                    // Clone roles
                    let roles = thatServer.roles.sort((a, b) => b.calculatedPosition - a.calculatedPosition).map(r => r)
                    for (var i = 0; i < roles.length; i++) {
                        let hasRole = await thisServer.roles.find(c => c.name === roles[i].name)
                        if (hasRole) continue;
                        await timer(2000); // Add delay to avoid ratelimit
                        thisServer.createRole({
                            type: roles[i].type,
                            name: roles[i].name,
                            color: roles[i].hexColor,
                            hoist: roles[i].hoist,
                            permissions: roles[i].permissions,
                            managed: roles[i].managed,
                            mentionable: roles[i].mentionable
                        }).then(async createdRole => {
                            console.log('Created Role: ' + createdRole.name)
                            await console.clear()
                        }).catch(()=>{})
                    }
                } catch (error) {
                    return console.log(`Error while cloning server roles :: ${error}`)
                }
            }
    
            if (message.content.endsWith("categories")) return serverCategories();
            async function serverCategories(){
                try {
                    // Clone categories
                    let categories = thatServer.channels.filter(c => c.type === "category").sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c => c);
                    categories.forEach(function(category, index) {
                        setTimeout(async function() {
                            let hasCateg = await thisServer.channels.find(c => c.name === category.name)
                            if (hasCateg) return;
                
                            await thisServer.createChannel(category.name, 'category').then(async createdCategory => {
                                console.log('Created category: ' + createdCategory.name)
                                await console.clear()
                            }) 
                        }, index * 2000); // Add delay to avoid ratelimit
                    })
                } catch (error) {
                    return console.log(`Error while cloning server categories :: ${error}`)
                }
            }

            if (message.content.endsWith("text")) return serverTextChannels();
            async function serverTextChannels() {
                try {
                    // Clone text channels
                    let channels = thatServer.channels.filter(c => c.type === "text").sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c => c);    
                    for (var i = 0; i < channels.length; i++) {
                        let hasCText = channels[i]
                        let hasText = await thisServer.channels.find(c => c.name === hasCText.name)
                        if (hasText) continue;
    
                        await timer(2000); // Add delay to avoid ratelimit
    
                        if (!hasCText.parent) {
                            var channel2 = await thisServer.createChannel(hasCText.name, 'text', channels[i].permissionOverwrites)
                            if (channels[i].topic) {
                                channel2.setTopic(channels[i].topic)
                            }
                        }
                        if (hasCText.parent) {
                            var channel = await thisServer.createChannel(hasCText.name, 'text')
                            if (channels[i].topic) {
                                channel.setTopic(channels[i].topic)
                            }
                            var ll = await thisServer.channels.find(c => c.name === hasCText.parent.name)
                            if (ll) {
                                channel.setParent(thisServer.channels.find(c => c.name === hasCText.parent.name).id)
                            } else {
                                var ll1 = await thisServer.createChannel(hasCText.parent.name, 'category')
                                channel.setParent(ll1)
                            }
                        }
                        console.log('Created Text Channel: '+hasCText.name)
                        await console.clear()
                    }
                } catch (error) {
                    return console.log(`Error while cloning text channels :: ${error}`)
                }
            }
    
            if (message.content.endsWith("voice")) return serverVoiceChannels();
            async function serverVoiceChannels() {
                try {
                    // Clone voice channels
                    let voice = thatServer.channels.filter(c => c.type === "voice").sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c => c);
                    for (var i = 0; i < voice.length; i++) {
                        let hasCVoice = voice[i]
                        let hasVoice = await thisServer.channels.find(c => c.name === hasCVoice.name)
                        if (hasVoice) continue;
                        
                        await timer(2000); // Add delay to avoid ratelimit

                        if (!hasCVoice.parent) {
                            await thisServer.createChannel(hasCVoice.name, 'voice', voice[i].permissionOverwrites)
                        }
        
                        if (hasCVoice.parent) {
                            var channel = await thisServer.createChannel(hasCVoice.name, 'voice')
                            var ll = await thisServer.channels.find(c => c.name === hasCVoice.parent.name)
                            if (ll) {
                                channel.setParent(thisServer.channels.find(c => c.name === hasCVoice.parent.name).id)
                            } else {
                                var ll1 = await thisServer.createChannel(hasCVoice.parent.name, 'category')
                                channel.setParent(ll1)
                            }
                        }
                        console.log('Created Voice Channel: ' + channel)
                        await console.clear()
                    }
                } catch (error) {
                    return console.log(`Error while cloning voice channels :: ${error}`)
                }
            }

            if (message.content.endsWith("emojis-normal")) return serverEmojisNormal();
            async function serverEmojisNormal(){
                try {
                    // Clone emojis
                    const emojiLogsNormal = []
                    const emojiData = thatServer.emojis.filter(emoji => emoji.animated === false).sort((a, b) => a.createdAt - b.createdAt).map(e => e);
                    for (var i = 0; i < emojiData.length; i++) {
                        const commonEmoji = emojiData[i]
                        const hastEmojiData = emojiLogsNormal.includes(commonEmoji.url)
                        if (hastEmojiData) continue;
                        await timer(2000);
                        thisServer.createEmoji(commonEmoji.url, commonEmoji.name).then(async createdEmoji => {
                            console.log('Created Normal Emoji: ' + createdEmoji)
                            await console.clear()
                        }).catch(()=>{})
                    }
                } catch (error) {
                    return  console.log(`Error while server emojis :: ${error}`)
                }
            }
            if (message.content.endsWith("emojis-animated")) return serverEmojisAnimated();
            async function serverEmojisAnimated(){
                try {
                    // Clone emojis
                    const emojiLogsAnimated = []
                    const emojiData = thatServer.emojis.filter(emoji => emoji.animated === true).sort((a, b) => a.createdAt - b.createdAt).map(e => e);
                    for (var i = 0; i < emojiData.length; i++) {
                        const commonEmoji = emojiData[i]
                        const hastEmojiData = emojiLogsAnimated.includes(commonEmoji.url)
                        if (hastEmojiData) continue;
                        await timer(2000);
                        thisServer.createEmoji(commonEmoji.url, commonEmoji.name).then(async createdEmoji => {
                            console.log('Created Animated Emoji: ' + createdEmoji)
                            await console.clear()
                        }).catch(()=>{})
                    }
                } catch (error) {
                    return  console.log(`Error while server emojis :: ${error}`)
                }
            }
        } catch (error) {
            return;
        }
    }


    if (message.content.startsWith(Prefix + 'nuke channels')) {
        async function DeleteAllChannels() {
            await message.guild.channels.forEach((channel, index) => {
                setTimeout(() => {
                    channel.delete().then(console.log(`channel deleted ${channel.name}`)).catch(()=>{})
                }, index * 3000);
            })
        } DeleteAllChannels().then(console.log("Nuke channel complete")).catch(()=>{})
    }
    if (message.content.startsWith(Prefix + 'nuke roles')) {
        await message.guild.roles.forEach((role, index) => {
            setTimeout(() => {
                if (!role.name === 'everyone') {
                    role.delete().then(console.log(`Role deleted ${role.name}`)).catch(()=>{})
                }
            }, index * 3000);
        })
    }
    if (message.content.startsWith(Prefix + 'clear console')) {
        await console.clear()
    }
    if (message.content.startsWith(Prefix + 'emoji')) {
        const input = args[1];
        const thatServer = client.guilds.get(input)
        if (!input) return message.channel.send('Please provide a server id to clone')
        if (message.content.endsWith('normal')) {
            try {
                const emojiNormalLog = []
                const emojiNormal = thatServer.emojis.filter(emoji => emoji.animated === false).sort((a, b) => a.createdAt - b.createdAt).map(e => e);
                for (var i = 0; i < emojiNormal.length; i++) {
                    const commonEmoji = emojiNormal[i]
                    const hastEmojiData = emojiNormalLog.includes(commonEmoji.url)
                    if (hastEmojiData) continue;
                    await timer(3000);
                    console.log(`Backup :: ${commonEmoji.name}`)
                    await message.channel.send(`\`\`\`Name :: ${commonEmoji.name} :: Emoji\`\`\``)
                    await message.channel.send(`${commonEmoji.url}`)
                    await console.clear()
                }
            } catch (error) {
                return;
            }
        } else if (message.content.endsWith('animated')) {
            try {
                const emojiAnimatedLog = []
                const emojiAnimated = thatServer.emojis.filter(emoji => emoji.animated === true).sort((a, b) => a.createdAt - b.createdAt).map(e => e);
                for (var i = 0; i < emojiAnimated.length; i++) {
                    const commonEmoji = emojiAnimated[i]
                    const hastEmojiData = emojiAnimatedLog.includes(commonEmoji.url)
                    if (hastEmojiData) continue;
                    await timer(3000);
                    console.log(`Backup :: ${commonEmoji.name}`)
                    await message.channel.send(`\`\`\`Name :: ${commonEmoji.name} :: Emoji\`\`\``)
                    await message.channel.send(`${commonEmoji.url}`)
                    await console.clear()
                }
            } catch (error) {
                return;
            }
        }
    }
})

client.login("TOKEN")