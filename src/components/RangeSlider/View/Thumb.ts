import { Tooltip } from './Tooltip';

export type ThumbName = 'from' | 'to';

export class Thumb {
  element: HTMLElement;
  tooltip: Tooltip;

  constructor(private _name: ThumbName) {
    this.tooltip = new Tooltip(this._name);
    this.element = this.createThumb();
  }

  createThumb(): HTMLElement {
    let thumb: HTMLElement = document.createElement('div');
    thumb.className = `range-slider__thumb_${this._name}`;

    thumb.appendChild(this.tooltip.element);

    return thumb;
  }

  setMarginLeft(margin: number | undefined): void {
    if (margin === undefined) return;
    this.element.style.marginLeft = margin + '%';
  }

}
