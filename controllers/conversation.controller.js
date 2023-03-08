import Conversation from "../models/conversation.model.js";
import { createError } from "../utils/createError.js";

export const createConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    id: req.isSeller
      ? req.body.buyerId + req.body.to
      : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    next(error);
  }
};
export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(
      { id: req.params.id },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedConversation);
  } catch (error) {
    next(error);
  }
};
export const getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      id: req.params.id,
    });
    if (!conversation) return next(createError(404, "Conversation not found"));
    res.status(200).send(conversation);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [
        { sellerId: req.userId },
        { buyerId: req.userId },
      ],
    });
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
