const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    nome: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

User = mongoose.model("User", userSchema);

module.exports = User;