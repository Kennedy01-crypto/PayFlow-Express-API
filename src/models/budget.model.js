import mongoose from "mongoose";
import Transaction from "./transaction.model.js";

/**
 * @typedef {object} Budget
 * @property {mongoose.Schema.Types.ObjectId} user - The user who owns this budget.
 * @property {string} category - The category of the budget.
 * @property {number} allocatedAmount - The allocated amount for the budget.
 * @property {number} spentAmount - The amount spent in this budget.
 * @property {number} month - The month of the budget.
 * @property {number} year - The year of the budget.
 * @property {boolean} isOverSpending - Whether the user is overspending in this budget.
 */
const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Food",
        "Rent",
        "Utilities",
        "Transport",
        "Entertainment",
        "Emergency",
        "Other",
      ],
      default: "Other",
    },
    allocatedAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2024 },
    isOverSpending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Unique budget per user/category/month/year
budgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

/**
 * Virtual property to get the remaining amount of the budget.
 * @name remainingAmount
 * @type {number}
 */
budgetSchema.virtual("remainingAmount").get(function () {
  return this.allocatedAmount - this.spentAmount;
});

/**
 * Pre-save hook to update the isOverSpending flag.
 * @name pre-save
 * @function
 * @memberof module:models/budget.model
 * @inner
 * @param {function} next - The next middleware function.
 */
budgetSchema.pre("save", function (next) {
  this.isOverSpending = this.spentAmount > this.allocatedAmount;
  next();
});

/**
 * Calculates the spent amount for the budget.
 * @returns {Promise<number>} The total spent amount.
 */
budgetSchema.methods.calculateSpentAmount = async function () {
  const total = await mongoose
    .model("Transaction")
    .aggregate([
      { $match: { budget: this._id, type: "Expense" } },
      { $group: { _id: null, sum: { $sum: "$amount" } } },
    ]);
  return total.length > 0 ? total[0].sum : 0;
};

/**
 * Updates the spent amount for the budget.
 * @returns {Promise<Budget>} The updated budget.
 */
budgetSchema.methods.updateSpentAmount = async function () {
  const total = await Transaction.aggregate([
    { $match: { budget: this._id, type: "Expense" } },
    { $group: { _id: null, sum: { $sum: "$amount" } } },
  ]);

  this.spentAmount = total.length > 0 ? total[0].sum : 0;
  this.isOverSpending = this.spentAmount > this.allocatedAmount;
  return this.save();
};

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
