import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
} from "../controllers/note.controller.js";
// --

const router: Router = Router();

router.use(isAuthenticated);

router.route("/").post(createNote).get(getAllNotes);
router.route("/:noteId").get(getNoteById).put(updateNote).delete(deleteNote);
router.route("/pin/:noteId").put(togglePin);

export { router };
