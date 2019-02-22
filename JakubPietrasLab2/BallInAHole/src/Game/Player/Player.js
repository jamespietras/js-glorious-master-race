import Circle from '../Circle';

class Player extends Circle {
  constructor(config) {
    super(config);

    this.VELOCITY_X_CAP = 10;
    this.VELOCITY_Y_CAP = 10;
  }

  increaseVelocityXBy(value) {
    if (this.velocity.x + value < this.VELOCITY_X_CAP) {
      this.velocity.x += value;
    } else {
      this.velocity.x = Math.sign(value) * this.VELOCITY_X_CAP;
    }
  }
  
  increaseVelocityYBy(value) {
    if (this.velocity.y + value < this.VELOCITY_Y_CAP) {
      this.velocity.y += value;
    } else {
      this.velocity.y = Math.sign(value) * this.VELOCITY_Y_CAP;
    }
  }
}

export default Player;
