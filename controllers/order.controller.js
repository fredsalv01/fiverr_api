import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js";
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
