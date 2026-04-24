import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const calculateBMI = (height, weight) => {
  if (!height || !weight) return 0;
  return Number((weight / ((height / 100) ** 2)).toFixed(1));
};

export const register = async (req, res) => {
  const { name, email, password, age, position, height, weight, profilePhoto, fitnessLevel } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const bmi = calculateBMI(height, weight);

  const user = await User.create({
    name,
    email,
    password,
    age,
    position,
    height,
    weight,
    bmi,
    profilePhoto,
    fitnessLevel,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      profilePhoto: user.profilePhoto,
      fitnessLevel: user.fitnessLevel,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      profilePhoto: user.profilePhoto,
      fitnessLevel: user.fitnessLevel,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
