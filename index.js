const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const uri =
  "mongodb+srv://dino9611:pwdk123@cluster0.ydv5x.mongodb.net/toko?retryWrites=true&w=majority";
const mongoose = require("mongoose");
const orders = require("./models/orderVoucher");

const { createTransport } = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
let transporter = createTransport({
  service: "gmail",
  auth: {
    user: "dinotestes12@gmail.com",
    pass: "ngmudtdpjoaunnec",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.use(cors());

app.use(express.urlencoded({ extended: false }));
//? parsing data dari json ke js untuk buat req.body ada juga buat parsing pada asaat axios/fetch di front end
app.use(express.json());
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connect mongoose");
    }
  }
);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Api Voucher service</h1>");
});

app.post("/postVoucher", (req, res) => {
  const { email, userId, voucherId } = req.body;
  let voucher = "VCR" + voucherId + new Date().getTime();
  orders({
    email: email,
    noVoucher: voucher,
    userId: userId,
    voucherId: voucherId,
  })
    .save()
    .then(() => {
      let filePath = path.resolve(__dirname, "./template/email.html");
      const renderHtml = fs.readFileSync(filePath, "utf-8");
      const template = handlebars.compile(renderHtml);
      const htmltoemail = template({ Voucher: voucher });
      transporter
        .sendMail({
          from: "Admin Voucherku <dinotestes12@gmail.com>",
          to: email,
          subject: `Your holiday Voucher`,
          html: htmltoemail,
        })
        .then(() => {
          return res.status(200).send({ message: "success" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => console.log("listen in PORT " + PORT));

// app.get("/init", (req, res) => {
//   orders({
//     email: "tes@gmail.com",
//     voucher: "VCR" + new Date().getTime(),
//     userId: 10,
//   })
//     .save()
//     .then(() => {
//       orders
//         .find()
//         .then((result1) => {
//           return res.status(200).send(result1);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
// });
