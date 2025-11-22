import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const options = {
  discriminatorKey: "role",
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const profileSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const baseUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Hide password from queries
    },
    emailVerified: { type: Boolean, default: false },
    profile: profileSchema,
  },
  options
);

// Password hashing
baseUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
baseUserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual fullName
baseUserSchema.virtual("fullName").get(function () {
  return `${this.profile?.firstName || ""} ${
    this.profile?.lastName || ""
  }`.trim();
});

const User = mongoose.model("User", baseUserSchema);
