import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({
        status: false,
        message: "Please provide all the required field",
      });
    }

    const emailExist = await UserModel.findOne({ email: email });

    if (emailExist) {
      return res
        .status(422)
        .json({ status: false, message: "User already exists. Please login" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPass,
    });

    const response = await newUser.save();

    if (response) {
      return res
        .status(201)
        .json({ status: true, message: "Registration is successfull" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", err: error });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        status: false,
        message: "Please provide all the required field",
      });
    }

    const emailExist = await UserModel.findOne({ email: email });

    if (!emailExist) {
      return res.status(422).json({
        status: false,
        message: "User is not registered. Please login first",
      });
    }

    const comparePass = bcrypt.compareSync(password, emailExist.password);

    if (email === emailExist.email && comparePass) {
      const token = jwt.sign(emailExist.email, "ILOVEJYOTI");

      res.cookie("Token", token, { maxAge: 900000, httpOnly: true });

      res
        .status(201)
        .json({ status: true, message: "Login successfull", data: emailExist });
    } else {
      return res.status(401).json({ status: false, message: "Invalid auth" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export { registerController, loginController };
