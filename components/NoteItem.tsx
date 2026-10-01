"use client";

type Note = {
  id: number;
  title: string;
  description: string;
};

type NoteItemProps = {
  note: Note;
  onDelete: (id: number) => void;
  onEdit: (note: Note) => void;
};

export default function NoteItem({
  note,
  onDelete,
  onEdit,
}: NoteItemProps) {
  return (
    <div className="note-card">
      <div className="note-header">
        <span className="heart">♡</span>

        <div className="note-buttons">
          <button
            className="edit-button"
            onClick={() => onEdit(note)}
          >
            Edit
          </button>

          <button
            className="delete-button"
            onClick={() => onDelete(note.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <h3>{note.title}</h3>

      <p>{note.description}</p>

      <div className="note-footer">
        <span>Personal Note</span>
      </div>
    </div>
  );
}