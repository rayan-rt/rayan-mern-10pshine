import { Document, Types } from "mongoose";

interface INote extends Document {
  title: string;
  content: string; // Stores HTML/Markdown/JSON from the Rich Text Editor
  isPinned: boolean;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export { type INote };
