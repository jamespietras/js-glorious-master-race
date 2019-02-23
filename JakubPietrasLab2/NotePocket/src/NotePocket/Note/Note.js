import uuid from 'uuid';

import './_note.scss';

const noteColorsEnum = {
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow',
};

const BLUE_COLOR_CLASS = 'note--blue';
const GREEN_COLOR_CLASS = 'note--green';
const YELLOW_COLOR_CLASS = 'note--yellow';

class Note {
  constructor(rootNode, noteIndexer) {
    this.rootNode = rootNode;
    this.noteIndexer = noteIndexer;
    
    this.attachListeners = this.attachListeners.bind(this);
    this.moveToTopLayer = this.moveToTopLayer.bind(this);
    this.updateLayerIndex = this.updateLayerIndex.bind(this);

    this.noteNode = document.createElement('div');
    this.noteNode.classList.add('note');
    this.rootNode.appendChild(this.noteNode);
    this.attachListeners();
    
    this.color = noteColorsEnum.YELLOW;
    this.content = 'Initial note content';
    this.id = uuid.v4();
    this.height = 200 / this.rootNode.clientHeight;
    this.width = (this.rootNode.clientHeight / this.rootNode.clientWidth) * this.height;
    this.position = {
      x: Math.max(Math.min(Math.random().toFixed(2), 0.9), 0.1),
      y: Math.max(Math.min(Math.random().toFixed(2), 0.8), 0.2),
    };
    
    this.noteIndexer.subscribe(this.id, this.updateLayerIndex);

    this.render();
  }

  attachListeners() {
    this.noteNode.addEventListener('click', this.moveToTopLayer);
  }

  moveToTopLayer() {
    this.noteIndexer.moveToTop(this.id);
  }

  updateLayerIndex(newIndex) {
    this.layerIndex = newIndex;
    this.render();
  }

  render() {
    this.noteNode.innerHTML = this.content;

    this.noteNode.style.height = `${this.height * 100}%`;
    this.noteNode.style.left = `${this.position.x * 100}%`;
    this.noteNode.style.top = `${this.position.y * 100}%`;
    this.noteNode.style.width = `${this.width * 100}%`;
    this.noteNode.style.zIndex = this.layerIndex;

    this.noteNode.classList.remove(BLUE_COLOR_CLASS);
    this.noteNode.classList.remove(GREEN_COLOR_CLASS);
    this.noteNode.classList.remove(YELLOW_COLOR_CLASS);

    switch (this.color) {
      case noteColorsEnum.BLUE:
        this.noteNode.classList.add(BLUE_COLOR_CLASS);
        break;

      case noteColorsEnum.GREEN:
        this.noteNode.classList.add(GREEN_COLOR_CLASS);
        break;

      case noteColorsEnum.YELLOW:
        this.noteNode.classList.add(YELLOW_COLOR_CLASS);
        break;
    }
  }
}

export default Note;
