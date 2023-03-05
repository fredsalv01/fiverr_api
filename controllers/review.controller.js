import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import { createError } from "../utils/createError.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller) return next(createError(403, "Seller can't review"));
  const newReview = new Review({
    gigId: req.body.gigId,
    userId: req.body.userId,
    star: req.body.star,
    desc: req.body.desc,
  });
  try {
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.body.userId,
    });
    if (review) return next(createError(403, "You already reviewed this gig"));

    const savedReview = await newReview.save();
    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(201).json(savedReview);
  } catch (error) {
    next(error);
  }
};
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.body.gigId });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
export const deleteReview = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
