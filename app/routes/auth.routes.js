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
  app.post("/api/createUpdateOrders", authJwt.verifyToken, orderController.createUpdateOrders);
  app.post("/api/cancelOrders", authJwt.verifyToken, orderController.cancelOrders);
  app.get("/api/customerList", authJwt.verifyToken, orderController.customerList);
  app.post("/api/productCount", authJwt.verifyToken, orderController.productCount); 
  app.post("/api/uploadProduct", authJwt.verifyToken, productController.uploadProduct); 
  app.post("/api/orderedProducts", authJwt.verifyToken, orderController.orderedProducts); 
  app.get("/api/getUsers", authJwt.verifyToken, authController.getUsers);
  app.get("/api/getOrders", authJwt.verifyToken, orderController.getOrders);
  app.get("/api/getProducts", authJwt.verifyToken, productController.getProducts);
};