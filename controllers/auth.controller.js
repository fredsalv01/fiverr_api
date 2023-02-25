import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/createError.js";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(201).send("User created!");
  } catch (error) {
    next(createError(400, error.message));
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, email, username } = req.body;

    if (!password || (!email && !username)) {
      return next(err);
    }
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const validatePassword = bcrypt.compareSync(password, user.password);
    if (!validatePassword) {
      return next(createError(400, "Invalid password"));
    }
    // TODO: Generate token
    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const { password: _, ...userWithoutPassword } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ ...userWithoutPassword, token });
  } catch (error) {
    next(createError(400, error.message));
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    }).status(200).send("Logged out!");
  } catch (error) {
    next(createError(500, "Something went wrong!"));
  }
};

export const currentUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = User.findById(userId);
    if (!user) {
      return next(createError(401, "Unauthorized"));
    }
    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).send({ ...userWithoutPassword });
  } catch (error) {
    console.error(error);
    next(createError(500, "Something went wrong!"));
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return next(createError(401, "Unauthorized"));
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(createError(401, "Unauthorized"));
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(createError(401, "Unauthorized"));
      }
      const newToken = jwt.sign(
        { id: user._id, isSeller: user.isSeller },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res
        .cookie("accessToken", newToken, {
          httpOnly: true,
        })
        .status(200)
        .send({ token: newToken });
    });
  } catch (error) {
    next(createError(500, "Something went wrong!"));
  }
};
