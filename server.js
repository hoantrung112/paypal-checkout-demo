require("dotenv").config();

const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

const paypal = require("@paypal/checkout-server-sdk");
const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID_DEFAULT,
    process.env.PAYPAL_CLIENT_SECRET_DEFAULT
    // process.env.PAYPAL_CLIENT_ID,
    // process.env.PAYPAL_CLIENT_SECRET
  )
);

const itemList = new Map([
  [0, { price: 200000, name: "Mercedes Maybach S650" }],
  [1, { price: 240000, name: "Ferrari 458" }],
  [2, { price: 250000, name: "Lamborghini Urus" }],
  [3, { price: 480000, name: "Rolls-Royce Ghost" }],
  [4, { price: 190000, name: "Porsche Panamera" }],
  [5, { price: 19000, name: "Vinfast Fadil" }],
  [6, { price: 3900000, name: "Bugatti Chiron Super Sport 300+" }],
]);

app.get("/", (req, res) => {
  res.render("index", {
    paypalClientId: process.env.PAYPAL_CLIENT_ID_DEFAULT,
    // paypalClientId: process.env.PAYPAL_CLIENT_ID,
  });
});

app.post("/create-order", async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  if (req.body.items == null && req.body.items.length == 0) {
    return res.status(400).json({
      message: "No item added to cart yet!",
    })
  }
  const total = req.body.items.reduce((sum, item) => {
    return sum + itemList.get(item.id).price * item.quantity
  }, 0);
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.body.items.map(item => {
          const storeItem = itemList.get(item.id)
          return {
            name: storeItem.name,
            unit_amount: {
              currency_code: "USD",
              value: storeItem.price,
            },
            quantity: item.quantity,
          }
        }),
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    console.log(order);
    console.log(order.result.links[0]);
    res.json({ id: order.result.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.listen(3000);
