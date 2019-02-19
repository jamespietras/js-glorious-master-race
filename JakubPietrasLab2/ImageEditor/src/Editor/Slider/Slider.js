import BootstrapSlider from 'bootstrap-slider';

class Slider {
  constructor(rootNode, config, label) {
    this.rootNode = rootNode;

    this.label = label;
    this.sliderLabel = document.createElement('p');
    this.rootNode.appendChild(this.sliderLabel);

    this.sliderInput = document.createElement('input');
    this.rootNode.appendChild(this.sliderInput);

    this.bootstrapSlider = new BootstrapSlider(this.sliderInput, config);

    this.updateLabel = this.updateLabel.bind(this);

    this.bootstrapSlider.on('change', this.updateLabel);
    this.updateLabel({oldValue: 0, newValue: 0});
  }

  destroy() {
    this.bootstrapSlider.destroy();
  }

  onChange(handler) {
    this.bootstrapSlider.on('change', handler);
  }

  updateLabel(diff) {
    this.sliderLabel.innerHTML = `${this.label}${diff.newValue}`;
  }
}

export default Slider;
