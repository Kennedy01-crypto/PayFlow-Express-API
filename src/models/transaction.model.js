import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: {
      type: Number,
      min: [0, "Amount cannot be negative"],
      required: true,
    },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true, trim: true },
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
    type: { type: String, enum: ["Income", "Expense"], required: true },
    bill: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },
    card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
    budget: { type: mongoose.Schema.Types.ObjectId, ref: "Budget" },
  },
  { timestamps: true }
);

// ✅ Post-save hook: update budget only once
transactionSchema.post("save", async function (doc, next) {
  if (doc.type === "Expense" && doc.budget) {
    const Budget = mongoose.model("Budget");
    await Budget.findByIdAndUpdate(doc.budget, {
      $inc: { spentAmount: doc.amount },
    });
  }
  next();
});

// Indexes
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ category: 1 });

// Virtuals
transactionSchema.virtual("signedAmount").get(function () {
  return this.type === "Expense" ? -this.amount : this.amount;
});

// Statics
transactionSchema.statics.getTotalByCategory = async function (
  userId,
  category
) {
  const result = await this.aggregate([
    { $match: { user: userId, category } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return result.length > 0 ? result[0].total : 0;
};

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
