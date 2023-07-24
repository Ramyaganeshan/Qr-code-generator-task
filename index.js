const express = require("express");
const app = express();
const port = 3000;
const shortUUID = require("short-uuid");
const qrcode = require("qrcode");
const fs = require("fs");
const dataHandler = require("./dataHandler");

console.log(data);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static("public"));

const { readDataFromFile, writeDataToFile, submittedData } = dataHandler;

readDataFromFile();

console.log(submittedData);

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.post("/submit", async (req, res) => {
  const uid = shortUUID.generate();
  const newSubmission = {
    id: uid,
    name: req.body.name,
    dateofbirth: req.body.dateofbirth,
    email: req.body.email,
    contactnumber: req.body.contactnumber,
  };
  submittedData[uid] = newSubmission;

  console.log("Data submitted with ID:", uid);
  console.log("Submitted data:", req.body);

  writeDataToFile();

  res.redirect(`/qr/${uid}`);
});

app.get("/qr/:id", (req, res) => {
  const uid = req.params.id;
  const data = submittedData[uid];

  if (!data) {
    return res.status(404).send("Data not found");
  }

  const url = `http://localhost:${port}/data/${uid}`;

  qrcode.toDataURL(url, (err, qrCodeUrl) => {
    if (err) {
      return res.status(500).send("Error generating QR code");
    }

    res.render("pages/qr", { qrCodeUrl, uid });
  });
});

app.get("/data/:id", (req, res) => {
  const uid = req.params.id;
  const data = submittedData[uid];

  if (!data) {
    return res.status(404).send("Data not found");
  }

  res.render("pages/success", { data });
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
