/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable class-methods-use-this */
import { ISettings } from '../RangeSlider/RangeSlider';

export default class Scale {
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

  private createMark(marginLeft: number): HTMLElement {
    const mark = document.createElement('span');
    mark.className = 'range-slider__scale-mark';
    mark.style.marginLeft = `${marginLeft}%`;

    return mark;
  }

  private createMarkValue(value: number, marginLeft: number): HTMLElement {
    if (!this.settings) {
      throw new Error("'this.settings' is undefined !");
    }

    const markValue = document.createElement('span');
    markValue.className = 'range-slider__scale-mark-value';
    if (this.settings.isVertical) {
      markValue.className += ' range-slider__scale-mark-value_vertical';
    }
    markValue.style.marginLeft = `${marginLeft}%`;
    markValue.innerText = value.toString();

    return markValue;
  }

  private roundToCeil10(n: number): number {
    return Math.ceil(n / 10) * 10;
  }

  public createScaleMarks(settings: ISettings) {
    this.settings = settings;
    const scaleSizeInPx: number = this.settings.isVertical
      ? this.element.getBoundingClientRect().height
      : this.element.getBoundingClientRect().width;
    const scaleWidthPercent: number = scaleSizeInPx / 100;
    const scaleLengthInPoints: number = settings.max - settings.min;
    const onePointInPx: number = scaleSizeInPx / scaleLengthInPoints;

    let markPos: number = settings.min;
    // add first mark
    this.element.appendChild(this.createMark(0));
    this.element.appendChild(this.createMarkValue(markPos, 0));

    // add last mark
    this.element.appendChild(this.createMark(100));
    const lastMarkValue = this.element.appendChild(this.createMarkValue(settings.max, 100));
    const lastMarkValueRect = lastMarkValue.getBoundingClientRect();

    const lastMarkValueSize = settings.isVertical
      ? lastMarkValueRect.height
      : lastMarkValueRect.width;

    // lastMarkValueSize in scale points
    const stepBetweenMarks: number = this.roundToCeil10(lastMarkValueSize / onePointInPx);

    while (markPos < settings.max) {
      const roundedMarkValue: number = this.roundToCeil10(markPos);
      const marginInPercents: number =
        ((roundedMarkValue - settings.min) * onePointInPx) / scaleWidthPercent;

      if (marginInPercents > 0 && marginInPercents < 100) {
        this.element.appendChild(this.createMark(marginInPercents));

        // add markValue when it fits
        if (roundedMarkValue + stepBetweenMarks <= settings.max) {
          this.element.appendChild(this.createMarkValue(roundedMarkValue, marginInPercents));
        }
      }

      markPos += stepBetweenMarks;
    }
  }
}
