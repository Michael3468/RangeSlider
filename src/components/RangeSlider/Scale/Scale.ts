/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import { ISettings, ISliderElement } from '../RangeSlider/types';
import {
  getMinMaxElementEdgesInPx,
  getElementLengthInPx,
  createElement,
  getOnePointInPx,
} from '../lib/common';

export default class Scale implements ISliderElement {
  element: HTMLElement;

  settings: ISettings | undefined;

  constructor() {
    this.element = createElement('div', 'range-slider__scale');
    this.settings = undefined;
    Scale.roundValueTo = Scale.roundValueTo.bind(this);
  }

  private createMark(marginFromBegin: number): HTMLElement {
    const mark = createElement('span', 'range-slider__scale-mark');

    if (this.settings?.isVertical) {
      mark.className += ' range-slider__scale-mark_vertical';
      mark.style.marginTop = `${marginFromBegin}px`;
    } else {
      mark.style.marginLeft = `${marginFromBegin}px`;
    }

    return mark;
  }

  private createMarkValue(value: number, marginFromBegin: number): HTMLElement {
    const markValue = createElement('div', 'range-slider__scale-mark-value');

    if (this.settings?.isVertical) {
      markValue.className += ' range-slider__scale-mark-value_vertical';
      markValue.style.marginTop = `${marginFromBegin}px`;
    } else {
      markValue.style.marginLeft = `${marginFromBegin}px`;
    }
    markValue.innerText = value.toString();

    return markValue;
  }

  private static roundValueTo(num: number, ceilToNumber: number): number {
    return Math.ceil(num / ceilToNumber) * ceilToNumber;
  }

  private getStepBetweenMarksInPx(
    lastMarkValueElement: HTMLElement,
    onePointInPx: number,
  ): number {
    const lastMarkValueSize: number = getElementLengthInPx(this.settings!, lastMarkValueElement);
    const lastMarkValueSizeInPoints: number = lastMarkValueSize / onePointInPx;
    const stepBetweenMarksInPoints: number = Scale.roundValueTo(lastMarkValueSizeInPoints, 10);
    return stepBetweenMarksInPoints * onePointInPx;
  }

  public createScaleMarks(settings: ISettings): Scale {
    this.settings = settings;
    // add first and last marks
    const { min, max } = getMinMaxElementEdgesInPx(settings, this);
    const scaleMaxPos = max - min;

    // add first mark
    this.element.appendChild(this.createMark(0));
    const firstMarkValueElement: HTMLElement = this
      .element.appendChild(this.createMarkValue(settings.min, 0));
    // add last mark
    this.element.appendChild(this.createMark(scaleMaxPos));
    const lastMarkValueElement: HTMLElement = this
      .element.appendChild(this.createMarkValue(settings.max, scaleMaxPos));

    const maxMarkValue = Scale.getMaxMarkValue(firstMarkValueElement, lastMarkValueElement);
    const onePointInPx: number = getOnePointInPx(settings, this.element);
    const stepBetweenMarksInPx: number = this
      .getStepBetweenMarksInPx(maxMarkValue, onePointInPx);
    // create marks on scale
    let markPos: number = 0;
    const minPosInPx: number = settings.min * onePointInPx;

    while (markPos < scaleMaxPos) {
      if (markPos > 0) {
        this.element.appendChild(this.createMark(markPos));

        const currentValueInPoints: number = (minPosInPx + markPos) / onePointInPx;
        const markValue: number = Math.round(currentValueInPoints);
        this.element.appendChild(this.createMarkValue(markValue, markPos));
      }
      markPos += stepBetweenMarksInPx;
    }
    // after mark values was created show/hide before last mark value
    this.showHideBeforeLastMarkValue(lastMarkValueElement);
    return this;
  }

  private static getMaxMarkValue(firstMV: HTMLElement, lastMV: HTMLElement): HTMLElement {
    const firstSize = firstMV.getBoundingClientRect().width;
    const lastSize = lastMV.getBoundingClientRect().width;
    return firstSize > lastSize ? firstMV : lastMV;
  }

  private showHideBeforeLastMarkValue = (lastMV: HTMLElement): Scale => {
    const beforeLastMarkValueElement = this.element.lastChild as HTMLElement;
    let beforeLastEdge: number;
    let lastEdge: number;

    if (!this.settings?.isVertical) {
      beforeLastEdge = beforeLastMarkValueElement.getBoundingClientRect().right;
      lastEdge = lastMV.getBoundingClientRect().left;
    } else {
      beforeLastEdge = beforeLastMarkValueElement.getBoundingClientRect().bottom;
      lastEdge = lastMV.getBoundingClientRect().top;
    }

    if (beforeLastEdge > lastEdge) {
      beforeLastMarkValueElement.classList.add('hidden');
    } else {
      beforeLastMarkValueElement.classList.remove('hidden');
    }
    return this;
  }
}
