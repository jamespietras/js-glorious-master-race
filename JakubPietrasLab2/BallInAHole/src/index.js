import './index.scss';

import Game from './Game';

document.addEventListener('DOMContentLoaded', () => {
  const gameRootNode = document.getElementById('game-root');

  new Game(gameRootNode);
});
