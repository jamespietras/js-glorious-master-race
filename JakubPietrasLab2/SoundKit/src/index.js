import './index.scss';

import SoundKit from './SoundKit';

document.addEventListener('DOMContentLoaded', () => {
  const soundKitRootNode = document.getElementById('sound-kit-root');

  new SoundKit(soundKitRootNode);
});
