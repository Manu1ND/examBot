require('dotenv').config(); //initialize dotenv
const { Client, Intents, MessageEmbed } = require('discord.js');
const process = require('process'); // Allocating process module
const axios = require('axios');
const { parse } = require('path');

const prefix = "~";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); //create new client

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
            const timeTaken = Date.now() - msg.createdTimestamp;
            msg.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
            break;
            
        case "meme":
            msg.channel.send("Here's your meme!"); //Replies to user command
            const img = await getMeme(); //fetches an URL from the API
            msg.channel.send(img); //send the image URL
            break;

        case "delete":
            if (isNaN(args[0] || parseInt(args[0]) > 0)) {
                msg.reply("Please provide a valid number of messages to delete.");
            } else {
                msg.channel.bulkDelete(parseInt(args[0]) + 1).then(() => {
                    msg.channel.send(`Cleared ${args[0]} messages!`).then(msg => {
                        msg.react('😄');
                        setTimeout(() => msg.delete(), 3000)
                    });
                });
            }
            break;

        case "bye":
            const newEmbed = new MessageEmbed()
                .setColor('#e38f0e')
                .setTitle('Thankyou')
                .setDescription("Thankyou for your contribution and Good Bye!\nWe hope to see you again in the next sem!")
                .addFields(
                    { name: 'Check my Github', value: 'https://github.com/Manu1ND' },
                    { name: 'Source Code', value: 'https://github.com/Manu1ND/examBot' },
                )
                .setImage('https://i.imgur.com/Iq70SQE.gif')
                .setTimestamp()
                .setFooter('https://github.com/Manu1ND', 'https://logos.textgiraffe.com/logos/logo-name/Manu-designstyle-i-love-m.png');
            console.log(newEmbed);
            msg.channel.send({ embeds: [newEmbed] });
    }
});

async function getMeme() {
    const res = await axios.get('https://memeapi.pythonanywhere.com/');
    return res.data.memes[0].url;
}
// 912023726072139777

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
