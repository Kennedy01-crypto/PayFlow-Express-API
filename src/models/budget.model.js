import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    allocatedAmount: {
      type: Number,
      required: true,
    },
    spentAmount: {
      type: Number,
      default: 0,
    },
    month: {
      type: Number, // 1-12
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2024,
    },
    isOverSpending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure a user has only one budget per category per month/year
budgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

//virtuals
budgetSchema.virtual("remainingAmount").get(function () {
  return this.allocatedAmaount - this.spentAmount;
});

//pre-save: automatically flag overspending if spentAmount > allocatedAmount
budgetSchema.pre("save", function (next) {
  if (this.spentAmount > this.allocatedAmount) {
    this.isOverSpending = true;
  } else {
    this.isOverSpending = false;
  }
});

budgetSchema.methods.addExpense = function (amount) {
  this.spentAmount += amount;
  this.isOverSpending = this.spentAmount > this.allocatedAmount;
  return this.save();
};

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
