"use client";

import { useState } from "react";
import {
  createNote,
  deleteNote,
  updateNote,
} from "../../_actions/note-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Trash2, Plus, Pencil, X, Eye } from "lucide-react";
import { toast } from "sonner";

type Note = {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export function NotesClient({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  const [formState, setFormState] = useState({
    title: "",
    subtitle: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormState({ title: "", subtitle: "", content: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (note: Note) => {
    setFormState({
      title: note.title,
      subtitle: note.subtitle,
      content: note.content,
    });
    setEditingId(note.id);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!formState.title.trim() || !formState.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateNote(editingId, formState);
        setNotes((prev) =>
          prev.map((n) =>
            n.id === editingId
              ? {
                  ...n,
                  title: formState.title,
                  subtitle: formState.subtitle,
                  content: formState.content,
                  updatedAt: new Date(),
                }
              : n,
          ),
        );
        toast.success("Note updated");
      } else {
        const { id } = await createNote(formState);
        const newNote: Note = {
          id,
          title: formState.title,
          subtitle: formState.subtitle,
          content: formState.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setNotes((prev) => [newNote, ...prev]);
        toast.success("Note created");
      }
      resetForm();
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note deleted");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Notes</h2>
        {!isAdding && !editingId && (
          <Button
            onClick={() => setIsAdding(true)}
            className="gap-2 focus-visible:ring-0"
          >
            <Plus className="h-4 w-4" /> Add Note
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card className="border-primary bg-primary/5">
          <CardHeader className="flex flex-row justify-between items-center pb-4">
            <CardTitle>{editingId ? "Edit Note" : "Create New Note"}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={resetForm}
                disabled={loading}
                className="focus-visible:ring-0"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="focus-visible:ring-0"
              >
                {loading ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Note Title"
                  value={formState.title}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, title: e.target.value }))
                  }
                  className="focus-visible:ring-1 bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input
                  placeholder="A quick summary or subtitle..."
                  value={formState.subtitle}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, subtitle: e.target.value }))
                  }
                  className="focus-visible:ring-1 bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <RichTextEditor
                value={formState.content}
                onChange={(content) => setFormState((p) => ({ ...p, content }))}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length === 0 && !isAdding && !editingId && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No notes found. Create your first one!
          </div>
        )}
        {notes.map((note) => (
          <Card
            key={note.id}
            className="flex flex-col relative group overflow-hidden aspect-square"
          >
            <CardHeader className="pb-3 bg-secondary/30">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="line-clamp-2 leading-tight">
                  {note.title}
                </CardTitle>
                <div className="flex gap-1 absolute top-4 right-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 focus-visible:ring-0"
                    onClick={() => setViewingNote(note)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 focus-visible:ring-0"
                    onClick={() => startEdit(note)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 focus-visible:ring-0"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-1">
                {note.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-4 overflow-hidden relative">
              <div
                className="text-sm line-clamp-5 tinymce-content"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {viewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl relative shadow-lg border-primary/20">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 rounded-full"
              onClick={() => setViewingNote(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader className="border-b bg-secondary/20 pb-4 pr-12 rounded-t-xl">
              <CardTitle className="text-2xl leading-tight">
                {viewingNote.title}
              </CardTitle>
              <CardDescription>{viewingNote.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[70vh] pt-6 text-base">
              <div
                className="tinymce-content"
                dangerouslySetInnerHTML={{ __html: viewingNote.content }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
