"use client";

import NoteItem from "@/components/NoteItem";
import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  description: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes, loaded]);

  const addNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please enter a title and description.");
      return;
    }

    const noteExists = notes.some(
      (note) =>
        note.title.toLowerCase() === title.trim().toLowerCase()
    );

    if (noteExists) {
      alert("A note with this title already exists.");
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
    };

    setNotes((previousNotes) => [
      ...previousNotes,
      newNote,
    ]);

    setTitle("");
    setDescription("");
  };

  const deleteNote = (id: number) => {
    setNotes((previousNotes) =>
      previousNotes.filter((note) => note.id !== id)
    );
  };

  const editNote = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditDescription(note.description);
  };

  const updateNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Please enter a title and description.");
      return;
    }

    const duplicate = notes.some(
      (note) =>
        note.id !== editingId &&
        note.title.toLowerCase() ===
          editTitle.trim().toLowerCase()
    );

    if (duplicate) {
      alert("Another note already has this title.");
      return;
    }

    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note.id === editingId
          ? {
              ...note,
              title: editTitle.trim(),
              description: editDescription.trim(),
            }
          : note
      )
    );

    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}
        <header className="header">
          <div>
            <p className="small-title">
              MY PERSONAL
            </p>

            <h1>Notes</h1>

            <p className="subtitle">
              Keep your thoughts organized 
            </p>
          </div>

          <div className="note-count">
            <span>{notes.length}</span>
            <small>Notes</small>
          </div>
        </header>

        {/* ADD NOTE */}
        <section className="card">
          <h2>Create a Note</h2>

          <p className="section-description">
            Write down something you want to remember.
          </p>

          <form onSubmit={addNote}>

            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <textarea
              placeholder="Write your note here..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
            />

            <button
              type="submit"
              className="add-button"
            >
              + Add Note
            </button>

          </form>
        </section>

        {/* NOTES */}
        <section className="notes-section">

          <div className="section-header">
            <h2>My Notes</h2>

            <p>
              Your saved thoughts and reminders
            </p>
          </div>

          {notes.length === 0 ? (
            <div className="empty">

              <div className="empty-icon">
                ♡
              </div>

              <h3>No notes yet</h3>

              <p>
                Create your first note above.
              </p>

            </div>
          ) : (
            <div className="notes-grid">

              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onDelete={deleteNote}
                  onEdit={editNote}
                />
              ))}

            </div>
          )}

        </section>

        {/* EDIT MODAL */}
        {editingId !== null && (
          <div className="modal-overlay">

            <div className="edit-modal">

              <button
                className="close-button"
                onClick={cancelEdit}
              >
                ×
              </button>

              <h2>Edit Note</h2>

              <p>
                Make changes to your note.
              </p>

              <form onSubmit={updateNote}>

                <input
                  type="text"
                  placeholder="Note title"
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                />

                <textarea
                  placeholder="Note description"
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(
                      e.target.value
                    )
                  }
                  rows={6}
                />

                <div className="edit-buttons">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-button"
                  >
                    Save Changes
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}