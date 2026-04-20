import type { Response, Request, RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ResponseHandler } from "../utils/res_handler.js";
import { ErrorHandler } from "../utils/err_handler.js";
import { Note } from "../models/note.model.js";
import { z } from "zod";
import mongoose from "mongoose";
// --

// ZOD schemas for input validation
const noteCreateSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string(),
});

const noteUpdateSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string(),
  isPinned: z.boolean().optional(),
});

const notePinToggleSchema = z.object({
  isPinned: z.boolean(),
});

// controller functions
const createNote: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = noteCreateSchema.parse(req.body);

    const note = await Note.create({
      ...validatedData,
      user: (req as any).user?._id,
    });

    res
      .status(201)
      .json(new ResponseHandler(201, note, "Note created successfully"));
  },
);

const getAllNotes: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const { search } = req.query;

    let query: any = { user: userId };

    // Support for searching if the search query is provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });

    res
      .status(200)
      .json(new ResponseHandler(200, notes, "Notes fetched successfully"));
  },
);

const getNoteById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    let { noteId } = req.params;

    const note = await Note.findOne({
      _id: new mongoose.Types.ObjectId(noteId),
      user: (req as any).user?._id,
    });

    if (!note) {
      throw new ErrorHandler(404, "Note not found or unauthorized");
    }

    res
      .status(200)
      .json(new ResponseHandler(200, note, "Note fetched successfully"));
  },
);

const updateNote: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = noteUpdateSchema.parse(req.body);
    let { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(noteId),
        user: (req as any).user?._id,
      },
      { $set: validatedData },
      { new: true, runValidators: true },
    );

    if (!note) {
      throw new ErrorHandler(404, "Note not found or unauthorized");
    }

    res
      .status(200)
      .json(new ResponseHandler(200, note, "Note updated successfully"));
  },
);

const deleteNote: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    let { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(noteId),
      user: (req as any).user?._id,
    });

    if (!note) {
      throw new ErrorHandler(404, "Note not found or unauthorized");
    }

    res
      .status(200)
      .json(new ResponseHandler(200, null, "Note deleted successfully"));
  },
);

const togglePin: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { isPinned } = notePinToggleSchema.parse(req.body);
    let { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(noteId),
        user: (req as any).user?._id,
      },
      { $set: { isPinned } },
      { new: true },
    );

    if (!note) {
      throw new ErrorHandler(404, "Note not found or unauthorized");
    }

    res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          note,
          `Note ${isPinned ? "pinned" : "unpinned"} successfuly`,
        ),
      );
  },
);

export {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
};
