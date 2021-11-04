/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Tooltip from '../Tooltip/Tooltip';
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
      this.element.style.marginLeft = '0px';
    } else {
      this.element.style.marginTop = '0px';
      this.element.style.marginLeft = `${margin}px`;
    }
    return this;
  }
}
