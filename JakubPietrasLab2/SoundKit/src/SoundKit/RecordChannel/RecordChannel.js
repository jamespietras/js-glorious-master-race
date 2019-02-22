class Record {
  constructor(timestamp, audio) {
    this.audio = audio;
    this.timestamp = timestamp;
  }
}

class RecordChannel {
  constructor(rootNode, channelName) {
    this.rootNode = rootNode;
    this.isOpen = false;
    this.records = [];
    this.recordingDuration = null;
    this.recordStartTimestamp = null;

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.play = this.play.bind(this);
    this.playback = this.playback.bind(this);

    this.container = document.createElement('div');
    this.container.innerHTML = `<p>Channel ${channelName}</p>`;
    this.rootNode.appendChild(this.container);

    this.status = document.createElement('p');
    this.container.appendChild(this.status);
    this.updateStatusLabel();

    this.openButton = document.createElement('button');
    this.openButton.innerHTML = 'Open';
    this.openButton.addEventListener('click', this.open);
    this.container.appendChild(this.openButton);

    this.closeButton = document.createElement('button');
    this.closeButton.innerHTML = 'Close';
    this.closeButton.addEventListener('click', this.close);
    this.container.appendChild(this.closeButton);

    this.playButton = document.createElement('button');
    this.playButton.innerHTML = 'Play';
    this.playButton.addEventListener('click', this.play);
    this.container.appendChild(this.playButton);
  }

  close() {
    if (this.playbackInProgress) {
      return;
    }

    this.isOpen = false;
    this.recordingDuration = Date.now() - this.recordStartTimestamp;

    this.updateStatusLabel();
  }

  inputSound(audio) {
    if (this.isOpen) {
      const record = new Record(Date.now() - this.recordStartTimestamp, audio);

      this.records.push(record);
    }
  }

  open() {
    if (this.playbackInProgress) {
      return;
    }

    this.records = [];
    this.recordStartTimestamp = Date.now();
    this.isOpen = true;

    this.updateStatusLabel();
  }

  play() {
    if (this.playbackInProgress) {
      return;
    }

    this.playbackInProgress = true;
    this.updateStatusLabel();
    this.playbackStartTimestamp = Date.now();
    this.playbackRecords = [...this.records];
    requestAnimationFrame(this.playback);
  }

  playback() {
    const newList = [];
    const elapsedTime = Date.now() - this.playbackStartTimestamp;
    
    this.playbackRecords.forEach((record) => {
      if (elapsedTime > record.timestamp) {
        record.audio.play();
      } else {
        newList.push(record);
      }
    });
    
    this.playbackRecords = [...newList];
    
    if (elapsedTime > this.recordingDuration) {
      this.playbackInProgress = false;
      this.updateStatusLabel();
      return;
    }

    requestAnimationFrame(this.playback);
  }

  updateStatusLabel() {
    const currentStatus = document.createElement('p');
    if (this.playbackInProgress) {
      currentStatus.style.color = '#3498db';
      currentStatus.innerHTML = 'Playing';
    } else {
      currentStatus.style.color = this.isOpen ? '#27ae60' : '#c0392b';
      currentStatus.innerHTML = this.isOpen ? 'Open' : 'Closed';
    }

    this.status.innerHTML = '';
    this.status.appendChild(currentStatus);
  }
}

export default RecordChannel;
