/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable class-methods-use-this */
import { ISettings } from '../RangeSlider/RangeSlider';

export default class Scale {
  element: HTMLElement;

  constructor() {
    this.element = this.createScale();
  }

  private createScale(): HTMLElement {
    const scale = document.createElement('div');
    scale.className = 'range-slider__scale';

    return scale;
  }

  private createMark(marginLeft: number): HTMLElement {
    const mark = document.createElement('span');
    mark.className = 'range-slider__scale-mark';
    mark.style.marginLeft = `${marginLeft}%`;

    return mark;
  }

  private createMarkValue(value: number, marginLeft: number): HTMLElement {
    const markValue = document.createElement('span');
    markValue.className = 'range-slider__scale-mark-value';
    markValue.style.marginLeft = `${marginLeft}%`;
    markValue.innerText = value.toString();

    return markValue;
  }

  private roundToCeil10(n: number): number {
    return Math.ceil(n / 10) * 10;
  }

  public createScaleMarks(settings: ISettings) {
    const scaleWidthInPx: number = this.element.getBoundingClientRect().width;
    const scaleWidthPercent: number = scaleWidthInPx / 100;
    const scaleLengthInPoints: number = settings.max - settings.min;
    const onePointInPx: number = scaleWidthInPx / scaleLengthInPoints;
    const MIN_STEP_BETWEEN_MARKS_IN_PX: number = 20;
    const stepBetweenMarks: number = this.roundToCeil10(
      MIN_STEP_BETWEEN_MARKS_IN_PX / onePointInPx,
    );

    let markStep: number = settings.min;
    this.element.appendChild(this.createMark(0));
    this.element.appendChild(this.createMarkValue(markStep, 0));

    while (markStep < settings.max) {
      const roundMarkStep: number = this.roundToCeil10(markStep);
      const marginPercent:
        number = ((roundMarkStep - settings.min) * onePointInPx) / scaleWidthPercent;

      if (marginPercent !== 0) {
        // add marks on the scale
        this.element.appendChild(this.createMark(marginPercent));
        // add values on the scale
        this.element.appendChild(this.createMarkValue(roundMarkStep, marginPercent));
      }

      markStep += stepBetweenMarks;
    }

    this.element.appendChild(this.createMarkValue(settings.max, 100));
    this.element.appendChild(this.createMark(100));
  }
}
