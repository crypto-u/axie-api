const db = require("../models");
const Player = db.player;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const player = {
    name: req.body.name,
    account: req.body.account,
    disordTag: req.body.disordTag,
    roninAddress: req.body.roninAddress,
    status: req.body.status
  };

  Player.create(player)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Player."
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Player.findAll({ where: condition })
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

  Player.destroy({
    where: {id}
   }).then(() => {
    res.status(204).end();
   });

  // Player.destroy(id)
  //   .then(data => {
  //     if (data) {
  //       res.send(data);
  //     } else {
  //       res.status(404).send({
  //         message: `Cannot find Player with id=${id}.`
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Error retrieving Player with id=" + id
  //     });
  //   });
};