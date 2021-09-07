export default class Range {
  element: HTMLElement;

  constructor() {
    this.element = this.createRange();
  }

  // eslint-disable-next-line class-methods-use-this
  createRange(): HTMLElement {
    const range: HTMLElement = document.createElement('div');
    range.className = 'range-slider__range';

    return range;
  }

  setMarginFromBegin(margin: number | undefined, isVertical: boolean): void {
    if (margin === undefined) return;

    if (isVertical) {
      this.element.style.marginTop = `${margin}px`;
    } else {
      this.element.style.marginLeft = `${margin}px`;
    }
  }

  setMarginFromEnd(margin: number | undefined, isVertical: boolean): void {
    if (margin === undefined) return;

    if (isVertical) {
      this.element.style.marginBottom = `${margin}px`;
    } else {
      this.element.style.marginRight = `${margin}px`;
    }
  }
}
