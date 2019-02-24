import {noteColorsEnum} from '../Note';

const BLUE_COLOR_CLASS = 'note__menu--blue';
const GREEN_COLOR_CLASS = 'note__menu--green';
const YELLOW_COLOR_CLASS = 'note__menu--yellow';

class Menu {
  constructor(intialColor, createdAt, onColorChangeClick, onDelete, onEdit) {
    this.onColorChangeClick = onColorChangeClick;
    this.onDelete = onDelete;
    this.onEdit = onEdit;

    this.rootNode = document.createElement('div');
    this.rootNode.classList.add('note__menu');

    this.colorChangeButton = document.createElement('button');
    this.colorChangeButton.classList.add('note__menu__color-change-button');
    this.colorChangeButton.addEventListener('click', this.onColorChangeClick);
    this.rootNode.appendChild(this.colorChangeButton);

    this.createdAtLabel = document.createElement('p');
    this.createdAtLabel.innerHTML = `${createdAt.getDate()}/${createdAt.getMonth()}/${createdAt.getFullYear()}`;
    this.createdAtLabel.classList.add('note__menu__created-at-label');
    this.rootNode.appendChild(this.createdAtLabel);

    this.editButton = document.createElement('button');
    this.editButton.classList.add('note__menu__edit-button');
    this.editButton.addEventListener('click', this.onEdit);
    this.rootNode.appendChild(this.editButton);

    this.deleteButton = document.createElement('button');
    this.deleteButton.classList.add('note__menu__delete-button');
    this.deleteButton.addEventListener('click', this.onDelete);
    this.rootNode.appendChild(this.deleteButton);

    this.color = intialColor;
  }

  changeColor(newColor) {
    this.color = newColor;
  }

  destroy() {
    this.colorChangeButton.removeEventListener('click', this.onColorChangeClick);
    this.deleteButton.removeEventListener('click', this.onDelete);
    this.editButton.removeEventListener('click', this.onEdit);
  }

  render() {
    this.rootNode.classList.remove(BLUE_COLOR_CLASS);
    this.rootNode.classList.remove(GREEN_COLOR_CLASS);
    this.rootNode.classList.remove(YELLOW_COLOR_CLASS);

    switch (this.color) {
      case noteColorsEnum.BLUE:
        this.rootNode.classList.add(BLUE_COLOR_CLASS);
        break;

      case noteColorsEnum.GREEN:
        this.rootNode.classList.add(GREEN_COLOR_CLASS);
        break;

      case noteColorsEnum.YELLOW:
        this.rootNode.classList.add(YELLOW_COLOR_CLASS);
        break;
    }
  }
}

export default Menu
