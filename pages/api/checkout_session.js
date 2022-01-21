// IMPORT STRIPE SERVER SIDE AND PASS STRIPE SECRET KEY

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      //1. GET THE BOOK ITEM FROM THE AXIOS POST REQUEST BODY
      const { item } = req.body;

      //2. MODIFY THE STRUCTURE OF THE ITEM OBJECT TO MATCH STRIPES CRITERIA
      const modifiedItems = item.map((item) => ({
        quantity: 1,
        price_data: {
          currency: "GBP",
          unit_amount: item.price * 100,
          product_data: {
            name: item.title,
            images: [item.img],
          },
        },
      }));

      // 3. ONCE COMPLETE, CREATE THE ACTUAL CHECKOUT SESSION AND PASS THE MODIFIED OBJECT INTO LINE_ITEMS
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: modifiedItems,
        mode: "payment",
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/cancelled`,
      });

      // 4. SEND THE SESSION ID BACK IN A RESPONSE TO REDIRECT THE USER TO STRIPE
      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    // NOTE NEEDED
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
