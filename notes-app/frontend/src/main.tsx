import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./contexts/user.provider";
import { NoteProvider } from "./contexts/note.provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <NoteProvider>
        <App />
      </NoteProvider>
    </UserProvider>
  </StrictMode>,
);
