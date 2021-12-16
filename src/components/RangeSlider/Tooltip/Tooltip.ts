/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { AbstractTooltip, ISettings, ThumbName } from '../RangeSlider/types';
import { createElement, getFixedToNumber } from '../lib/common';

export default class Tooltip extends AbstractTooltip {
  element: HTMLElement;

  constructor(private name: ThumbName) {
    super();
    this.name = name;
    this.element = createElement('div', `range-slider__tooltip_${this.name}`);
  }

  public setTooltipText(value: number, settings: ISettings): Tooltip {
    const roundedValue = value < settings.max
      ? value.toFixed(getFixedToNumber(settings))
      : settings.max;

    this.element.innerText = roundedValue.toString();
    return this;
  }
}
