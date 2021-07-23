/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-unresolved
import { ThumbName } from './Thumb';

export default class Tooltip {
  element: HTMLElement;

  constructor(private name: ThumbName) {
    this.element = this.createTooltip();
    this.name = name;
  }

  createTooltip(): HTMLElement {
    const className: string = `range-slider__tooltip_${this.name}`;

    const tooltip: HTMLElement = document.createElement('div');
    tooltip.className = className;

    return tooltip;
  }

  setTooltipText(value: number) {
    const roundedValue = Math.round(value);
    this.element.innerText = roundedValue.toString();
  }
}
