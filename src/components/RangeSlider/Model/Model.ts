/* eslint-disable no-unused-expressions */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings } from '../RangeSlider/RangeSlider';
import { ISliderElements } from '../View/View';
import { ThumbName } from '../View/Thumb';

type TSliderElement = HTMLElement | null | undefined;

export class Model {
  minValue: number;
  maxValue: number;
  isTwoRunners: boolean;
  fromValue: number;
  toValue: number;

  slider: TSliderElement;
  from: TSliderElement;
  to: TSliderElement;
  range: TSliderElement;

  rangeRightMargin: number;
  rangeLeftMargin: number;
  thumbFromMargin: number;
  thumbToMargin: number;

  thumbFromTooltip: number;
  thumbToTooltip: number;

  settings: ISettings;

  constructor(settings: ISettings) {
    // default options
    this.minValue = settings.min;
    this.maxValue = this.getMaxValue(settings);
    this.isTwoRunners = settings.isTwoRunners;

    if (settings.isTwoRunners === true) {
      this.fromValue = this.getThumbValue(settings, 'from');
    } else {
      this.fromValue = this.minValue;
    }
    this.toValue = this.getThumbValue(settings, 'to');

    // sliderElements
    this.slider;
    this.from;
    this.to;
    this.range;

    this.beginSliding = this.beginSliding.bind(this);
    this.stopSliding = this.stopSliding.bind(this);

    this.settings = settings;

    // margins
    this.rangeRightMargin = 0;
    this.rangeLeftMargin = 0;
    this.thumbFromMargin = 0;
    this.thumbToMargin = 0;

    // tooltips values
    this.thumbFromTooltip = 0;
    this.thumbToTooltip = 0;

    this.initRangeSliderMargins();
  }

  private getThumbValue(settings: ISettings, thumbName: ThumbName): number {
    const value = thumbName === 'from' ? settings.fromValue : settings.toValue;

    if (this.minValue > value) {
      return this.minValue;
    }
    if (this.maxValue < value) {
      return this.maxValue;
    }
    return value;
  }

  private getMaxValue(settings: ISettings): number {
    if (this.minValue > settings.max) {
      this.maxValue = this.minValue + 1; // TODO ???
      return this.maxValue;
    }
    return settings.max;
  }

  private initRangeSliderMargins(): void {
    const rangeLength = this.settings.max - this.settings.min;
    const rangePercent = rangeLength / 100;

    this.rangeRightMargin = (this.settings.max - this.settings.toValue) / rangePercent;
    this.rangeLeftMargin = (this.settings.fromValue - this.settings.min) / rangePercent;
    this.thumbFromMargin = this.rangeLeftMargin;
    this.thumbToMargin = 100 - this.rangeRightMargin;

    // this
    this.thumbFromTooltip = this.thumbFromMargin * rangePercent + this.settings.min;
    this.thumbToTooltip = this.thumbToMargin * rangePercent + this.settings.min;
  }

  public getSettings(): ISettings {
    return {
      // settings
      min: this.minValue,
      max: this.maxValue,
      isTwoRunners: this.isTwoRunners,
      fromValue: this.fromValue,
      toValue: this.toValue,

      // margins
      rangeRightMargin: this.rangeRightMargin,
      rangeLeftMargin: this.rangeLeftMargin,
      thumbFromMargin: this.thumbFromMargin,
      thumbToMargin: this.thumbToMargin,

      // tooltips
      thumbFromTooltip: this.thumbFromTooltip,
      thumbToTooltip: this.thumbToTooltip,
    };
  }

  public updateSettings(sliderElements: ISliderElements) {
    this.slider = sliderElements.slider.element;
    this.from = sliderElements.from.element;
    this.to = sliderElements.to.element;
    this.range = sliderElements.range.element;

    this.addListenersToThumbs();
  }

  private addListenersToThumbs() {
    if (typeof this.from !== 'undefined') {
      this.from!.addEventListener('pointerdown', this.beginSliding);
      this.from!.addEventListener('pointerup', this.stopSliding);
    }

    if (typeof this.to !== 'undefined') {
      this.to!.addEventListener('pointerdown', this.beginSliding);
      this.to!.addEventListener('pointerup', this.stopSliding);
    }
  }

  // TODO event type?
  private beginSliding(event: any) {
    const { target, pointerId } = event;
    event.preventDefault();
    target.setPointerCapture(pointerId);

    const startCursorPosition: number = event.clientX;
    const percentPx: number = this.slider!.getBoundingClientRect().width / 100;
    // TODO double in initRangeSliderMargins
    const rangePercent: number = (this.settings.max - this.settings.min) / 100;
    let newPosition: number;
    let newPercentPosition: number;
    const rangeMarginLeft: number = parseFloat(this.range!.style.marginLeft);
    const rangeMarginRight: number = parseFloat(this.range!.style.marginRight);

    target.onpointermove = (e: any) => {
      newPosition = this.currentCursorPosition(e) - startCursorPosition;
      newPercentPosition = newPosition / percentPx;

      if (target.className === 'range-slider__thumb_from') {
        this.thumbFromMargin = rangeMarginLeft + newPercentPosition;
        this.rangeLeftMargin = rangeMarginLeft + newPercentPosition;
        this.thumbFromTooltip = this.thumbFromMargin * rangePercent + this.settings.min;
      }
      if (target.className === 'range-slider__thumb_to') {
        this.thumbToMargin = 100 - rangeMarginRight + newPercentPosition;
        this.rangeRightMargin = rangeMarginRight - newPercentPosition;
        this.thumbToTooltip = this.thumbToMargin * rangePercent + this.settings.min;
      }
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private stopSliding(event: any): void {
    const { target, pointerId } = event;
    target.onpointermove = null;
    target.releasePointerCapture(pointerId);
  }

  private currentCursorPosition(event: any): number {
    let currentPos: number = event.clientX;

    const sliderEdgeLeft: number = this.slider?.getBoundingClientRect().left || 0;
    const sliderEdgeRight: number = this.slider?.getBoundingClientRect().right || 0;

    if (currentPos < sliderEdgeLeft) {
      currentPos = sliderEdgeLeft;
    } else if (currentPos > sliderEdgeRight) {
      currentPos = sliderEdgeRight;
    }
    return currentPos;
  }
}
