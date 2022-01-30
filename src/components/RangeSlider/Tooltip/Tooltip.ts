import { AbstractTooltip, ISettings, ThumbName } from '../RangeSlider/types';
import { createElement, getDigitsAfterPoint } from '../lib/common';

class Tooltip extends AbstractTooltip {
  element: HTMLElement;

  constructor(private name: ThumbName) {
    super();
    this.name = name;
    this.element = createElement('div', `tooltip_${this.name}`);
  }

  public setTooltipText(value: number, settings: ISettings): Tooltip {
    const roundedValue = value < settings.max
      ? value.toFixed(getDigitsAfterPoint(settings))
      : (settings.max).toFixed(getDigitsAfterPoint(settings));

    this.element.innerText = roundedValue.toString();
    return this;
  }
}

export default Tooltip;
