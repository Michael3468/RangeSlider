/* eslint-disable operator-linebreak */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable class-methods-use-this */
import { ISettings, ISliderElement } from '../RangeSlider/types';
import { getMinMaxElementEdgesInPx, getElementLengthInPx, createElement } from '../lib/common';

export default class Scale implements ISliderElement {
  element: HTMLElement;

  settings: ISettings | undefined;

  constructor() {
    this.element = createElement('div', 'range-slider__scale');
    this.settings = undefined;
    this.roundValueTo = this.roundValueTo.bind(this);
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

  private roundValueTo(num: number, ceilToNumber: number): number {
    return Math.ceil(num / ceilToNumber) * ceilToNumber;
  }

  public createScaleMarks(settings: ISettings) {
    this.settings = settings;

    // add first and last marks
    const { min, max } = getMinMaxElementEdgesInPx(settings, this);
    const scaleMaxPos = max - min;

    // add first mark
    this.element.appendChild(this.createMark(0));
    this.element.appendChild(this.createMarkValue(settings.min, 0));
    // add last mark
    this.element.appendChild(this.createMark(scaleMaxPos));
    const lastMarkValueElement: HTMLElement =
      this.element.appendChild(this.createMarkValue(settings.max, scaleMaxPos));

    const onePointInPx = this.getOnePointInPx(this.settings, this.element);
    const stepBetweenMarksInPx =
      this.getStepBetweenMarksInPx(this.settings, lastMarkValueElement, onePointInPx);

    // create marks on scale
    let markPos: number = 0;
    const minPosInPx = settings.min * onePointInPx;

    while (markPos < scaleMaxPos) {
      const lastMarkPos = markPos + stepBetweenMarksInPx;
      const isMarkValueFits = lastMarkPos < scaleMaxPos && lastMarkPos <= settings.max;

      if (markPos > 0) {
        this.element.appendChild(this.createMark(markPos));

        if (isMarkValueFits) {
          const currentValueInPoints = (minPosInPx + markPos) / onePointInPx;
          const value = this.roundValueTo(currentValueInPoints, 1);

          this.element.appendChild(this.createMarkValue(value, markPos));
        }
      }
      markPos += stepBetweenMarksInPx;
    }
  }

  private getOnePointInPx(settings: ISettings, element: HTMLElement) {
    const scaleLengthInPx: number = getElementLengthInPx(settings, element);
    const scaleLengthInPoints: number = settings.max - settings.min;
    return scaleLengthInPx / scaleLengthInPoints;
  }

  private getStepBetweenMarksInPx(
    settings: ISettings,
    lastMarkValueElement: HTMLElement,
    onePointInPx: number,
  ): number {
    const lastMarkValueSize: number = getElementLengthInPx(settings, lastMarkValueElement);
    const lastMarkValueSizeInPoints: number = lastMarkValueSize / onePointInPx;
    const stepBetweenMarksInPoints: number = this.roundValueTo(lastMarkValueSizeInPoints, 10);
    return stepBetweenMarksInPoints * onePointInPx;
  }
}
