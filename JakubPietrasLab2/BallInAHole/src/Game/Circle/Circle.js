import GameObject from '../GameObject';

class Circle extends GameObject {
  constructor(config) {
    super(config.positionX, config.positionY, config.velocityX, config.velocityY);

    this.color = config.color;
    this.radius = config.radius;
  }

  collideWith(gameObject) {
    const diffX = this.position.x - gameObject.position.x;
    const diffY = this.position.y - gameObject.position.y;
    const distance = Math.sqrt((diffX * diffX) + (diffY * diffY));

    return distance < this.radius + gameObject.radius;
  }

  render(ctx) {
    ctx.beginPath();

    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.closePath();
  }
}

export default Circle;
