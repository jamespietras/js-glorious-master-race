import Note from './Note';
import NoteIndexer from './NoteIndexer';

import './_note-pocket.scss';

class NotePocket {
  constructor(rootNode) {
    this.rootNode = rootNode;
    this.rootNode.classList.add('note-pocket');

    this.noteIndexer = new NoteIndexer();

    this.notes = [];

    this.handleCreateNoteButtonClick = this.handleCreateNoteButtonClick.bind(this);

    const createNoteButton = document.createElement('button');
    createNoteButton.innerHTML = 'Create new note';
    createNoteButton.addEventListener('click', this.handleCreateNoteButtonClick);
    this.rootNode.appendChild(createNoteButton);
  }

  handleCreateNoteButtonClick() {
    this.notes.push(new Note(this.rootNode, this.noteIndexer));
  }
}

export default NotePocket;
