/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { AbstractTooltip, ISettings, ThumbName } from '../RangeSlider/types';
import { createElement, getMultiplierForRounding } from '../lib/common';

export default class Tooltip extends AbstractTooltip {
  element: HTMLElement;

  constructor(private name: ThumbName) {
    super();
    this.name = name;
    this.element = createElement('div', `range-slider__tooltip_${this.name}`);
  }

  public setTooltipText(value: number, settings: ISettings): Tooltip {
    const n = (settings.step < 1)
      ? getMultiplierForRounding(settings)
      : 1;

    const roundedValue = value < settings.max
      ? Math.round(value * n) / n
      : settings.max;

    this.element.innerText = roundedValue.toString();
    return this;
  }
}
