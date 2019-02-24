import './index.scss';

import NotePocket from './NotePocket';

document.addEventListener('DOMContentLoaded', () => {
  const notePocketRootNode = document.getElementById('note-pocket-root');

  new NotePocket(notePocketRootNode);
});
