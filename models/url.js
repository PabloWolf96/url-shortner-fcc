const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UrlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: Number,
  },
});
UrlSchema.plugin(AutoIncrement, { inc_field: "shortUrl" });
module.exports = mongoose.model("Url", UrlSchema);
