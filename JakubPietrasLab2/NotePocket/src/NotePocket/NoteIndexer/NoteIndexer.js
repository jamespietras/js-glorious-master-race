class Subscriber {
  constructor(id, handler, layerIndex) {
    this.handler = handler;
    this.id = id;
    this.layerIndex = layerIndex;
  }
}

class NoteIndexer {
  constructor() {
    this.subscribers = [];
  }

  moveToTop(id) {
    const targetSubscriberIndex = this.subscribers.findIndex(subscriber => subscriber.id === id);
    const targetSubscriber = this.subscribers.splice(targetSubscriberIndex, 1)[0];
    this.subscribers.push(targetSubscriber);
    
    this.reflowLayerIndexes();
  }

  reflowLayerIndexes() {
    this.subscribers.forEach((subscriber, index) => {
      subscriber.layerIndex = index;
      subscriber.handler(index);
    });
  }

  subscribe(id, handler, initialIndex) {
    const assignedLayerIndex = this.subscribers.length;

    const newSubscriber = new Subscriber(id, handler, initialIndex || assignedLayerIndex);
    this.subscribers.push(newSubscriber);

    this.subscribers = this.subscribers.sort((a, b) => {
      if (a.layerIndex === b.layerIndex) {
        return 0;
      } else if (a.layerIndex > b.layerIndex) {
        return 1;
      } else {
        return -1;
      }
    });
    
    return newSubscriber.layerIndex;
  }
}

export default NoteIndexer;
