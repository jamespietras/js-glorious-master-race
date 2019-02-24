import ImageUtilities from './ImageUtilities';
import Slider from './Slider';

import gatsbyImage from './assets/gatsby.jpg';
import './_editor.scss';

const BRIGHTNESS_INPUT_IDENTIFIER = 'data-editor-input-brightness';
const CONTRAST_INPUT_IDENTIFIER = 'data-editor-input-contrast';
const SATURATION_INPUT_IDENTIFIER = 'data-editor-input-saturation';
const SEPIA_INPUT_IDENTIFIER = 'data-editor-input-sepia';
const CANVAS_IDENTIFIER = 'data-editor-canvas';
const TARGET_IMAGE_SIZE = [700, 288];

class Editor {
  constructor(rootNode) {
    this.rootNode = rootNode;
    
    this.rootNode.classList.add('editor');
    this.canvasNode.classList.add('editor__canvas');

    this.modifiers = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sepia: 0,
    };

    this.handleBrightnessChange = this.handleBrightnessChange.bind(this);
    this.handleContrastChange = this.handleContrastChange.bind(this);
    this.handleSaturationChange = this.handleSaturationChange.bind(this);
    this.handleSepiaChange = this.handleSepiaChange.bind(this);

    this.brightnessSlider = new Slider(this.rootNode.querySelector(`[${BRIGHTNESS_INPUT_IDENTIFIER}]`), {
      max: 70,
      min: -70,
      step: 0.1,
    }, 'Brightness: ');
    this.brightnessSlider.onChange(this.handleBrightnessChange);

    this.contrastSlider = new Slider(this.rootNode.querySelector(`[${CONTRAST_INPUT_IDENTIFIER}]`), {
      max: 120,
      min: -120,
      step: 0.1,
    }, 'Contrast: ');
    this.contrastSlider.onChange(this.handleContrastChange);

    this.saturationSlider = new Slider(this.rootNode.querySelector(`[${SATURATION_INPUT_IDENTIFIER}]`), {
      max: 120,
      min: -120,
      step: 0.1,
    }, 'Saturation: ');
    this.saturationSlider.onChange(this.handleSaturationChange);

    this.sepiaSlider = new Slider(this.rootNode.querySelector(`[${SEPIA_INPUT_IDENTIFIER}]`), {
      max: 80,
      min: -100,
      step: 0.1,
    }, 'Sepia: ');
    this.sepiaSlider.onChange(this.handleSepiaChange);
  }

  get canvasNode() {
    return this.rootNode.querySelector(`[${CANVAS_IDENTIFIER}]`);
  }

  destroy() {
    this.brightnessSlider.destroy();
  }

  handleBrightnessChange(diff) {
    this.modifiers.brightness = diff.newValue;
    this.renderImage();
  };

  handleContrastChange(diff) {
    this.modifiers.contrast = diff.newValue;
    this.renderImage();
  };

  handleSaturationChange(diff) {
    this.modifiers.saturation = diff.newValue;
    this.renderImage();
  }

  handleSepiaChange(diff) {
    this.modifiers.sepia = diff.newValue;
    this.renderImage();
  }

  async initialize() {
    this.canvasNode.height = TARGET_IMAGE_SIZE[1];
    this.canvasNode.width = TARGET_IMAGE_SIZE[0];

    this.targetImage = await ImageUtilities.loadImage(gatsbyImage);
    this.renderImage();
  }

  async renderImage() {
    const ctx = this.canvasNode.getContext('2d');

    ctx.drawImage(this.targetImage, 0, 0, this.canvasNode.width, this.canvasNode.height);

    const imageData = ctx.getImageData(0, 0, this.canvasNode.width, this.canvasNode.height);

    ImageUtilities.applyBrightness(imageData.data, this.modifiers.brightness);
    ImageUtilities.applyContrast(imageData.data, this.modifiers.contrast);
    ImageUtilities.applySaturation(imageData.data, this.modifiers.saturation);
    ImageUtilities.applySepia(imageData.data, this.modifiers.sepia);

    ctx.putImageData(imageData, 0, 0);
  }
}

export default Editor;
