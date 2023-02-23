import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const deleteUser = async (req, res) => {
  // TODO: implement
  const user = await User.findById(req.params.id);
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Unauthenticated");
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (payload.id === user._id)
      res.status(403).send("You can delete only your account user");
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted");
  });
};

export const fn = (req, res) => {};
