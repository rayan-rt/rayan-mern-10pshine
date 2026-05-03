import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import type { ICreateNoteData } from "../../types/note.types";
import { useNoteContext } from "../../contexts/note.context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CreateNoteForm() {
  const { createNote } = useNoteContext();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting, errors },
  } = useForm<ICreateNoteData>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: ICreateNoteData) => {
    setErrorMsg(null);
    const result = await createNote(data);
    if (result.success) {
      navigate("/notes");
    } else {
      setErrorMsg(result.message || "Failed to create note");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Note Title
        </label>
        <input
          id="title"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
            maxLength: {
              value: 100,
              message: "Title cannot exceed 100 characters",
            },
          })}
          placeholder="Enter the title of your note"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white shadow-sm outline-none transition-all duration-200"
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Rich Text */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content
        </label>
        <Controller
          name="content"
          control={control}
          rules={{
            required: "Content is required",
            validate: (value) => {
              const stripped = value.replace(/<[^>]*>?/gm, "").trim();
              return (
                stripped.length >= 3 || "Content must be at least 3 characters"
              );
            },
          }}
          render={({ field }) => (
            <div className="rounded-lg shadow-sm border border-gray-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                style={{ height: "350px", border: "none" }}
                className="flex flex-col"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "code-block"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          )}
        />
        {/* We need to offset the height slightly via margin to prevent overlapping error text due to react-quill inner absolute positioning/height behaviors */}
        <div className="mt-12 md:mt-14">
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
          className="mr-3 flex justify-center items-center py-2.5 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex justify-center items-center py-2.5 px-8 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            "Save Note"
          )}
        </button>
      </div>
    </form>
  );
}
