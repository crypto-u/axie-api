const db = require("../models");
const Scholar = db.scholar;
const Player = db.player;
const Op = db.Sequelize.Op;
const axios = require('axios');

exports.create = async (req, res) => {

  const data = await getPlayers()

  console.log("Size of ther array: " + data.length)

  data.forEach(element => {
    const roninAddress = element.dataValues.roninAddress;
    const scholarName = element.dataValues.account;
    createScholar(roninAddress, scholarName)
  });

  res.send(data);
};

getPlayers = async () => {

  return Player.findAll()
    .catch(err => {
      console.log(err)
    });
}

createScholar = async (ronninAddress, scholarName) => {

  const roninPrefix = "ronin:";
  try {

    axios.get(`https://game-api.axie.technology/api/v1/${roninPrefix}${ronninAddress}`)
      .then((response) => {
        populateData(response.data, ronninAddress, scholarName);
      })
      .catch(err => {

      })

  } catch (error) {

  }

  populateData = async (data, data2, data3) => {

    var timestamp = data.next_claim
    var date = new Date(timestamp * 1000);

    var date1 = new Date();
    const hello = JSON.stringify(date)
    const gogo = hello.substring(1, 11).replace("1970", "2022").replace("-", "/").replace("-", "/");
    const gogo2 = hello.substring(1, 11).replace("1970", "2022");
    console.log(gogo);

    const hello2 = JSON.stringify(date1);
    const gogo8 = hello2.substring(1, 11).replace("-", "/").replace("-", "/");
    console.log(gogo8);

    var date5 = new Date(gogo);
    var date6 = new Date(gogo8);

    var Difference_In_Time = date5.getTime() - date6.getTime();

    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    const scholar = {
      ronin_address: data2,
      ronin_short: data2.substring(0, 4) + '...' + data2.slice(-4),
      remaining_days: Difference_In_Days,
      scholar_name: data3,
      success: data.success,
      cache_last_updated: data.cache_last_updated,
      draw_total: data.draw_total,
      lose_total: data.lose_total,
      win_total: data.win_total,
      total_matches: data.total_matches,
      win_rat: data.win_rat,
      mmr: data.mmr,
      rank: data.rank,
      ronin_slp: data.ronin_slp,
      total_slp: data.total_slp,
      raw_total: data.raw_total,
      in_game_slp: data.in_game_slp,
      last_claim: data.last_claim,
      lifetime_slp: data.lifetime_slp,
      name: data.name,
      next_claim: data.next_claim,
      next_claim_date: gogo2
    };

    await Scholar.create(scholar)
      .catch(err => {
        console.log(err)
      });
  }



}

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Scholar.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving players."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Player.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Player with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Player with id=" + id
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;
  Scholar.destroy({
    where: { id }
  }).then(() => {
    res.status(204).end();
  });
};