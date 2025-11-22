import mongoose from "mongoose";
import User from "./baseUser.model.js";

const securityOptions = new mongoose.Schema(
  {
    twoFactorEnabled: { type: Boolean, default: false },
    biometricEnabled: { type: Boolean, default: false },
    loginAlertsEnabled: { type: Boolean, default: false },
    sessionManagementEnabled: { type: Boolean, default: false },
  },
  { _id: false }
);

const notificationPreferences = new mongoose.Schema({
  transaction_Nitifocations: { type: Boolean, default: true },
  bill_Notifications: { type: Boolean, default: true },
  security_Notifications: { type: Boolean, default: true },
  marketing_Notifications: { type: Boolean, default: true },
}, {_id: false});

const AppPreferences = new mongoose.Schema(
  {
    darkModeEnabled: { type: Boolean, default: false },
    language: { type: String, enum: ["en", "fr", "es"], default: "en" },
    currency: { type: String, default: "USD" },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }],
  security: securityOptions,
  notificationPreferences: notificationPreferences,
  appPreferences: AppPreferences,
});

UserSchema.index({ transactions: 1 });
UserSchema.index({ budgets: 1 });

const Customer = User.discriminator("user", UserSchema);

export default Customer;
