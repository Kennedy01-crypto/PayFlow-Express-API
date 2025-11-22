import mongoose from "mongoose";

/**
 * @typedef {object} Card
 * @property {mongoose.Schema.Types.ObjectId} user - The user who owns this card.
 * @property {string} cardholderName - The name of the cardholder.
 * @property {boolean} isLocked - Whether the card is locked.
 * @property {boolean} isPrimary - Whether the card is the primary card.
 * @property {string} cardNumber - The card number.
 * @property {string} last4Digits - The last 4 digits of the card number.
 * @property {number} expiryMonth - The expiry month of the card.
 * @property {number} expiryYear - The expiry year of the card.
 * @property {string} cardType - The type of the card.
 * @property {string} cvv - The CVV of the card.
 * @property {string} bankName - The name of the bank.
 */
const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardholderName: {
      type: String,
      required: true,
      trim: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    cardNumber: {
      type: String,
      required: true,
      minlength: 16,
      select: false, //hide from queries
      maxlength: 16,
    },
    last4Digits: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 4,
    },
    expiryMonth: {
      type: Number,
      min: 1,
      max: 12,
      required: [true, "Expiry month is required"],
    },
    expiryYear: {
      type: Number,
      min: new Date().getFullYear(),
      required: true,
    },
    cardType: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },
    cvv: {
      type: String,
      select: false, //hide from queries
    },
    bankName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

//Indexes

/**
 * @Rule Only One card can be primary
 */
cardSchema.index({ user: 1, isPrimary: 1 }, { unique: true });
cardSchema.index({ user: 1 });

/**
 * Pre-save hook to ensure that only one card can be primary.
 * @name pre-save
 * @function
 * @memberof module:models/card.model
 * @inner
 * @param {function} next - The next middleware function.
 */
cardSchema.pre("save", async function (next) {
  if (this.isPrimary) {
    await mongoose
      .model("Card")
      .updateMany(
        { user: this.user, _id: { $ne: this._id } },
        { $set: { isPrimary: false } }
      );
  }
  next();
});

/**
 * Virtual property to get the masked card number.
 * @name maskedNumber
 * @type {string}
 */
cardSchema.virtual("maskedNumber").get(function () {
  return `**** **** **** ${this.last4Digits}`;
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
