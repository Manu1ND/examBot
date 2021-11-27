require('dotenv').config(); //initialize dotenv
const { Client, Intents } = require('discord.js');
const axios = require('axios'); //add this line at the top

// Allocating process module
const process = require('process');
// Printing process.version
console.log("node.js version " + process.version);

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); //create new client

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    switch (msg.content) {
        case "~ping":
            const timeTaken = Date.now() - msg.createdTimestamp;
		    msg.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
            break;
        //our meme command below
        case "~meme":
            msg.channel.send("Here's your meme!"); //Replies to user command
            const img = await getMeme(); //fetches an URL from the API
            msg.channel.send(img); //send the image URL
            break;
    }
});

async function getMeme() {
    const res = await axios.get('https://memeapi.pythonanywhere.com/');
    return res.data.memes[0].url;
}
// 912023726072139777

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
