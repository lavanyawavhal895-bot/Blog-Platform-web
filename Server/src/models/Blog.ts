import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    backgroundColor: {
      type: String,
      default: "#0B0B0B",
    },

    textColor: {
      type: String,
      default: "#FFFFFF",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Blog",
  blogSchema
);