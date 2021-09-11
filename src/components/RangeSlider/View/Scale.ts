/* eslint-disable operator-linebreak */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable class-methods-use-this */
import { ISettings, ISliderElement } from '../RangeSlider/types';
import { getMinMaxElementEdgesInPx, getElementLengthInPx } from '../lib/common';

export default class Scale implements ISliderElement {
  element: HTMLElement;

  settings: ISettings | undefined;

  constructor() {
    this.element = this.createScale();
    this.settings = undefined;
  }

  private createScale(): HTMLElement {
    const scale = document.createElement('div');
    scale.className = 'range-slider__scale';

    return scale;
  }

  private createMark(marginFromBegin: number): HTMLElement {
    const mark = document.createElement('span');

    mark.className = 'range-slider__scale-mark';
    if (this.settings?.isVertical) {
      mark.className += ' range-slider__scale-mark_vertical';
    }

    if (this.settings?.isVertical) {
      mark.style.marginTop = `${marginFromBegin}px`;
    } else {
      mark.style.marginLeft = `${marginFromBegin}px`;
    }

    return mark;
  }

  private createMarkValue(value: number, marginFromBegin: number): HTMLElement {
    if (!this.settings) {
      throw new Error("'this.settings' is undefined !");
    }

    const markValue = document.createElement('span');

    markValue.className = 'range-slider__scale-mark-value';
    if (this.settings.isVertical) {
      markValue.className += ' range-slider__scale-mark-value_vertical';
    }

    if (this.settings.isVertical) {
      markValue.style.marginTop = `${marginFromBegin}px`;
    } else {
      markValue.style.marginLeft = `${marginFromBegin}px`;
    }
    markValue.innerText = value.toString();

    return markValue;
  }

  // TODO rename roundToCeil to roundTo
  private roundToCeil(n: number, ceilTo: number): number {
    return Math.ceil(n / ceilTo) * ceilTo;
  }

  public createScaleMarks(settings: ISettings) {
    this.settings = settings;

    const scaleLengthInPx: number = getElementLengthInPx(this.settings, this.element);
    const scaleLengthInPoints: number = settings.max - settings.min;
    const onePointInPx: number = scaleLengthInPx / scaleLengthInPoints;

    // add first and last marks
    const { min, max } = getMinMaxElementEdgesInPx(settings, this);
    const scaleMaxPos = max - min;
    let markPos: number = 0;
    // add first mark
    this.element.appendChild(this.createMark(0));
    this.element.appendChild(this.createMarkValue(settings.min, markPos));
    // add last mark
    this.element.appendChild(this.createMark(scaleMaxPos));
    const lastMarkValue: HTMLElement =
      this.element.appendChild(this.createMarkValue(settings.max, scaleMaxPos));

    // step between marks
    const lastMarkValueSize: number = getElementLengthInPx(settings, lastMarkValue);
    const lastMarkValueSizeInPoints: number = lastMarkValueSize / onePointInPx;
    const stepBetweenMarksInPoints: number = this.roundToCeil(lastMarkValueSizeInPoints, 10);
    const stepBetweenMarksInPx = stepBetweenMarksInPoints * onePointInPx;
    const minPosInPx = settings.min * onePointInPx;
    // create marks on scale
    while (markPos < scaleMaxPos) {
      const lastMarkPos = markPos + stepBetweenMarksInPx;
      const isMarkValueFits = lastMarkPos < scaleMaxPos && lastMarkPos <= settings.max;

      if (markPos > 0) {
        this.element.appendChild(this.createMark(markPos));

        if (isMarkValueFits) {
          const value = this.roundToCeil((minPosInPx + markPos) / onePointInPx, 1);
          this.element.appendChild(this.createMarkValue(value, markPos));
        }
      }
      markPos += stepBetweenMarksInPx;
    }
  }
}
