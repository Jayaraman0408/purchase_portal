const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const authController = require("../controllers/auth.controller");
const orderController = require("../controllers/orders.controller");
const productController = require("../controllers/products.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    authController.signup
  );
  app.post("/api/auth/signin", authController.signin);
  app.post("/api/createOrder", authJwt.verifyToken, orderController.createOrders);
  app.post("/api/updateOrder", authJwt.verifyToken, orderController.updateOrders);
  app.get("/api/customerList", authJwt.verifyToken, orderController.customerList);
  app.post("/api/productCount", authJwt.verifyToken, orderController.productCount); 
  app.post("/api/uploadProduct", authJwt.verifyToken, productController.uploadProduct);
};