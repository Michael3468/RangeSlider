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

  setMarginLeft(margin: number | undefined): void {
    if (margin === undefined) return;
    this.element.style.marginLeft = margin + '%';
  }

  setMarginRight(margin: number | undefined): void {
    if (margin === undefined) return;
    this.element.style.marginRight = margin + '%';
  }
}
