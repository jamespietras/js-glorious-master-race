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

  subscribe(id, handler) {
    const assignedLayerIndex = this.subscribers.length;

    this.subscribers.push(new Subscriber(id, handler, assignedLayerIndex));
  }
}

export default NoteIndexer;
