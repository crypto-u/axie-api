const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const axios = require('axios')
const Sequelize = require("sequelize");
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Player = db.player;

// routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to dicord bot application." });
});
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/player.routes')(app);

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('message', async msg => {

  let msgConent = msg.content;
  let discordUser = "";

  if(msgConent.substring(0, 8).toLowerCase() == "!invites"){
    msgConent = msgConent.replace(/\s/g, "")
    discordUser = msgConent.substring(8).toLowerCase();
    msgConent = msgConent.substring(0, 8).toLowerCase();
  }

  switch (msgConent) {
    case "!test":
      msg.reply("Test 123!");
      break;

      case "!invite":
        let invite = await msg.channel.createInvite({
          maxAge: 0,
          maxUses: 0 // maximum times it can be used
       },
       `Requested with command by ${msg.author.tag}`
    )
    .catch(console.log);

    msg.channel.send(invite ? `Here's your invite: ${invite}` : "There has been an error during the creation of the invite.");
        break;

      case "!invites":
        msg.guild.invites.fetch().then((invites) => {
          const inviteCounter = {
           
          }
      
          invites.forEach((invite) => {
            const { uses, inviter } = invite
            const { username, discriminator } = inviter
      
            const name = `${username.toLowerCase().replace(/\s/g, "")}#${discriminator}`
      
            inviteCounter[name] = (inviteCounter[name] || 0) + uses
          })

          
      
          let replyText = ''
      
          const sortedInvites = Object.keys(inviteCounter).sort(
            (a, b) => inviteCounter[b] - inviteCounter[a]
          )
        
          //sortedInvites.length = 5

          //console.log(sortedInvites)
 
          const result = sortedInvites.filter(word => word == discordUser);

          if(result.length == 0 ){
            replyText += "Either user does not exists or you have typed a wrong discord name & tag"+ " \n" +
             "Command: !invites yourname#yourTag E.g great#1024";

          }

//console.log(result);
    
          for (const invite of result) {
            const count = inviteCounter[invite]
            replyText += `\n${invite} has invited ${count} member(s)!`
          }
      
          msg.channel.send(replyText)
        })
 
        break;
    
      case "!user":

      var disordTag = msg.member.user.username+'#'+msg.member.user.discriminator;
  
        db.sequelize.query(
          'SELECT * FROM players WHERE disordTag = :disordTag',
          {
            replacements: { disordTag: disordTag },
            type: Sequelize.QueryTypes.SELECT
          })
          .then(function(response) {

            const roninAddress = response[0].roninAddress
            console.log(roninAddress)
            axios.get(`https://game-api.axie.technology/api/v1/${roninAddress}`)
            .then((response) => {
              var slp =  response.data;
              console.log(slp)
              msg.channel.send(`${msg.member.user.username}#${msg.member.user.discriminator}`+" Axie Infinity Gaming Info: " + "\n" + "\n");
              msg.channel.send(
                "Player Name: " + slp.name  + "\n" +
                "Total SLP: " + slp.total_slp.toString()  + "\n" +
                "Last Claim SLP: " + slp.last_claim.toString() + "\n" + 
                "Next Claim Date: " + timeConverter(slp.next_claim) + "\n" +
                "MMR: " + slp.mmr.toString() + "\n" 
                ) 
            })
        
        })
        .catch((err) =>{
          msg.channel.send(`Sorry ${msg.member.user.username}#${msg.member.user.discriminator}, it seems you don't have an Axie Infinity account with us!` + "\n" +
          "Contact the Administrator for any questions or queries")
        });

        break;
   }
})

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ', ' + 2022;
  return time;
}

async function getMeme(){
  const res = await axios.get('https://meme-api.herokuapp.com/gimme');
  return res.data.preview[0];
}

async function getSLP(){

  const res = await axios.get('https://game-api.axie.technology/api/v1/ronin:fd809c29d00e34696b03c5bf6befad589aede36d');
  return res.data;
}

client.login(process.env.CLIENT_TOKEN); 

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});