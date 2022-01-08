module.exports = (sequelize, Sequelize) => {
    const Scholars = sequelize.define("scholars", {
      ronin_address: {
        type: Sequelize.STRING
       },
       ronin_short: {
        type: Sequelize.STRING
       },
      success: {
       type: Sequelize.BOOLEAN
      },
       scholar_name: {
        type: Sequelize.STRING
       },
      cache_last_updated: {
       type: Sequelize.INTEGER
      },
      draw_total: {
       type: Sequelize.INTEGER
      },
      lose_total: {
       type: Sequelize.INTEGER
      },
      win_total: {
       type: Sequelize.INTEGER
      },
      total_matches: {
       type: Sequelize.INTEGER
      },
      win_rate: {
       type: Sequelize.INTEGER
      },
      mmr: {
       type: Sequelize.INTEGER
      },
      rank: {
       type: Sequelize.INTEGER
      },
      ronin_slp: {
       type: Sequelize.INTEGER
      },
      total_slp: {
       type: Sequelize.INTEGER
      },
      raw_total: {
       type: Sequelize.INTEGER
      },
      in_game_slp: {
       type: Sequelize.INTEGER
      },
      last_claim: {
       type: Sequelize.INTEGER
      },
      lifetime_slp: {
       type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      next_claim: {
       type: Sequelize.INTEGER
      }
    });
  
    return Scholars;
  };

