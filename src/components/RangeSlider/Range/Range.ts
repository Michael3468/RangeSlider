/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { createElement } from '../lib/common';
import { AbstractRange } from '../RangeSlider/types';

class Range extends AbstractRange {
  element: HTMLElement;

  constructor() {
    super();
    this.element = createElement('div', 'range-slider__range');
  }

  public setMarginFromBegin(margin: number, isVertical: boolean): Range {
    if (isVertical) {
      this.element.style.marginTop = `${margin}px`;
      this.element.style.marginLeft = '0px';
    } else {
      this.element.style.marginTop = '0px';
      this.element.style.marginLeft = `${margin}px`;
    }
    return this;
  }

  public setMarginFromEnd(margin: number, isVertical: boolean): Range {
    if (isVertical) {
      this.element.style.marginRight = '0px';
      this.element.style.marginBottom = `${margin}px`;
    } else {
      this.element.style.marginRight = `${margin}px`;
      this.element.style.marginBottom = '0px';
    }
    return this;
  }
}

export default Range;
