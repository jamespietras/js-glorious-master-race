import 'bootstrap-slider/dist/css/bootstrap-slider.css';
import './index.scss';

import Editor from './Editor';

document.addEventListener('DOMContentLoaded', () => {
  const editorRootNode = document.getElementById('editor-root');

  const editor = new Editor(editorRootNode);
  editor.initialize();
});
