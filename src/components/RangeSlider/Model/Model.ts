import { ISettings } from '../RangeSlider/RangeSlider';
import { ISliderElements } from '../View/View';
import { ThumbName } from '../View/Thumb';

type TSliderElement = HTMLElement | null | undefined;

export class Model {
  minValue: number;
  maxValue: number;
  isTwoRunners: boolean;
  from_value: number;
  to_value: number;

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
      this.from_value = this.getThumbValue(settings, 'from');
    } else {
      this.from_value = this.minValue;
    }
    this.to_value = this.getThumbValue(settings, 'to');

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
    let value = thumbName === 'from' ? settings.from_value : settings.to_value;

    if (this.minValue > value) {
      return this.minValue;
    } else if (this.maxValue < value) {
      return this.maxValue;
    } else {
      return value;
    }
  }

  private getMaxValue(settings: ISettings): number {
    if (this.minValue > settings.max) {
      this.maxValue = this.minValue + 1; // TODO ???
      return this.maxValue;
    }
    return settings.max;
  }

  private initRangeSliderMargins(): void {
    let rangeLength = this.settings.max - this.settings.min;
    let rangePercent = rangeLength / 100;

    this.rangeRightMargin = (this.settings.max - this.settings.to_value) / rangePercent;
    this.rangeLeftMargin = (this.settings.from_value - this.settings.min) / rangePercent;
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
      from_value: this.from_value,
      to_value: this.to_value,

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
    event.preventDefault();
    event.target.setPointerCapture(event?.pointerId);

    let startCursorPosition: number = event.clientX;
    let percentPx: number = this.slider!.getBoundingClientRect().width / 100;
    let rangePercent: number = (this.settings.max - this.settings.min)/100; // TODO double in initRangeSliderMargins
    let newPosition: number;
    let newPercentPosition: number;
    let rangeMarginLeft: number = parseFloat(this.range!.style.marginLeft);
    let rangeMarginRight: number = parseFloat(this.range!.style.marginRight);

    event.target.onpointermove = (event: any) => {
      newPosition = this.currentCursorPosition(event) - startCursorPosition;
      newPercentPosition = newPosition / percentPx;

      if (event.target.className === 'range-slider__thumb_from') {
        this.thumbFromMargin = rangeMarginLeft + newPercentPosition;
        this.rangeLeftMargin = rangeMarginLeft + newPercentPosition;
        this.thumbFromTooltip = this.thumbFromMargin * rangePercent + this.settings.min;
        return;
      }
      if (event.target.className === 'range-slider__thumb_to') {
        this.thumbToMargin = 100 - rangeMarginRight + newPercentPosition;
        this.rangeRightMargin = rangeMarginRight - newPercentPosition;
        this.thumbToTooltip = this.thumbToMargin * rangePercent + this.settings.min;
        return;
      }
      
    };
  }

  private stopSliding(event: any): void {
    event.target.onpointermove = null;
    event.target.releasePointerCapture(event.pointerId);
  }

  private currentCursorPosition(event: any): number {
    let currentPos: number = event.clientX;

    let sliderEdgeLeft: number = this.slider?.getBoundingClientRect().left || 0;
    let sliderEdgeRight: number = this.slider?.getBoundingClientRect().right || 0;

    if (currentPos < sliderEdgeLeft) {
      currentPos = sliderEdgeLeft;
    } else if (currentPos > sliderEdgeRight) {
      currentPos = sliderEdgeRight;
    }
    return currentPos;
  }
}
