import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js";
import Stripe from "stripe";

export const createOrder = async (req, res, next) => {
  try {
    console.log(req.params.gigId);
    const gig = await Gig.findById(req.params.gigId);
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: "temporary",
    });
    await newOrder.save();
    res.status(200).send("successfull");
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  console.log(req.isSeller, req.userId);
  const orders = await Order.find({
    ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
    isCompleted: true,
  });
  res.status(200).json(orders);
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).send("Order not found");
    }
  } catch (error) {
    next(error);
  }
};

export const intent = async (req, res, next) => {
  try {
    console.log("llego el pago");
    const stripe = new Stripe(
      "sk_test_51KkJ4qCn7TBsELSeg5BWk4UGYlEdX0JAoheYU4b8ORP2WNg2VVzIrvv2wvTX0hWjyg6B2uoMjLRjzWGpiEQRnigF0025EPa0Cz"
    );
    const gig = await Gig.findById(req.params.id);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: "64041851732bb7f4ea72aa00",
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });
    await newOrder.save();
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};
