import {
  getMinMaxElementEdgesInPx,
  createElement,
  getOnePointInPx,
  getDigitsAfterPoint,
  getMinStep,
} from '../lib/common';

import { AbstractScale, ISettings } from '../RangeSlider/types';

const defaultInitSettings: ISettings = {
  min: 0,
  max: 100,
  from: 30,
  to: 70,
  step: 1,

  // TODO delete or move to defaultViewSettings
  // range: true,
  // scale: false,
  // tooltips: true,
  // vertical: false,
  // confpanel: false,
  // bar: true,
};

const defaultViewSettings: ISettings = {
  range: true,
  scale: false,
  tooltips: true,
  vertical: false,
  confpanel: false,
  bar: true,
};

class Scale extends AbstractScale {
  element: HTMLElement = createElement('div', 'scale');

  private settings: ISettings = defaultInitSettings;

  private viewSettings: ISettings = defaultViewSettings;

  public createScaleMarks(settings: ISettings, viewSettings: ISettings): Scale {
    this.settings = settings;
    this.viewSettings = viewSettings;

    // add first mark
    this.element.appendChild(this.createMark(0));
    this.element.appendChild(this.createMarkValue(settings.min, 0));

    const onePointInPx: number = getOnePointInPx(this.settings, this.viewSettings, this.element);
    const MIN_STEP_BETWEEN_MARKS_IN_PX = 10;
    const stepBetweenMarks: number = this.getStep(onePointInPx, MIN_STEP_BETWEEN_MARKS_IN_PX);

    let markPos: number = stepBetweenMarks;

    const { min, max } = getMinMaxElementEdgesInPx(viewSettings, this);
    const scaleMaxPos = max - min;

    while (markPos < scaleMaxPos) {
      this.element.appendChild(this.createMark(markPos));

      const currentValueInPoints: number = this.getCurrentValueInPoints(markPos, onePointInPx);

      this.element.appendChild(this.createMarkValue(currentValueInPoints, markPos));
      markPos += stepBetweenMarks;
    }

    // add last mark
    this.element.appendChild(this.createMark(scaleMaxPos));
    this.element.appendChild(this.createMarkValue(settings.max, scaleMaxPos));

    const markValuesArr = this.getElementChilds();
    this.hideOverlappedMarks(markValuesArr);

    return this;
  }

  private getElementChilds(): Element[] {
    return Array
      .from(this.element.children)
      .filter((child) => child.classList.contains('scale__mark-value'));
  }

  private createMark(marginFromBegin: number): HTMLElement {
    const mark = createElement('span', 'scale__mark');

    if (this.viewSettings.vertical) {
      mark.className += ' scale__mark_vertical';
      mark.style.marginTop = `${marginFromBegin}px`;
    } else {
      mark.style.marginLeft = `${marginFromBegin}px`;
    }

    return mark;
  }

  private createMarkValue(value: number, marginFromBegin: number): HTMLElement {
    const markValue = createElement('div', 'scale__mark-value');

    if (this.viewSettings.vertical) {
      markValue.className += ' scale__mark-value_vertical';
      markValue.style.marginTop = `${marginFromBegin}px`;
    } else {
      markValue.style.marginLeft = `${marginFromBegin}px`;
    }
    markValue.innerText = value.toString();

    return markValue;
  }

  private getCurrentStep(): number {
    let currentStep = 0;
    if (this.settings.step < 1) {
      currentStep = this.settings.step / getMinStep(this.settings);
    } else {
      currentStep = this.settings.step;
    }
    return currentStep;
  }

  private getStepBetweenMarks(onePointInPx: number) {
    return this.settings.step < 1
      ? onePointInPx
      : onePointInPx * this.settings.step;
  }

  private getStep(onePointInPx: number, MIN_STEP_BETWEEN_MARKS_IN_PX: number): number {
    let stepBetweenMarks = 0;
    if (onePointInPx < MIN_STEP_BETWEEN_MARKS_IN_PX) {
      // get minimum count of steps which sum in pixels bigger than MIX_STEP
      const minStepsBetweenMarksInPoints = Math.ceil(MIN_STEP_BETWEEN_MARKS_IN_PX / onePointInPx);

      const currentStep: number = this.getCurrentStep();
      const stepsBetweenMarksInPoints = Math.ceil(minStepsBetweenMarksInPoints / currentStep);
      stepBetweenMarks = currentStep * stepsBetweenMarksInPoints * onePointInPx;
    } else {
      stepBetweenMarks = this.getStepBetweenMarks(onePointInPx);
    }

    return stepBetweenMarks;
  }

  private getCurrentValueInPoints(markPos: number, onePointInPx: number) {
    return (this.settings.step < 1)
      ? Number(
        (this.settings.min + ((markPos / onePointInPx) * this.settings.step))
          .toFixed(getDigitsAfterPoint(this.settings)),
      )
      : Number(
        (this.settings.min + (markPos / onePointInPx))
          .toFixed(getDigitsAfterPoint(this.settings)),
      );
  }

  private hideOverlappedMarks(markValuesArr: Element[]) {
    markValuesArr.forEach((markValue, index, arr) => {
      let currentMark = 0;
      let nextMark: number | undefined = 0;

      if (!this.viewSettings.vertical) {
        currentMark = markValue.getBoundingClientRect().right;
      } else {
        currentMark = markValue.getBoundingClientRect().bottom;
      }

      for (let i = index; i < arr.length - 1; i += 1) {
        nextMark = this.viewSettings.vertical
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
  }
}

export default Scale;
