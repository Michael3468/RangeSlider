import { ISettings } from '../RangeSlider/RangeSlider';
import { ISliderElements } from '../View/View';
// import { TSliderElement } from '../View/View';

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

  settings: ISettings;

  constructor(settings: ISettings) {
    // default options
    this.minValue = settings.min;
    this.maxValue = this.getMaxValue(settings);
    this.isTwoRunners = settings.isTwoRunners;

    if (settings.isTwoRunners === true) {
      this.from_value = this.getThumbFromValue(settings);
    } else {
      this.from_value = this.minValue;
    }

    this.to_value = this.getThumbToValue(settings);

    // sliderElements
    this.slider;
    this.from;
    this.to;
    this.range;

    this.beginSliding = this.beginSliding.bind(this);
    this.stopSliding = this.stopSliding.bind(this);

    // margins
    this.settings = settings;
  }

  private getThumbFromValue(settings: ISettings): number {
    if (this.minValue > settings.from_value) {
      return this.minValue;
    } else if (this.maxValue < settings.from_value) {
      return this.maxValue;
    } else {
      return settings.from_value;
    }
  }

  private getThumbToValue(settings: ISettings): number {
    if (this.maxValue < settings.to_value) {
      return this.maxValue;
    } else if (this.minValue > settings.to_value) {
      return this.minValue;
    } else {
      return settings.to_value;
    }
  }

  private getMaxValue(settings: ISettings): number {
    if (this.minValue > settings.max) {
      this.maxValue = this.minValue + 1;
      return this.maxValue;
    } else {
      return settings.max;
    }
  }

  public getSettings() {
    return {
      min: this.minValue,
      max: this.maxValue,
      isTwoRunners: this.isTwoRunners,
      from_value: this.from_value,
      to_value: this.to_value,
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
    let percent: number = this.slider!.getBoundingClientRect().width / 100;
    let newPosition: number;
    let newPercentPosition: number;
    let rangeMarginLeft: number = parseFloat(this.range!.style.marginLeft);
    let rangeMarginRight: number = parseFloat(this.range!.style.marginRight);

    event.target.onpointermove = (event: any) => {
      newPosition = this.currentCursorPosition(event) - startCursorPosition;
      newPercentPosition = newPosition / percent;

      if (event.target.className === 'range-slider__thumb_from') {
        event.target.style.marginLeft = rangeMarginLeft + newPercentPosition + '%';
        this.range!.style.marginLeft = rangeMarginLeft + newPercentPosition + '%';
        return;
      }
      if (event.target.className === 'range-slider__thumb_to') {
        event.target.style.marginLeft = 100 - rangeMarginRight + newPercentPosition + '%';
        this.range!.style.marginRight = rangeMarginRight - newPercentPosition + '%';
        return;
      }

      // ///////////////////////////
      // let rangeLength = this.settings.max - this.settings.min; // TODO add to Model
      // let rangePercent = rangeLength / 100; // TODO add to Model

      // let rangeRightMargin = (this.settings.max - this.settings.to_value) / rangePercent; // TODO add to Model
      // let rangeLeftMargin = (this.settings.from_value - this.settings.min) / rangePercent; // TODO add to Model
      // let thumbFromMargin = rangeLeftMargin; // TODO add to Model
      // let thumbToMargin = 100 - rangeRightMargin; // TODO add to Model
      // ///////////////////////////

      // console.log('rr: ' + rangeRightMargin);
      // console.log('rl: ' + rangeLeftMargin);
      // console.log('f: ' + thumbFromMargin);
      // console.log('t: ' + thumbToMargin);
      // console.log('-------');

      // if (event.target.className === 'range-slider__thumb_from') {
      //   console.log('from');
      //   console.log(event.target);
      //   event.target.style.marginLeft = thumbFromMargin + '%';
      //   this.range!.style.marginLeft = rangeLeftMargin + '%';
      //   return;
      // }
      // if (event.target.className === 'range-slider__thumb_to') {
      //   event.target.style.marginLeft = thumbToMargin + '%';
      //   this.range!.style.marginRight = rangeRightMargin + '%';
      //   return;
      // }
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
