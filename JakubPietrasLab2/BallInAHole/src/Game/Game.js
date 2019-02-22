import Circle from './Circle';
import GameState, {gameStatesEnum} from './GameState';
import GyroscopeController from './GyroscopeController';
import KeyController from './KeyController';
import Obstacle from './Obstacle';
import Player from './Player';
import Target from './Target';
import UIController from './UIController';

import './_game.scss';

class Game {
  constructor(rootNode) {
    this.rootNode = rootNode;
    this.canvas = document.createElement('canvas');
    this.canvas.style.backgroundColor = '#000';
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.rootNode.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.gameLoop = this.gameLoop.bind(this);
    this.handleRestartClick = this.handleRestartClick.bind(this);

    this.gyroscopeController = new GyroscopeController();
    this.keyController = new KeyController();
    this.uiController = new UIController(this.ctx, this.handleRestartClick);

    this.resetStage();

    this.gameState = new GameState();
    this.gameState.changeState(gameStatesEnum.RUNNING);

    requestAnimationFrame(this.gameLoop);
  }

  detectBorderColission() {
    this.gameObjects.forEach((gameObject) => {
      if (gameObject.position.y + gameObject.radius >= this.canvas.height
        || gameObject.position.y - gameObject.radius <= 0) {
        gameObject.reverseVectorY();
      } else if (gameObject.position.x + gameObject.radius >= this.canvas.width
        || gameObject.position.x - gameObject.radius <= 0) {
        gameObject.reverseVectorX();
      }
    });
  }

  detectObstacleColission() {
    this.gameObjects.forEach((gameObject) => {
      if (gameObject instanceof Obstacle) {
        if(this.player.collideWith(gameObject)) {
          this.gameState.changeState(gameStatesEnum.PAUSED);
          this.uiController.showDefeat();
          this.uiController.changeRestartButtonVisibility(true);
        }
      }

      if (gameObject instanceof Target) {
        if(this.player.collideWith(gameObject)) {
          this.gameState.changeState(gameStatesEnum.PAUSED);
          this.uiController.showVictory();
          this.uiController.changeRestartButtonVisibility(true);
        }
      }
    });
  }

  gameLoop(timestamp) {
    if (this.gameState.currentState === gameStatesEnum.AWAITING_RESTART) {
      this.restartGame(timestamp);
    }

    if (this.gameState.currentState === gameStatesEnum.RUNNING) {
      this.update(timestamp);
    }
    
    this.render();

    requestAnimationFrame(this.gameLoop);
  }

  handleRestartClick() {
    this.gameState.changeState(gameStatesEnum.AWAITING_RESTART);
  }

  render() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.restore();

    this.uiController.render();
    this.gameObjects.forEach(gameObject => gameObject.render(this.ctx));
  }

  resetStage() {
    this.gameObjects = [];

    this.gameObjects.push(new Obstacle({
      positionX: this.canvas.width / 4,
      positionY: this.canvas.height / 4,
      color: '#fff',
      velocityX: 0,
      velocityY: 0,
      radius: 30,
    }));

    this.gameObjects.push(new Obstacle({
      positionX: (this.canvas.width / 5) * 3,
      positionY: (this.canvas.height / 5) * 3,
      color: '#fff',
      velocityX: 0,
      velocityY: 0,
      radius: 30,
    }));

    this.gameObjects.push(new Target({
      positionX: (this.canvas.width / 5) * 4,
      positionY: (this.canvas.height / 4) * 3,
      color: '#00ff00',
      velocityX: 0,
      velocityY: 0,
      radius: 10,
    }));

    this.player = new Player({
      positionX: this.canvas.width / 10,
      positionY: this.canvas.height / 10,
      color: '#ff0000',
      velocityX: 0,
      velocityY: 0,
      radius: 10,
    });
    this.gameObjects.push(this.player);
  }

  restartGame(timestamp) {
    this.resetStage();

    this.uiController.changeRestartButtonVisibility(false);
    this.uiController.hideSplashText();
    this.uiController.changeInitialTimestamp(timestamp);

    this.gameState.changeState(gameStatesEnum.RUNNING);
  }

  update(timestamp) {
    this.player.increaseVelocityXBy(this.gyroscopeController.currentAccelerationX / 2);
    this.player.increaseVelocityYBy(this.gyroscopeController.currentAccelerationY / 2);

    if (this.keyController.keysStatuses.a) {
      this.player.increaseVelocityXBy(-0.15);
    }

    if (this.keyController.keysStatuses.d) {
      this.player.increaseVelocityXBy(0.15);
    }

    if (this.keyController.keysStatuses.s) {
      this.player.increaseVelocityYBy(0.15);
    }

    if (this.keyController.keysStatuses.w) {
      this.player.increaseVelocityYBy(-0.15);
    }
    
    this.detectBorderColission();
    this.detectObstacleColission();

    this.gameObjects.forEach(gameObject => gameObject.update());

    this.uiController.updateTimer(timestamp);
  }
}

export default Game;
