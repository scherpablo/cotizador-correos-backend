const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

dotenv.config();
const port = process.env.PORT || 5000;
const frontend_Url = process.env.FRONT_URL || "http://localhost:5173";

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("servidor funcionando");
});

app.post("/create_preference", (req, res) => {
    const { title, quantity, currency_id, unit_price } = req.body;

    let preference = {
        items: [
            {
                title: title,
                quantity: Number(quantity),
                currency_id: currency_id,
                unit_price: Number(unit_price),
            },
        ],
        back_urls: {
            success: `${frontend_Url}`,
            failure: `${frontend_Url}`,
            pending: "",
        },
        auto_return: "approved",
    };

    mercadopago.preferences
        .create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.listen(port, () => {
    console.log(`The server is now running on Port ${port}`);
});
