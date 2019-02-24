class GameObject {
  constructor(positionX, positionY, velocityX, velocityY) {
    this.position = {
      x: positionX,
      y: positionY,
    };

    this.velocity = {
      x: velocityX,
      y: velocityY,
    };
  }

  reverseVectorX() {
    this.velocity.x *= -1;
  }

  reverseVectorY() {
    this.velocity.y *= -1;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export default GameObject;
