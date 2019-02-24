class UIController {
  constructor(ctx, onRestartClick) {
    this.ctx = ctx;

    this.currentSplashText = null;
    this.elapsedTime = 0;
    this.initialTimestamp = 0;
    this.onRestartClick = onRestartClick;
    this.restartButtonVisible = false;

    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.ctx.canvas.addEventListener('click', this.handleCanvasClick);
  }

  changeInitialTimestamp(newValue) {
    this.initialTimestamp = newValue;
  }

  changeRestartButtonVisibility(newValue) {
    this.restartButtonVisible = newValue;
  }

  handleCanvasClick(event) {
    if (this.restartButtonVisible) {
      const textCenterX = this.ctx.canvas.width / 2;
      const textCenterY = (this.ctx.canvas.height / 8) + 40;

      if (event.clientX > textCenterX - 50
        && event.clientX < textCenterX + 50
        && event.clientY > textCenterY - 15
        && event.clientY < textCenterY + 15) {
          this.onRestartClick();
      }
    }
  }

  hideSplashText() {
    this.currentSplashText = '';
  }

  render() {
    if (this.currentSplashText) {
      this.renderSplashText();
    }

    if (this.restartButtonVisible) {
      this.renderRestartButton();
    }

    this.renderTimer();
  }

  renderRestartButton() {
    this.ctx.font = '25px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Restart game', this.ctx.canvas.width / 2, (this.ctx.canvas.height / 8) + 40);
  }

  renderSplashText() {
    this.ctx.font = '32px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.currentSplashText, this.ctx.canvas.width / 2, this.ctx.canvas.height / 8);
  }

  renderTimer() {
    const elapsedSeconds = Math.round(this.elapsedTime / 1000);

    let formattedTime = '';
    if (elapsedSeconds > 60) { formattedTime += `${Math.floor(elapsedSeconds / 60)}m `; }
    formattedTime += `${elapsedSeconds % 60}s`;

    this.ctx.font = '25px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Elapsed time: ${formattedTime}`, 30, 50);
  }

  showDefeat() {
    this.currentSplashText = 'Oh no, you lost!';
  }

  showVictory() {
    this.currentSplashText = 'Congratulations, you won!';
  }

  updateTimer(newTimestamp) {
    this.elapsedTime = newTimestamp - this.initialTimestamp;
  }
}

export default UIController;
