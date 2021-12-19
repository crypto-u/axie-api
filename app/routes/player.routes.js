const { authJwt } = require("../middleware");
const controller = require("../controllers/player.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/players", controller.create);
  app.get("/api/players",  controller.findAll);
  app.get("/api/players/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findOne);

};
