import { Schema, model } from "mongoose";
import type { INote } from "../types/note.types.js";
// --

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
      // Rich text often comes as HTML strings, Markdown, or JSON objects
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Note = model<INote>("Note", noteSchema);

export { Note };
