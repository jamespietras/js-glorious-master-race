export const gameStatesEnum = {
  AWAITING_RESTART: 'awaiting_restart',
  PAUSED: 'paused',
  RUNNING: 'running',
};

class GameState {
  constructor() {
    this.state = gameStatesEnum.PAUSED;
  }

  get currentState() {
    return this.state;
  }

  changeState(newState) {
    this.state = newState;
  }
}

export default GameState;
