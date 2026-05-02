import { CreateNoteForm } from "../components";

export default function CreateNotePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 relative overflow-hidden">
      <div className="mb-8 border-b pb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Create your <span className="text-blue-600">Shine</span> Note
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl">
          Capture your ideas, thoughts, and important information securely using
          our rich text editor.
        </p>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
        <CreateNoteForm />
      </div>
    </div>
  );
}
