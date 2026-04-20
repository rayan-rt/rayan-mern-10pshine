import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
} from "./note.controller.js";
import { Note } from "../models/note.model.js";
// --

describe("Note Controller", () => {
  let req: any, res: any, next: any;
  const mockUserId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createNote", () => {
    it("should create a note with valid data", async () => {
      req = {
        user: { _id: mockUserId },
        body: { title: "Test Note", content: "Test Content" },
      };
      sinon.stub(Note, "create").resolves({ ...req.body, user: mockUserId });

      await createNote(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it("should throw validation error for short title", async () => {
      req = {
        user: { _id: mockUserId },
        body: { title: "Ti", content: "Valid content" },
      };
      try {
        await createNote(req, res, next);
      } catch (error: any) {
        // Zod validation error
        expect(error.name).to.equal("ZodError");
      }
    });
  });

  describe("getAllNotes", () => {
    it("should fetch all notes for the user", async () => {
      req = { user: { _id: mockUserId }, query: {} };
      sinon.stub(Note, "find").returns({
        sort: sinon.stub().resolves([{ title: "Note 1" }]),
      } as any);

      await getAllNotes(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it("should support search query", async () => {
      req = { user: { _id: mockUserId }, query: { search: "query" } };
      const findStub = sinon.stub(Note, "find").returns({
        sort: sinon.stub().resolves([]),
      } as any);

      await getAllNotes(req, res, next);

      expect(findStub.calledOnce).to.be.true;
      const query = findStub.firstCall.args[0];
      expect(query).to.have.property("$or");
    });
  });

  describe("getNoteById", () => {
    it("should return note if found and owned by user", async () => {
      const noteId = new mongoose.Types.ObjectId();
      req = {
        user: { _id: mockUserId },
        params: { noteId: noteId.toString() },
      };
      sinon.stub(Note, "findOne").resolves({ title: "Found" });

      await getNoteById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it("should return 404 if note not found or not owned by user", async () => {
      req = {
        user: { _id: mockUserId },
        params: { noteId: new mongoose.Types.ObjectId().toString() },
      };
      sinon.stub(Note, "findOne").resolves(null);

      try {
        await getNoteById(req, res, next);
      } catch (error: any) {
        expect(error.statusCode).to.equal(404);
      }
    });
  });

  describe("updateNote", () => {
    it("should update note with valid data", async () => {
      const noteId = new mongoose.Types.ObjectId();
      req = {
        user: { _id: mockUserId },
        params: { noteId: noteId.toString() },
        body: { title: "Updated Title", content: "Updated Content" },
      };
      sinon.stub(Note, "findOneAndUpdate").resolves({ title: "Updated" });

      await updateNote(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });
  });

  describe("deleteNote", () => {
    it("should delete note successfully", async () => {
      const noteId = new mongoose.Types.ObjectId();
      req = {
        user: { _id: mockUserId },
        params: { noteId: noteId.toString() },
      };
      sinon.stub(Note, "findOneAndDelete").resolves({ _id: noteId });

      await deleteNote(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });
  });

  describe("togglePin", () => {
    it("should pin a note", async () => {
      const noteId = new mongoose.Types.ObjectId();
      req = {
        user: { _id: mockUserId },
        params: { noteId: noteId.toString() },
        body: { isPinned: true },
      };
      sinon.stub(Note, "findOneAndUpdate").resolves({ isPinned: true });

      await togglePin(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });
  });
});
