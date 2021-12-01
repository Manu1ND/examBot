require('dotenv').config(); //initialize dotenv
const { Client, Intents, MessageEmbed } = require('discord.js');
const process = require('process'); // Allocating process module
const axios = require('axios');

const prefix = "+";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] }); //create new client

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async msg => {
    if (msg.author.bot) return; // to check if the author of the bot is a bot
    if (!msg.content.toLowerCase().startsWith(prefix)) return;

    const commandBody = msg.content.slice(prefix.length);
    const args = commandBody.split(' '); // splits
    const command = args.shift().toLowerCase(); // removes command name from const args and assigns it to const command

    switch (command) {
        case "ping":
            ping(msg);
            break;

        case "meme":
            sendMeme(msg.channel);
            break;

        case "clear":
            if (isNaN(args[0] || parseInt(args[0]) > 0)) {
                msg.reply("Please provide a valid number of messages to delete.");
            } else {
                bulkClear(msg.channel, parseInt(args[0]));
            }
            break;

        case "clearallcat": // clear channles in categories
            let channelCategories = msg.guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY');
            channelCategories.forEach(channelCategory => {
                channelCategory.children.forEach(channel => bulkClear(channel, 25));
            });
            break;

        case "bye": // for single channel
            byeEmbed(msg.channel);
            break;

        case "byedm": // for DM
            (await msg.guild.members.fetch()).forEach(member => {
                if (member.user.bot == false) {
                    byeEmbed(member.user, member.user);
                }
            });
    }
});

function ping(msg) {
    const timeTaken = Date.now() - msg.createdTimestamp;
    msg.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
}

async function sendMeme(channel) {
    channel.send("Here's your meme!"); //Replies to user command
    const res = await axios.get('https://memeapi.pythonanywhere.com/');
    const img = res.data.memes[0].url;
    channel.send(img); //send the image URL
}

function bulkClear(channel, amount) {
    channel.bulkDelete(amount + 1).then(() => {
        channel.send(`Cleared messages!`).then(m => {
            m.react('😄');
            setTimeout(() => m.delete(), 3000)
        });
    });
}

function byeEmbed(channel, user = "@everyone") {
    const newEmbed = new MessageEmbed()
        .setColor('#e38f0e')
        .setTitle('Thankyou')
        .setDescription(`Thankyou ${user} for your contribution and Good Bye!\nWe hope to see you again in the next sem!`)
        .addFields(
            { name: 'Check my Github', value: 'https://github.com/Manu1ND' },
            { name: 'Source Code', value: 'https://github.com/Manu1ND/examBot' },
        )
        .setImage('https://i.imgur.com/Iq70SQE.gif')
        .setTimestamp()
        .setFooter('https://github.com/Manu1ND', 'https://logos.textgiraffe.com/logos/logo-name/Manu-designstyle-i-love-m.png');
    channel.send({ embeds: [newEmbed] }).then(m => {
        m.react('😜');
        m.react('🤭');
        m.react('🤧');
    });
}

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
