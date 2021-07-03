export class Range {
  element: HTMLElement;

  constructor() {
    this.element = this.createRange();
  }

  createRange(): HTMLElement {
    let range: HTMLElement = document.createElement('div');
    range.className = 'range-slider__range';

    return range;
  }

  setMarginLeft(margin: number): void {
    this.element.style.marginLeft = margin + '%';
  }

  setMarginRight(margin: number): void {
    this.element.style.marginRight = margin + '%';
  }
}
