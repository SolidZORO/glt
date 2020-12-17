import { Container, Sprite, BitmapText, Texture } from 'pixi.js';

export default class Cell extends Container {
  constructor({ isHeader, value, width, height, textAlign }) {
    super();

    this.editable = !isHeader;
    this.cellWidth = width;
    this.cellHeight = height;
    this.textAlign = textAlign;

    const border = new Sprite(Texture.WHITE);
    border.width = width;
    border.height = height;
    border.tint = 0xf1f1f1;
    this.addChild(border);

    const bg = new Sprite(Texture.WHITE);
    bg.width = width - 2;
    bg.height = height - 2;
    bg.position.set(1, 1);
    bg.y = 1;
    this.addChild(bg);

    if (value) {
      this.setText(value);
    }
  }

  getValue() {
    return this.value;
  }

  setText(value) {
    this.value = value;

    if (!this.textField) {
      this.textField = new BitmapText(value, { font: '13px Arial', align: 'center' });
      this.addChild(this.textField);
    } else {
      this.textField.text = value;
    }

    if (this.textAlign === 'center') {
      this.textField.position.x = this.cellWidth / 2 - this.textField.width / 2;
    }

    // FIXME fix line-height in Bitmap Text generator
    this.textField.position.y = this.cellHeight / 2 - this.textField.height / 2 - 2;
  }
}
