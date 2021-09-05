/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Tooltip from './Tooltip';
import { ThumbName, ISettings } from '../RangeSlider/types';

export default class Thumb {
  element: HTMLElement;

  tooltip: Tooltip;

  constructor(private name: ThumbName) {
    this.name = name;
    this.tooltip = new Tooltip(this.name);
    this.element = this.createThumb();
  }

  createThumb(): HTMLElement {
    const thumb: HTMLElement = document.createElement('div');
    thumb.className = `range-slider__thumb_${this.name}`;

    thumb.appendChild(this.tooltip.element);

    return thumb;
  }

  setMargin(margin: number | undefined, settings: ISettings): void {
    if (margin === undefined) return;

    if (settings.isVertical) {
      this.element.style.marginTop = `${margin}px`;
    } else {
      this.element.style.marginLeft = `${margin}px`;
    }
  }
}
