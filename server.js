const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Purchase portal application." });
});

// routes
require("./app/routes/auth.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });