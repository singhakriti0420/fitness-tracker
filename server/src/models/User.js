import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const positionOptions = ["Striker", "Midfielder", "Defender"];

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, default: 18 },
    position: { type: String, enum: positionOptions, default: "Midfielder" },
    height: { type: Number, default: 175 },
    weight: { type: Number, default: 70 },
    bmi: { type: Number, default: 0 },
    profilePhoto: { type: String, default: "" },
    fitnessLevel: { type: String, default: "Intermediate" },
    achievements: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;
