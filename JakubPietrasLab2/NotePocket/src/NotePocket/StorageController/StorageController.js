class StorageController {
  constructor(storageKey) {
    this.storageKey = `NOTE_POCKET_${storageKey}`;
  }

  readData() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}

export default StorageController;
