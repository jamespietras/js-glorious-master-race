function truncateColor(value) {
  return Math.min(Math.max(value, 0), 255);
}

class ImageUtilities {
  static applyBrightness(imageData, brightness) {
    const adjustment = brightness / 100;

    for (let i = 0 ; i < imageData.length ; i+= 4) {
      imageData[i] += 255 * adjustment;
      imageData[i + 1] += 255 * adjustment;
      imageData[i + 2] += 255 * adjustment;
    }
  }

  static applyContrast(imageData, contrast) {
    const factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));

    for (let i = 0 ; i < imageData.length ; i += 4) {
      imageData[i] = truncateColor(factor * (imageData[i] - 128.0) + 128.0);
      imageData[i + 1] = truncateColor(factor * (imageData[i + 1] - 128.0) + 128.0);
      imageData[i + 2] = truncateColor(factor * (imageData[i + 2] - 128.0) + 128.0);
    }
  }

  static applySaturation(imageData, saturation) {
    const adjustment = saturation / -100;

    for (let i = 0 ; i < imageData.length ; i+= 4) {
      const max = Math.max(imageData[i], imageData[i + 1], imageData[i + 2]);

      imageData[i] += (max - imageData[i]) * adjustment;
      imageData[i + 1] += (max - imageData[i + 1]) * adjustment;
      imageData[i + 2] += (max - imageData[i + 2]) * adjustment;
    }
  }

  static applySepia(imageData, sepia) {
    const adjustment = sepia / 100;

    for (let i = 0 ; i < imageData.length ; i+= 4) {
      imageData[i] = Math.min(255, (imageData[i] * (1 - (0.607 * adjustment)))
        + (imageData[i + 1] * (0.769 * adjustment))
        + (imageData[i + 2] * (0.189 * adjustment)));

      imageData[i + 1] = Math.min(255, (imageData[i] * (0.349 * adjustment))
        + (imageData[i + 1] * (1 - (0.314 * adjustment)))
        + (imageData[i + 2] * (0.168 * adjustment)));

      imageData[i + 2] = Math.min(255, (imageData[i] * (0.272 * adjustment))
        + (imageData[i + 1] * (0.534 * adjustment)))
        + (imageData[i + 2] * (1 - (0.869 * adjustment)));
    }
  }

  static async loadImage(src) {
    return new Promise((resolve) => {
      const targetImage = new Image();
      targetImage.src = src;

      targetImage.onload = () => {
        resolve(targetImage);
      };
    });
  }
}

export default ImageUtilities;
