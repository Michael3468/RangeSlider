import { createElement, getDigitsAfterPoint } from '../lib/common';

import { AbstractTooltip, IModelSettings, ThumbName } from '../RangeSlider/types';

class Tooltip extends AbstractTooltip {
  private name: ThumbName;

  element: HTMLElement;

  constructor(name: ThumbName) {
    super();
    this.name = name;
    this.element = createElement('div', `tooltip-${this.name}`);
  }

  public setTooltipText(value: number, settings: IModelSettings): Tooltip {
    const roundedValue = value < settings.max
      ? value.toFixed(getDigitsAfterPoint(settings))
      : (settings.max).toFixed(getDigitsAfterPoint(settings));

    this.element.innerText = roundedValue.toString();
    return this;
  }
}

export default Tooltip;
