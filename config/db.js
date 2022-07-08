const mongoose = require("mongoose");

async function connectToDB() {
  const connection = await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });
}
module.exports = connectToDB;
