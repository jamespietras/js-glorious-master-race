const KEYS_MAP = new Map([
  [65, 'a'],
  [68, 'd'],
  [70, 'f'],
  [71, 'g'],
  [72, 'h'],
  [74, 'j'],
  [75, 'k'],
  [76, 'l'],
  [83, 's'],
]);

class KeyController {
  constructor() {
    this.keyDownHandler = null;
    this.keysStatuses = {
      a: false,
      d: false,
      f: false,
      g: false,
      h: false,
      j: false,
      k: false,
      l: false,
      s: false,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(event) {
    if (this.keyDownHandler) {
      if (KEYS_MAP.has(event.keyCode)) {
        const keyName = KEYS_MAP.get(event.keyCode);

        if (!this.keysStatuses[keyName]) {
          this.keyDownHandler(keyName);
        }
      }
    }

    this.updateActiveKeys(event.keyCode, true);
  }

  handleKeyUp(event) {
    this.updateActiveKeys(event.keyCode, false);
  }

  onKeyDown(handler) {
    this.keyDownHandler = handler;
  }

  updateActiveKeys(keyCode, newValue) {
    if (KEYS_MAP.has(keyCode)) {
      this.keysStatuses[KEYS_MAP.get(keyCode)] = newValue;
    }
  }
}

export default KeyController;
