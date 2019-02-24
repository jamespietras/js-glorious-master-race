import Note from './Note';
import NoteIndexer from './NoteIndexer';
import StorageController from './StorageController';

import './_note-pocket.scss';

const STORAGE_KEY_NOTES = 'NOTES';

class NotePocket {
  constructor(rootNode) {
    this.rootNode = rootNode;
    this.rootNode.classList.add('note-pocket');

    this.handleCreateNoteButtonClick = this.handleCreateNoteButtonClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.serializeAndSaveNotes = this.serializeAndSaveNotes.bind(this);

    this.noteIndexer = new NoteIndexer();
    this.notesStorage = new StorageController(STORAGE_KEY_NOTES);

    const storedNotes = this.notesStorage.readData();
    this.notes = storedNotes ? this.deserializeNotes(storedNotes) : [];

    const createNoteButton = document.createElement('button');
    createNoteButton.classList.add('note-pocket__create-note-button');
    createNoteButton.innerHTML = 'Create new note';
    createNoteButton.addEventListener('click', this.handleCreateNoteButtonClick);
    this.rootNode.appendChild(createNoteButton);
  }

  deserializeNotes(notes) {
    return notes.map(note =>
      new Note(this.rootNode, this.noteIndexer, note, this.serializeAndSaveNotes, this.handleDelete),
    );
  }

  handleCreateNoteButtonClick() {
    this.notes.push(
      new Note(this.rootNode, this.noteIndexer, {}, this.serializeAndSaveNotes, this.handleDelete),
    );
    
    this.serializeAndSaveNotes();
  }

  handleDelete(noteId) {
    this.notes = this.notes.filter(note => note.id !== noteId);

    this.serializeAndSaveNotes();
  }

  serializeAndSaveNotes() {
    this.notesStorage.saveData(this.notes.map(note => note.serialize()));
  }
}

export default NotePocket;
