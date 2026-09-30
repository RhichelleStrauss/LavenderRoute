// One-off script to insert an admin account directly into MongoDB.
// Usage: node scripts/seedAdmin.js
// Edit the ADMIN constant below before running, then delete this file (or leave it — it's idempotent).

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../Authentication/models/User");

const ADMIN = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@lavenderroute.com",
  password: "ChangeMe123!",
  // Pattern picker tokens, in the order you'd click them (6-12 of):
  // zoroark, squirtle, ogerpon, rayquaza, sableye, zekrom
  patternTokens: ["zoroark", "squirtle", "ogerpon", "rayquaza", "sableye", "zekrom"],
  dob: "1990-01-01",
  adminPasskey: "ChangeMePasskey123!",
};

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    console.log(`A user with email ${ADMIN.email} already exists (id: ${existing._id}). Aborting.`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN.password, 12);
  const hashedAuthPattern = await bcrypt.hash(ADMIN.patternTokens.join("-"), 12);
  const hashedAdminPasskey = await bcrypt.hash(ADMIN.adminPasskey, 12);

  const user = await User.create({
    firstName: ADMIN.firstName,
    lastName: ADMIN.lastName,
    email: ADMIN.email,
    dob: ADMIN.dob,
    roles: ["admin"],
    password: hashedPassword,
    authPattern: hashedAuthPattern,
    adminPasskey: hashedAdminPasskey,
  });

  console.log("Admin account created:", user._id.toString());
  console.log("Log in with:");
  console.log("  email:      ", ADMIN.email);
  console.log("  password:   ", ADMIN.password);
  console.log("  pattern:    ", ADMIN.patternTokens.join(" -> "));
  console.log("  admin key:  ", ADMIN.adminPasskey);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
});
