type ThumbName = 'from' | 'to';

export class Thumb {
  element: HTMLElement;

  constructor(private _name: ThumbName) {
    this.element = this.createThumb();
  }

  createThumb(): HTMLElement {
    let thumb: HTMLElement = document.createElement('div');
    thumb.className = `range-slider__thumb_${this._name}`;

    return thumb;
  }

  setMarginLeft(margin: number): void {
    this.element.style.marginLeft = margin + '%';
  }

}
