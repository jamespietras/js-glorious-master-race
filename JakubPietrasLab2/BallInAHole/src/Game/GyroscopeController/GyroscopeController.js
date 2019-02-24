class GyroscopeController {
  constructor() {
    this.currentAccelerationX = 0;
    this.currentAccelerationY = 0;

    this.handleDeviceMotion = this.handleDeviceMotion.bind(this);
    window.addEventListener('devicemotion', this.handleDeviceMotion);
  }

  handleDeviceMotion(event) {
    this.currentAccelerationX = -event.accelerationIncludingGravity.x;
    this.currentAccelerationY = event.accelerationIncludingGravity.y;
  }
}

export default GyroscopeController;
