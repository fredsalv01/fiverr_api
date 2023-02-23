import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(201).send("User created!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
};

export const login = async (req, res) => {
  try {
    const { password, email, username } = req.body;
    if (!password || (!email && !username)) {
      return res
        .status(400)
        .send("Please provide email or username and password");
    }
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      return res.status(400).send("Invalid email or username");
    }
    const validatePassword = bcrypt.compareSync(password, user.password);
    if (!validatePassword) {
      return res.status(400).send("Invalid password");
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
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken").send("Logged out!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
};

export const currentUser = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).send({ ...userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).send("Unauthorized");
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
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
};
