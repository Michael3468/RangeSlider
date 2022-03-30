import { AbstractScale, ISettings } from '../RangeSlider/types';
import {
  getMinMaxElementEdgesInPx,
  createElement,
  getOnePointInPx,
  getDigitsAfterPoint,
} from '../lib/common';

class Scale extends AbstractScale {
  element: HTMLElement;

  private settings: ISettings | undefined;

  constructor() {
    super();
    this.element = createElement('div', 'scale');
    this.settings = undefined;
  }

  public createScaleMarks(settings: ISettings): Scale {
    this.settings = settings;
    const { min, max } = getMinMaxElementEdgesInPx(settings, this);
    const scaleMaxPos = max - min;

    // add first mark
    this.element.appendChild(this.createMark(0));
    this.element.appendChild(this.createMarkValue(settings.min, 0));

    const onePointInPx: number = getOnePointInPx(this.settings, this.element);
    const MIN_STEP_BETWEEN_MARKS_IN_PX: number = 10;
    let stepBetweenMarks: number = 0;
    let markPos: number = 0;

    if (onePointInPx < MIN_STEP_BETWEEN_MARKS_IN_PX) {
      // get minimum count of steps which sum in pixels bigger than MIX_STEP
      const minStepsBetweenMarksInPoints = Math.ceil(MIN_STEP_BETWEEN_MARKS_IN_PX / onePointInPx);

      // if step < 1 devide it to minstep, example 0.005/0.001 = 5
      let currentStep: number = 0;
      if (this.settings.step < 1) {
        currentStep = this.settings.step / this.getMinStep(this.settings);
      } else {
        currentStep = this.settings.step;
      }

      let stepsBetweenMarksInPoints = Math.ceil(minStepsBetweenMarksInPoints / currentStep);
      stepBetweenMarks = currentStep * stepsBetweenMarksInPoints * onePointInPx;
    } else {
      stepBetweenMarks = this.settings.step < 1
        ? onePointInPx
        : onePointInPx * this.settings.step;
    }

    const digitsAfterPoint = getDigitsAfterPoint(this.settings);
    markPos = stepBetweenMarks;

    while (markPos < scaleMaxPos) {
      this.element.appendChild(this.createMark(markPos));

      let currentValueInPoints: number = (settings.step < 1)
        ? Number(
            (settings.min + (markPos / onePointInPx * settings.step))
              .toFixed(digitsAfterPoint)
          )
        : Number(
            (settings.min + (markPos / onePointInPx))
              .toFixed(digitsAfterPoint)
        );

      this.element.appendChild(this.createMarkValue(currentValueInPoints, markPos));
      markPos += stepBetweenMarks;
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
      .filter((child) => child.classList.contains('scale_mark_value'));
  }

  private createMark(marginFromBegin: number): HTMLElement {
    const mark = createElement('span', 'scale_mark');

    if (this.settings?.isVertical) {
      mark.className += ' scale_mark_vertical';
      mark.style.marginTop = `${marginFromBegin}px`;
    } else {
      mark.style.marginLeft = `${marginFromBegin}px`;
    }

    return mark;
  }

  private createMarkValue(value: number, marginFromBegin: number): HTMLElement {
    const markValue = createElement('div', 'scale_mark_value');

    if (this.settings?.isVertical) {
      markValue.className += ' scale_mark_value_vertical';
      markValue.style.marginTop = `${marginFromBegin}px`;
    } else {
      markValue.style.marginLeft = `${marginFromBegin}px`;
    }
    markValue.innerText = value.toString();

    return markValue;
  }

  private getMinStep(settings: ISettings):number {
    let num = settings.step;

    return num < 1
      ? 1 / 10 ** (num.toString().length - 2)
      : num
  }
}

export default Scale;
