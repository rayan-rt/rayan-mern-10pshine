type INote = {
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
  user: string;
};

type ICreateNoteData = {
  title: string;
  content: string;
};

type IUpdatedNote = {
  title?: string;
  content?: string;
  isPinned?: boolean;
};

type INoteResponse = {
  success: boolean;
  message: string;
  data?: INote | INote[];
};

type INoteContext = {
  notes: INote[] | null;
  note: INote | null;
  loading: boolean;
  error: string | null;
  setNotes: React.Dispatch<React.SetStateAction<INote[] | null>>;
  setNote: React.Dispatch<React.SetStateAction<INote | null>>;
  readNotes: (search?: string) => Promise<INoteResponse>;
  readNote: (noteId: string) => Promise<INoteResponse>;
  createNote: (data: ICreateNoteData) => Promise<INoteResponse>;
  updateNote: (noteId: string, data: IUpdatedNote) => Promise<INoteResponse>;
  deleteNote: (noteId: string) => Promise<INoteResponse>;
  togglePin: (noteId: string, isPinned: boolean) => Promise<INoteResponse>;
};

export type {
  INote,
  ICreateNoteData,
  IUpdatedNote,
  INoteResponse,
  INoteContext,
};
