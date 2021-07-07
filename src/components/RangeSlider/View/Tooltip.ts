type TooltipName = 'from' | 'to';

export class Tooltip {
  element: HTMLElement;

  constructor(private _name: TooltipName) {
    this.element = this.createTooltip();
  }

  createTooltip(): HTMLElement {
    let className = `range-slider__tooltip_${this._name}`;

    let tooltip: HTMLElement = document.createElement('div');
    tooltip.className = className;

    return tooltip;
  }

  setTooltipText(text: string | number) {
    this.element.innerText = text.toString();
  }
}
