import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    billname: {
      type: String,
      required: [true, "Bill name is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    biller: {
      type: String,
      required: [true, "Biller is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    paymentDate: {
      type: Date,
      default: null, // optional until payment is made
      validate: {
        validator: function (value) {
          if (this.paymentStatus === "Paid" && !value) {
            return false; /// must have a date if paid
          }
          return true;
        },
        message: "Payment date is required when status is Paid",
      },
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid", "Overdue"],
      default: "Unpaid",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrence: {
      type: String,
      enum: [null, "daily", "weekly", "monthly", "yearly"],
      default: null,
    },
  },
  { timestamps: true }
);

//Pre-save hook
billSchema.pre("save", function (next) {
  //auto-set paymentDate when marked as Paid
  if (this.paymentStatus === "Paid" && !this.paymentDate) {
    this.paymentDate = new Date();
  }
  //auto-update to overdue if unpaid and past dueDate
  if (this.paymentStatus === "Unpaid" && this.dueDate < new Date()) {
    this.paymentStatus = "Overdue";
  }

  next();
});

const Bill = mongoose.model("Bill", billSchema);

export default Bill;
