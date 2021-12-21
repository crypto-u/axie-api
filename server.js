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

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Player = db.player;

// db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/player.routes')(app);

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('message', async msg => {
  switch (msg.content) {
    case "!test":
      msg.reply("Test 123!");
      break;

      case "!invites":
        msg.guild.invites.fetch().then((invites) => {
          const inviteCounter = {
            bob: 19,
            joe: 30,
          }
      
          invites.forEach((invite) => {
            const { uses, inviter } = invite
            const { username, discriminator } = inviter
      
            const name = `${username}#${discriminator}`
      
            inviteCounter[name] = (inviteCounter[name] || 0) + uses
          })
      
          let replyText = 'Invites:'
      
          const sortedInvites = Object.keys(inviteCounter).sort(
            (a, b) => inviteCounter[b] - inviteCounter[a]
          )
      
          //console.log(sortedInvites)
      
          sortedInvites.length = 4
      
          for (const invite of sortedInvites) {
            const count = inviteCounter[invite]
            replyText += `\n${invite} has invited ${count} member(s)!`
          }
      
          msg.channel.send(replyText)
        })
        // msg.guild.invites.fetch()
        // .then(guild => {
        //   console.log(guild)
        // })
        // .catch(console.error)
        break;
    //our meme command below
    case "!meme":
      msg.channel.send("Here's your meme!"); //Replies to user command
      const img = await getMeme(); //fetches an URL from the API
      msg.channel.send(img); //send the image URL
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
                "Lifetime SLP: " + slp.lifetime_slp.toString() + "\n" +
                "Last Claim SLP: " + slp.last_claim.toString() + "\n" + 
                "Next Claim SLP: " + slp.next_claim.toString() + "\n" +
                "Prayer Rank: " + slp.rank.toString() + "\n" +
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

async function getMeme(){
  const res = await axios.get('https://meme-api.herokuapp.com/gimme');
  return res.data.preview[0];
}

async function getSLP(){

  const res = await axios.get('https://game-api.axie.technology/api/v1/ronin:fd809c29d00e34696b03c5bf6befad589aede36d');
  //console.log(res.data.total_slp)
  return res.data;
}

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); 

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user"
//   });
 
//   Role.create({
//     id: 2,
//     name: "moderator"
//   });
 
//   Role.create({
//     id: 3,
//     name: "admin"
//   });
// }