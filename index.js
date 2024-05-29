import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import Stripe from "stripe";
configDotenv()

const stripe = new Stripe(
  process.env.STRIPE_SK
);

const app = express();

const PORT = 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/shop", (req, res) => {
  res.send("Shop Route");
});

app.post("/create-checkout-session", async (req, res) => {
  const { priceId } = req.body; //products
  console.log(priceId, "===>> priceId");
//   return;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    console.log(session, "-====>>> session");

    res.status(200).send({
      sessionId: session.id,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
