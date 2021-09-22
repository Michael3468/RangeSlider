/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Tooltip from './Tooltip';
import { ThumbName, ISettings } from '../RangeSlider/types';
import { createElement } from '../lib/common';

export default class Thumb {
  element: HTMLElement;
  tooltip: Tooltip;

  constructor(private name: ThumbName) {
    this.name = name;
    this.tooltip = new Tooltip(this.name);

    this.element = createElement(
      'div',
      `range-slider__thumb_${this.name}`,
      this.tooltip.element,
    );
  }

  setMargin(margin: number, settings: ISettings): Thumb {
    if (settings.isVertical) {
      this.element.style.marginTop = `${margin}px`;
    } else {
      this.element.style.marginLeft = `${margin}px`;
    }
    return this;
  }
}
