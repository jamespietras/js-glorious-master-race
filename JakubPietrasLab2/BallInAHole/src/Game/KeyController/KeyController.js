const KEYS_MAP = new Map([
  [65, 'a'],
  [68, 'd'],
  [83, 's'],
  [87, 'w'],
]);

class KeyController {
  constructor() {
    this.keysStatuses = {
      a: false,
      d: false,
      w: false,
      s: false,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(event) {
    this.updateActiveKeys(event.keyCode, true);
  }

  handleKeyUp(event) {
    this.updateActiveKeys(event.keyCode, false);
  }

  updateActiveKeys(keyCode, newValue) {
    if (KEYS_MAP.has(keyCode)) {
      this.keysStatuses[KEYS_MAP.get(keyCode)] = newValue;
    }
  }
}

export default KeyController;
