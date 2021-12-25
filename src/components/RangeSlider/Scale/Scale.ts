/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import { AbstractScale, ISettings } from '../RangeSlider/types';
import {
  getMinMaxElementEdgesInPx,
  getElementLengthInPx,
  createElement,
  getOnePointInPx,
  getDigitsAfterPoint,
} from '../lib/common';

class Scale extends AbstractScale {
  element: HTMLElement;

  private settings: ISettings | undefined;

  constructor() {
    super();
    this.element = createElement('div', 'range-slider__scale');
    this.settings = undefined;
  }

  public createScaleMarks(settings: ISettings): Scale {
    this.settings = settings;
    const { min, max } = getMinMaxElementEdgesInPx(settings, this);
    const scaleMaxPos = max - min;

    // add first mark
    this.element.appendChild(this.createMark(0));
    this.element.appendChild(this.createMarkValue(settings.min, 0));

    const scaleLength: number = getElementLengthInPx(settings, this.element);
    const stepBetweenMarksInPx: number = this.getStepBetweenMarksInPx(scaleLength);

    let markPos: number = stepBetweenMarksInPx;
    const onePointInPx: number = getOnePointInPx(this.settings, this.element);
    const digitsAfterPoint = getDigitsAfterPoint(this.settings);

    while (markPos < scaleMaxPos) {
      this.element.appendChild(this.createMark(markPos));

      const currentValueInPoints: number = Number((settings.min + markPos / onePointInPx)
        .toFixed(digitsAfterPoint + 1));

      this.element.appendChild(this.createMarkValue(currentValueInPoints, markPos));
      markPos += stepBetweenMarksInPx;
    }

    // add last mark
    this.element.appendChild(this.createMark(scaleMaxPos));
    this.element.appendChild(this.createMarkValue(settings.max, scaleMaxPos));

    const markValuesArr = this.getElementChilds();

    markValuesArr.forEach((markValue, index, arr) => {
      let currentMark: number = 0;
      let nextMark: number | undefined = 0;

      if (!settings.isVertical) {
        currentMark = markValue.getBoundingClientRect().right;
      } else {
        currentMark = markValue.getBoundingClientRect().bottom;
      }

      for (let i = index; i < arr.length - 1; i += 1) {
        nextMark = settings.isVertical
          ? arr[i + 1]?.getBoundingClientRect().top
          : arr[i + 1]?.getBoundingClientRect().left;

        if (nextMark && (currentMark + 10) > nextMark) {
          if ((i + 1) < arr.length - 1) {
            arr[i + 1]?.classList.add('hidden');
          } else {
            markValue.classList.add('hidden');
          }
        } else {
          break;
        }
      }
    });

    return this;
  }

  private getElementChilds(): Element[] {
    return Array
      .from(this.element.children)
      .filter((child) => child.classList.contains('range-slider__scale_mark_value'));
  }

  private createMark(marginFromBegin: number): HTMLElement {
    const mark = createElement('span', 'range-slider__scale_mark');

    if (this.settings?.isVertical) {
      mark.className += ' range-slider__scale_mark_vertical';
      mark.style.marginTop = `${marginFromBegin}px`;
    } else {
      mark.style.marginLeft = `${marginFromBegin}px`;
    }

    return mark;
  }

  private createMarkValue(value: number, marginFromBegin: number): HTMLElement {
    const markValue = createElement('div', 'range-slider__scale_mark_value');

    if (this.settings?.isVertical) {
      markValue.className += ' range-slider__scale_mark_value_vertical';
      markValue.style.marginTop = `${marginFromBegin}px`;
    } else {
      markValue.style.marginLeft = `${marginFromBegin}px`;
    }
    markValue.innerText = value.toString();

    return markValue;
  }

  // eslint-disable-next-line class-methods-use-this
  private getStepBetweenMarksInPx(scaleLength: number): number {
    const pixelsBetweenMarks = 20;
    const marks = Math.floor(scaleLength / pixelsBetweenMarks);

    return scaleLength / marks;
  }
}

export default Scale;
