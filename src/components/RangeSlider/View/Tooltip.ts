import { ThumbName } from "./Thumb";

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

  setTooltipText(text: string | number) {
    this.element.innerText = text.toString();
  }
}
