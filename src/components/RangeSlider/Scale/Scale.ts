import {
  getMinMaxElementEdgesInPx,
  createElement,
  getOnePointInPx,
  getDigitsAfterPoint,
  getMinStep,
} from '../lib/common';

import { AbstractScale, IModelSettings, IViewSettings } from '../RangeSlider/types';

const defaultInitSettings: IModelSettings = {
  min: 0,
  max: 100,
  from: 30,
  to: 70,
  step: 1,

  stepInPercents: 0,
  currentPos: 0,
  curPosInPoints: 0,
  posWithStepInPercents: 0,
};

const defaultViewSettings: IViewSettings = {
  range: true,
  scale: false,
  tooltips: true,
  vertical: false,
  confpanel: false,
  bar: true,

  thumbMarginFrom: 0,
  thumbMarginTo: 0,
  rangeMarginFrom: 0,
  rangeMarginTo: 0,
};

class Scale extends AbstractScale {
  element: HTMLElement = createElement('div', 'scale');

  private modelSettings: IModelSettings = defaultInitSettings;

  private viewSettings: IViewSettings = defaultViewSettings;

  public createScaleMarks(modelSettings: IModelSettings, viewSettings: IViewSettings): Scale {
    this.modelSettings = modelSettings;
    this.viewSettings = viewSettings;

    // add first mark
    this.element.appendChild(this.createMark(0));
    this.element.appendChild(this.createMarkValue(modelSettings.min, 0));

    const onePointInPx: number = getOnePointInPx(
      this.modelSettings,
      this.viewSettings,
      this.element,
    );
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
    this.element.appendChild(this.createMarkValue(modelSettings.max, scaleMaxPos));

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
    if (this.modelSettings.step < 1) {
      currentStep = this.modelSettings.step / getMinStep(this.modelSettings);
    } else {
      currentStep = this.modelSettings.step;
    }
    return currentStep;
  }

  private getStepBetweenMarks(onePointInPx: number) {
    return this.modelSettings.step < 1
      ? onePointInPx
      : onePointInPx * this.modelSettings.step;
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
    return (this.modelSettings.step < 1)
      ? Number(
        (this.modelSettings.min + ((markPos / onePointInPx) * this.modelSettings.step))
          .toFixed(getDigitsAfterPoint(this.modelSettings)),
      )
      : Number(
        (this.modelSettings.min + (markPos / onePointInPx))
          .toFixed(getDigitsAfterPoint(this.modelSettings)),
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
