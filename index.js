require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const url = require("url");
const connectToDB = require("./config/db");
connectToDB();
const Url = require("./models/url");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.post("/api/shorturl", (req, res) => {
  const lookupUrl = req.body.url;

  if (!lookupUrl.startsWith("http://") && !lookupUrl.startsWith("https://")) {
    return res.json({ error: "Invalid URL" });
  }
  const parsedUrl = url.parse(lookupUrl);
  dns.lookup(parsedUrl.hostname, {}, async (err, address, family) => {
    if (err) {
      res.json({ error: "invalid Hostname" });
    } else {
      const prevUrl = await Url.findOne({ url: lookupUrl });
      if (!prevUrl) {
        const newUrl = new Url({ url: lookupUrl });
        await newUrl.save();
        res.json({ original_url: lookupUrl, short_url: newUrl.shortUrl });
      } else {
        res.json({ original_url: lookupUrl, short_url: prevUrl.shortUrl });
      }
    }
  });
});
app.get("/api/shorturl/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;
  const urlInDb = await Url.findOne({ shortUrl });
  if (urlInDb) {
    res.redirect(urlInDb.url);
  } else {
    res.json({ error: "No Short URL found for the given input" });
  }
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
