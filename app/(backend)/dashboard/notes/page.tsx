import { getNotes } from "./_actions/note-actions";
import { NotesClient } from "../../_components/notes/notes-client";

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="p-4 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground">
          Manage your important notes and ideas.
        </p>
      </div>

      <NotesClient initialNotes={notes} />
    </div>
  );
}
