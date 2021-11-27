/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { AbstractTooltip, ThumbName } from '../RangeSlider/types';
import { createElement } from '../lib/common';

export default class Tooltip extends AbstractTooltip {
  element: HTMLElement;

  constructor(private name: ThumbName) {
    super();
    this.name = name;
    this.element = createElement('div', `range-slider__tooltip_${this.name}`);
  }

  public setTooltipText(value: number): Tooltip {
    const roundedValue = Math.round(value);
    this.element.innerText = roundedValue.toString();
    return this;
  }
}
