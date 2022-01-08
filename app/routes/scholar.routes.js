const { authJwt } = require("../middleware");
const controller = require("../controllers/scholar.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/scholars", controller.create);
  app.get("/api/scholars",  controller.findAll);
  app.delete("/api/scholars/:id",  controller.deleteOne);
  app.get("/api/scholars/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findOne);

};
