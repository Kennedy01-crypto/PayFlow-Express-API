import mongoose from "mongoose";
import User from "./baseUser.model.js";


const AdminSchema = new mongoose.Schema({
  permissions: [{ type: String }], // e.g. ["manage_users", "view_reports"]
  auditLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "AuditLog" }],
});

const Admin = User.discriminator("admin", AdminSchema);

export default Admin;