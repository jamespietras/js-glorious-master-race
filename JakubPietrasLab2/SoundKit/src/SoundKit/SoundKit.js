import KeyController from './KeyController';
import RecordChannel from './RecordChannel';
import soundMap from './soundMap';

const soundKeyMap = {
  'a': soundMap.BOOM,
  's': soundMap.CLAP,
  'd': soundMap.HIHAT,
  'f': soundMap.KICK,
  'g': soundMap.OPENHAT,
  'h': soundMap.RIDE,
  'j': soundMap.SNARE,
  'k': soundMap.TINK,
  'l': soundMap.TOM,
};

const keyLabels = {
  'a': '(a) Boom',
  's': '(s) Clap',
  'd': '(d) Hihat',
  'f': '(f) Kick',
  'g': '(g) Openhat',
  'h': '(h) Ride',
  'j': '(j) Snare',
  'k': '(k) Tink',
  'l': '(l) Tom',
};

class SoundKit {
  constructor(rootNode) {
    this.rootNode = rootNode;

    this.preloadAudio();

    this.keysCanvas = document.createElement('canvas');
    this.keysCanvas.height = 200;
    this.keysCanvas.width = 900;
    this.keysCanvasCtx = this.keysCanvas.getContext('2d');
    this.rootNode.appendChild(this.keysCanvas);

    this.channelsContainer = document.createElement('div');
    this.channelsContainer.style.display = 'flex';
    this.channelsContainer.style.justifyContent = 'space-between';
    this.rootNode.appendChild(this.channelsContainer);

    this.recordChannels = [
      new RecordChannel(this.channelsContainer, '1'),
      new RecordChannel(this.channelsContainer, '2'),
      new RecordChannel(this.channelsContainer, '3'),
      new RecordChannel(this.channelsContainer, '4'),
    ];

    this.keyController = new KeyController();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.renderKeys = this.renderKeys.bind(this);

    this.keyController.onKeyDown(this.handleKeyDown);
    requestAnimationFrame(this.renderKeys);
  }

  handleKeyDown(keyName) {
    const soundFile = soundKeyMap[keyName];

    const audio = new Audio(soundFile);
    audio.play();

    this.recordChannels.forEach((recordChannel) => {
      if (recordChannel.isOpen) {
        recordChannel.inputSound(audio);
      }
    });
  }

  preloadAudio() {
    Object.values(soundKeyMap).forEach(soundFile => new Audio(soundFile));
  }

  renderKeys() {
    this.keysCanvasCtx.clearRect(0, 0, this.keysCanvas.width, this.keysCanvas.height);

    Object.keys(soundKeyMap).forEach((key, index) => {
      this.keysCanvasCtx.beginPath();
      this.keysCanvasCtx.rect(index * 100, 0, 100, 200);
      if (this.keyController.keysStatuses[key]) {
        this.keysCanvasCtx.fillStyle = '#bdc3c7';
        this.keysCanvasCtx.fill();
      }
      this.keysCanvasCtx.stroke();
      this.keysCanvasCtx.closePath();

      this.keysCanvasCtx.fillStyle = '#000';
      this.keysCanvasCtx.font = '16px Arial';
      this.keysCanvasCtx.textAlign = 'center';
      this.keysCanvasCtx.fillText(keyLabels[key], (index * 100) + 50, 100);
    });

    requestAnimationFrame(this.renderKeys);
  }
}

export default SoundKit;
