import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const deleteUser = async (req, res) => {
  // TODO: implement
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can only delete your user account"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.send("User deleted");
};

export const fn = (req, res) => {};
