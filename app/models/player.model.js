module.exports = (sequelize, Sequelize) => {
    const Player = sequelize.define("players", {
      name: {
        type: Sequelize.STRING
      },
      account: {
        type: Sequelize.STRING
      },
      disordTag: {
        type: Sequelize.STRING
      },
      roninAddress: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      }
    });
  
    return Player;
  };
  