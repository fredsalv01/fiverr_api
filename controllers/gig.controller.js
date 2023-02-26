import Gig from "../models/gig.model";
import { createError } from "../utils/createError";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig"));
  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });
  try {
    const gig = await newGig.save();
    res.status(201).json(gig);
  } catch (error) {
    next(error);
  }
};

export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId !== req.userId)
      return next(createError(403, "You can only delete your own gigs"));
    await gig.remove();
    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

export const getGigs = async (req, res) => {
  const q = req.query;
  const filters = {
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gte: q.min }),
        ...(q.max && { $lte: q.max }),
      },
    }),
    ...(q.search && {
      title: {
        $regex: q.search,
        $options: "i",
      },
    }),
  };
  try {
    const gigs = await Gig.find(filters);
    res.status(200).json(gigs);
  } catch (error) {
    next(error);
  }
};
