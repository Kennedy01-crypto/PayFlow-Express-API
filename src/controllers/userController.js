import AppError from "../config/AppError.js";
import User from "../models/user.model.js";

/**
 * @desc Create a new User
 * @route POST/api/tasks
 * @access Public
 */
export const CreateUSer = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
      message: "User Created Successfully",
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @desc Get all Users
 * @route GET/api/tasks
 * @access Public
 */
export const GetUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (err) {
    next(err);
  }
};
