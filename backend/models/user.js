const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
    },
    googleId: {
      type:String,
      default:""
    },
    profilePic: {
        type: String,
        default: ""
    },
    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const User = model("User", userSchema)
module.exports = User;