import uuid from 'uuid';

import Menu from './Menu';

import './_note.scss';

export const noteColorsEnum = {
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow',
};

const BLUE_COLOR_CLASS = 'note--blue';
const GREEN_COLOR_CLASS = 'note--green';
const YELLOW_COLOR_CLASS = 'note--yellow';

class Note {
  constructor(rootNode, noteIndexer, initialData, onChange, onDelete) {
    this.rootNode = rootNode;
    this.noteIndexer = noteIndexer;
    this.onChange = onChange;
    this.onDelete = onDelete;
    
    this.attachListeners = this.attachListeners.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.dragStop = this.dragStop.bind(this);
    this.dragTick = this.dragTick.bind(this);
    this.handleColorChangeClick = this.handleColorChangeClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.moveToTopLayer = this.moveToTopLayer.bind(this);
    this.resizeStart = this.resizeStart.bind(this);
    this.resizeStop = this.resizeStop.bind(this);
    this.resizeTick = this.resizeTick.bind(this);
    this.stopEdit = this.stopEdit.bind(this);
    this.updateLayerIndex = this.updateLayerIndex.bind(this);

    this.color = initialData.color || noteColorsEnum.YELLOW;
    this.content = initialData.content || '';
    this.createdAt = initialData.createdAt ? new Date(initialData.createdAt) : new Date();
    this.id = initialData.id || uuid.v4();
    this.height = initialData.height || 200 / this.rootNode.clientHeight;
    this.width = initialData.width || (this.rootNode.clientHeight / this.rootNode.clientWidth) * this.height;
    this.position = initialData.position ? initialData.position : {
      x: Math.max(Math.min(Math.random().toFixed(2), 0.9), 0.1),
      y: Math.max(Math.min(Math.random().toFixed(2), 0.8), 0.2),
    };

    
    this.noteNode = document.createElement('div');
    this.noteNode.classList.add('note');
    this.rootNode.appendChild(this.noteNode);
    
    this.menu = new Menu(
      initialData.color || noteColorsEnum.YELLOW,
      this.createdAt,
      this.handleColorChangeClick,
      this.handleDeleteClick,
      this.handleEditClick,
    );
    this.noteNode.appendChild(this.menu.rootNode);
      
    this.contentNode = document.createElement('textarea');
    this.contentNode.classList.add('note__content');
    this.noteNode.appendChild(this.contentNode);
      
    this.resizeHandle = document.createElement('div');
    this.resizeHandle.classList.add('note__resize-handle');
    this.noteNode.appendChild(this.resizeHandle);
      
    this.attachListeners();
  
    this.layerIndex = this.noteIndexer.subscribe(this.id, this.updateLayerIndex, initialData.layerIndex || null);
      
    this.render();
  }

  attachListeners() {
    this.noteNode.addEventListener('mousedown', this.dragStart);
    this.noteNode.addEventListener('mousedown', this.moveToTopLayer);
    this.resizeHandle.addEventListener('mousedown', this.resizeStart);
  }

  destroy() {
    this.detachListeners();
    this.menu.destroy();
    this.noteNode.removeChild(this.menu.rootNode);
    this.rootNode.removeChild(this.noteNode);
  }

  detachListeners() {
    this.noteNode.removeEventListener('mousedown', this.dragStart);
    this.noteNode.removeEventListener('mousedown', this.moveToTopLayer);
    this.resizeHandle.removeEventListener('mousedown', this.resizeStart);
    this.contentNode.removeEventListener('blur', this.stopEdit);
  }

  dragStart(event) {
    if (event.target !== this.noteNode && event.target !== this.menu.rootNode) {
      return;
    }

    this.dragStartX = event.offsetX || event.layerX;
    this.dragStartY = event.offsetY || event.layerY;

    window.addEventListener('mousemove', this.dragTick);
    window.addEventListener('mouseup', this.dragStop);
  }

  dragStop() {
    window.removeEventListener('mousemove', this.dragTick);
    window.removeEventListener('mouseup', this.dragStop);

    this.onChange();
  }

  dragTick(event) {
    this.position.x = (event.clientX - this.dragStartX) / this.rootNode.clientWidth;
    this.position.y = (event.clientY - this.dragStartY) / this.rootNode.clientHeight;

    this.render();
  }

  handleColorChangeClick() {
    switch (this.color) {
      case noteColorsEnum.BLUE:
        this.color = noteColorsEnum.GREEN;
        break;

      case noteColorsEnum.GREEN:
        this.color = noteColorsEnum.YELLOW;
        break;

      case noteColorsEnum.YELLOW:
        this.color = noteColorsEnum.BLUE;
        break;
    }

    this.menu.changeColor(this.color);
    this.onChange();
    this.render();
  }

  handleDeleteClick() {
    this.destroy();

    this.onDelete(this.id);
  }

  handleEditClick(event) {
    this.contentNode.focus();
    this.contentNode.style.pointerEvents = 'auto';
    this.contentNode.addEventListener('blur', this.stopEdit);
  }

  moveToTopLayer() {
    this.noteIndexer.moveToTop(this.id);
  }

  updateLayerIndex(newIndex) {
    this.layerIndex = newIndex;
    this.render();
    this.onChange();
  }

  render() {
    this.contentNode.textContent = this.content;
    this.menu.render();

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

  resizeStart(event) {
    this.resizeStartHeight = this.height;
    this.resizeStartWidth = this.width;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;

    document.documentElement.style.cursor = 'se-resize';

    window.addEventListener('mousemove', this.resizeTick);
    window.addEventListener('mouseup', this.resizeStop);
  }

  resizeStop() {
    document.documentElement.style.cursor = 'default';

    window.removeEventListener('mousemove', this.resizeTick);
    window.removeEventListener('mouseup', this.resizeStop);

    this.onChange();
  }

  resizeTick(event) {
    const newHeight = this.resizeStartHeight + ((event.clientY - this.resizeStartY) / this.rootNode.clientHeight);
    const newWidth = this.resizeStartWidth + ((event.clientX - this.resizeStartX) / this.rootNode.clientWidth);

    if (newHeight * this.rootNode.clientHeight > 200) {
      this.height = newHeight;
    }

    if(newWidth * this.rootNode.clientWidth > 200) {
      this.width = newWidth;
    }

    this.render();
  }

  serialize() {
    return {
      color: this.color,
      content: this.content,
      createdAt: this.createdAt.toString(),
      id: this.id,
      height: this.height,
      layerIndex: this.layerIndex,
      width: this.width,
      position: this.position,
    };
  }

  stopEdit() {
    this.contentNode.removeEventListener('blur', this.stopEdit);
    this.contentNode.style.pointerEvents = 'none';
    this.content = this.contentNode.value;

    this.onChange();
  }
}

export default Note;
