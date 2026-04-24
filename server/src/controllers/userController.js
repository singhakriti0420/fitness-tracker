import User from "../models/User.js";

const calculateBMI = (height, weight) => {
  if (!height || !weight) return 0;
  return Number((weight / ((height / 100) ** 2)).toFixed(1));
};

export const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, age, position, height, weight, profilePhoto, fitnessLevel } = req.body;

  user.name = name || user.name;
  user.age = age ?? user.age;
  user.position = position || user.position;
  user.height = height ?? user.height;
  user.weight = weight ?? user.weight;
  user.profilePhoto = profilePhoto || user.profilePhoto;
  user.fitnessLevel = fitnessLevel || user.fitnessLevel;
  user.bmi = calculateBMI(user.height, user.weight);

  const updatedUser = await user.save();
  res.json(updatedUser);
};
