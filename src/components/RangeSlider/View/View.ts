/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable lines-between-class-members */
import { ISettings, ThumbName } from '../RangeSlider/types';

import Slider from './Slider';
import Thumb from './Thumb';
import Range from './Range';
import Scale from './Scale';

export default class View {
  slider: Slider;
  from: Thumb;
  to: Thumb;
  range: Range;
  scale: Scale;

  settings: ISettings | undefined;

  rangeMarginTo: number | undefined;
  rangeMarginFrom: number | undefined;
  thumbMarginFrom: number | undefined;
  thumbMarginTo: number | undefined;

  thumbTooltipFrom: number | undefined;
  thumbTooltipTo: number | undefined;

  constructor(id: string | null) {
    this.slider = new Slider(id);
    this.from = new Thumb('from');
    this.to = new Thumb('to');
    this.range = new Range();
    this.scale = new Scale();

    this.settings = undefined;

    this.rangeMarginTo = undefined;
    this.rangeMarginFrom = undefined;
    this.thumbMarginFrom = undefined;
    this.thumbMarginTo = undefined;

    this.beginSliding = this.beginSliding.bind(this);
    this.stopSliding = this.stopSliding.bind(this);
    this.moveClosestThumb = this.moveClosestThumb.bind(this);
    this.setMargins = this.setMargins.bind(this);
    this.convertToPx = this.convertToPx.bind(this);
    this.isThumbsCollision = this.isThumbsCollision.bind(this);
    this.getStepInPx = this.getStepInPx.bind(this);
  }

  public createRangeSlider(settings: ISettings): void {
    this.settings = settings;

    if (settings.isTwoRunners) {
      this.slider.element!.appendChild(this.from.element);
    }
    this.slider.element!.appendChild(this.to.element);
    this.slider.element!.appendChild(this.range.element);

    if (settings.isVertical) {
      this.slider.element!.className += ' range-slider_vertical';
      this.scale.element.style.height = '40px';

      if (settings.isTooltipsVisible) {
        const TOOLTIP_VERTICAL = 'range-slider__tooltip_vertical';
        this.from.tooltip.element.className += ` ${TOOLTIP_VERTICAL}`;
        this.to.tooltip.element.className += ` ${TOOLTIP_VERTICAL}`;
      }

      // add class for vertical thumbs
      const THUMB_VERTICAL = 'range-slider__thumb_vertical';
      if (settings.isTwoRunners) {
        this.from.element.className += ` ${THUMB_VERTICAL}`;
      }
      this.to.element.className += ` ${THUMB_VERTICAL}`;
    }

    if (!settings.isTooltipsVisible) {
      const TOOLTIP_HIDDEN = 'range-slider__tooltip_hidden';
      this.from.tooltip.element.className += ` ${TOOLTIP_HIDDEN}`;
      this.to.tooltip.element.className += ` ${TOOLTIP_HIDDEN}`;
    }

    if (settings.isScaleVisible) {
      this.slider.element!.appendChild(this.scale.element);
      this.scale.createScaleMarks(settings);
    }

    // TODO del block (wrap element in div block)
    if (this.slider.element) {
      const wrapper = document.createElement('div');
      wrapper.className = 'range-slider_block';
      if (settings.isVertical) {
        wrapper.style.height = '300px';
      }
      this.slider.element.parentElement!.replaceChild(wrapper, this.slider.element);
      wrapper.appendChild(this.slider.element);
    }

    this.initRangeSliderMargins(this.settings, this.slider);
    this.updateRangeSliderValues(this.settings);
    this.addListenersToThumbs();
  }

  public updateRangeSliderValues(settings: ISettings): void {
    if (!settings) {
      throw new Error('\'settings\' is undefined !');
    }

    const isVertical = this.settings?.isVertical as boolean;

    if (settings.isTwoRunners) {
      this.range.setMarginFromBegin(this.rangeMarginFrom, isVertical);
      this.from.setMargin(this.thumbMarginFrom, settings);
      this.from.tooltip.setTooltipText(this.thumbTooltipFrom!);
    }
    this.range.setMarginFromEnd(this.rangeMarginTo, isVertical);
    this.to.setMargin(this.thumbMarginTo, settings);
    this.to.tooltip.setTooltipText(this.thumbTooltipTo!);
  }

  private addListenersToThumbs(): void {
    if (this.settings!.isTwoRunners) {
      this.from.element.addEventListener('pointerdown', this.beginSliding);
      this.from.element.addEventListener('pointerup', this.stopSliding);
    }
    this.to.element.addEventListener('pointerdown', this.beginSliding);
    this.to.element.addEventListener('pointerup', this.stopSliding);

    this.slider.element!.addEventListener('pointerdown', this.moveClosestThumb);

    window.addEventListener('resize', () => {
      this.initRangeSliderMargins(this.settings!, this.slider!);
      this.updateRangeSliderValues(this.settings!);
    });
  }

  private beginSliding(event: any): void {
    const { target, pointerId } = event;
    event.preventDefault();
    target.setPointerCapture(pointerId);

    target.onpointermove = (e: any) => {
      if (!this.settings) {
        throw new Error('\'this.settings\' is undefined !');
      }

      let thumbName: ThumbName = 'to';

      if (target.classList.contains('range-slider__thumb_from')) {
        thumbName = 'from';
      } else if (target.classList.contains('range-slider__thumb_to')) {
        thumbName = 'to';
      }

      // TODO margin in px
      const currentPosInPercents = this.getMarginLeft(this.currentCursorPosition(e));
      this.setMargins(this.settings, thumbName, currentPosInPercents);
      this.updateRangeSliderValues(this.settings);
      this.setDistanceBetweenTooltips();
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private stopSliding(event: any): void {
    const { target, pointerId } = event;
    target.onpointermove = null;
    target.releasePointerCapture(pointerId);
  }

  private moveClosestThumb(e: any): void {
    if (!this.settings) {
      throw new Error('\'this.settings\' is undefined !');
    }

    // TODO margin in px
    const currentPosInPercents: number = this.getMarginLeft(this.currentCursorPosition(e));
    const fromPos: number | undefined = this.thumbMarginFrom;
    const toPos: number | undefined = this.thumbMarginTo;
    let thumbName: ThumbName = 'to';

    // check which thumb is closest to the cursor position
    if (fromPos !== undefined) {
      // TODO margin in px
      const fromAndCurrentDiff = this.getDifferenceBetween(currentPosInPercents, fromPos);
      const toAndCurrentDiff = this.getDifferenceBetween(currentPosInPercents, toPos);

      thumbName = fromAndCurrentDiff < toAndCurrentDiff ? 'from' : 'to';
    }

    // TODO margin in px
    this.setMargins(this.settings, thumbName, currentPosInPercents);
    this.updateRangeSliderValues(this.settings);

    if (this.settings.isTwoRunners) {
      this.setZindexTop(thumbName);
    }

    this.setDistanceBetweenTooltips();
  }

  // eslint-disable-next-line class-methods-use-this
  private getDifferenceBetween(
    currentPosInPercents: number | undefined,
    // eslint-disable-next-line comma-dangle
    thumbMargin: number | undefined
  ): number {
    if (currentPosInPercents === undefined || thumbMargin === undefined) return 0;
    return Math.abs(currentPosInPercents - parseFloat(thumbMargin!.toString()));
  }

  private getMarginLeft(currentPos: number): number {
    if (!this.settings) {
      throw new Error('\'this.settings\' is undefined !');
    }

    let scalePercentInPx: number;
    let posOnScale: number;
    const sliderRect = this.slider.element!.getBoundingClientRect();

    if (this.settings.isVertical) {
      scalePercentInPx = sliderRect.height / 100;
      posOnScale = currentPos - sliderRect.top;
    } else {
      scalePercentInPx = sliderRect.width / 100;
      posOnScale = currentPos - sliderRect.left;
    }
    const currentPosInPercents = posOnScale / scalePercentInPx;

    return currentPosInPercents;
  }

  private currentCursorPosition(event: any): number {
    if (!this.settings) {
      throw new Error('\'this.settings\' is undefined !');
    }

    let currentPos: number;
    let min: number;
    let max: number;
    const sliderRect = this.slider.element!.getBoundingClientRect();

    if (this.settings.isVertical) {
      currentPos = event.clientY;
      min = sliderRect.top || 0;
      max = sliderRect.bottom || 0;
    } else {
      currentPos = event.clientX;
      min = sliderRect.left || 0;
      max = sliderRect.right || 0;
    }

    // set Edges to thumbs for twoRunners slider
    if (this.settings.isTwoRunners) {
      const { target } = event;

      if (target.classList.contains('range-slider__thumb_from')) {
        max = this.convertToPx(this.thumbMarginTo! - this.settings.step) + min;
      } else if (target.classList.contains('range-slider__thumb_to')) {
        min += this.convertToPx(this.thumbMarginFrom! + this.settings.step);
      }
    }
    // set Edges to thumbs for twoRunners slider end

    // validate currentPos
    if (currentPos < min) {
      currentPos = min;
    } else if (currentPos > max) {
      currentPos = max;
    }
    //  validate currentPos end
    return currentPos;
  }

  private convertToPx(percents: number): number {
    if (!this.settings) {
      throw new Error('\'this.settings\' is undefined !');
    }

    let percentInPx: number;
    const sliderRect = this.slider.element!.getBoundingClientRect();

    if (this.settings.isVertical) {
      percentInPx = sliderRect.height / 100;
    } else {
      percentInPx = sliderRect.width / 100;
    }
    return percents * percentInPx;
  }

  private setMargins(settings: ISettings, thumbName: ThumbName, currentPos: number): void {
    if (!settings) {
      throw new Error('\'settings\' is undefined !');
    }

    const currentPosWithStep = this.getCurrentPosWithStep(this.settings!, this.slider, currentPos);

    if (thumbName === 'from' && settings.isTwoRunners) {
      this.thumbMarginFrom = currentPosWithStep;
      this.rangeMarginFrom = currentPosWithStep;
      this.thumbTooltipFrom = this.getTooltipValue(thumbName);
    } else if (thumbName === 'to') {
      const { min, max } = this.getMinMaxSliderEdgesInPx(settings, this.slider);
      const sliderLengthInPx: number = max! - min!;

      this.thumbMarginTo = currentPosWithStep;
      this.rangeMarginTo = sliderLengthInPx - currentPosWithStep;
      this.thumbTooltipTo = this.getTooltipValue(thumbName);
    }
  }

  private getCurrentPosWithStep(
    settings: ISettings,
    slider: Slider,
    currentPosInPx: number,
  ): number {
    if (!settings) {
      throw new Error('\'settings\' is undefined !');
    }

    const stepInPx = this.getStepInPx(settings, slider);

    // currentPosInPxWidthStep - марджин относительно слайдера
    const currentPosInPxWidthStep: number = Math.round(currentPosInPx / stepInPx) * stepInPx;

    // min, max - значения относительно вернего левого угла экрана
    const { min, max } = this.getMinMaxSliderEdgesInPx(settings, slider);

    const absolutePosInPxWithStep = min! + currentPosInPxWidthStep;
    const absolutePosInPx = min! + currentPosInPx;

    if (absolutePosInPxWithStep > max! || absolutePosInPx >= max!) return max!;
    if (absolutePosInPxWithStep < min! || absolutePosInPx <= min!) return min!;

    return currentPosInPxWidthStep;
  }

  // eslint-disable-next-line class-methods-use-this
  private getMinMaxSliderEdgesInPx(settings: ISettings, slider: Slider) {
    if (!settings) {
      throw new Error('\'this.settings\' is undefined !');
    }
    if (!slider) {
      throw new Error('\'this.slider\' is undefined !');
    }

    const sliderRect = slider.element?.getBoundingClientRect();

    if (settings.isVertical) {
      return {
        min: sliderRect!.top,
        max: sliderRect!.bottom,
      };
    }
    return {
      min: sliderRect!.left,
      max: sliderRect!.right,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  public getStepInPx(settings: ISettings, slider: Slider) {
    const sliderLengthInPx: number = settings.isVertical
      ? slider.element?.getBoundingClientRect().height as number
      : slider.element?.getBoundingClientRect().width as number;

    return (sliderLengthInPx / (settings.max - settings.min)) * settings.step;
  }

  private getTooltipValue(thumbName: ThumbName): number {
    const thumbMargin: number = thumbName === 'from'
      ? this.thumbMarginFrom!
      : this.thumbMarginTo!;

    const valueInMargin = thumbMargin / this.getOnePointInPx(this.settings!, this.slider);
    const totalValue = valueInMargin + this.settings!.min;

    return totalValue;
  }

  private initRangeSliderMargins(settings: ISettings, slider: Slider): void {
    if (!settings) {
      throw new Error('\'settings\' is undefined !');
    }
    if (!slider) {
      throw new Error('\'slider\' is undefined !');
    }

    const onePointInPx = this.getOnePointInPx(settings, slider);

    /**
     * получаем относительные значения марджинов в пикселах от начала слайдера
     * и устанавливаем марджины
     *  */
    if (settings.isTwoRunners) {
      const marginFrom = (settings.valueFrom - settings.min) * onePointInPx;
      this.setMargins(settings, 'from', marginFrom);
    }
    const marginTo = (settings.valueTo - settings.min) * onePointInPx;
    this.setMargins(settings, 'to', marginTo);
  }

  // eslint-disable-next-line class-methods-use-this
  private getOnePointInPx(settings: ISettings, slider: Slider): number {
    if (!settings) {
      throw new Error('\'settings\' is undefined !');
    }
    if (!slider) {
      throw new Error('\'slider\' is undefined !');
    }

    /**
     * получаем длину слайдера в зависимости
     * от вертикального / горизонтального положения
     */
    const sliderLengthInPx: number = settings.isVertical
      ? slider.element?.getBoundingClientRect().height as number
      : slider.element?.getBoundingClientRect().width as number;

    return sliderLengthInPx / (settings.max - settings.min);
  }

  private isThumbsCollision(): boolean {
    if (!this.settings) {
      throw new Error('\'this.settings\' is undefined !');
    }

    let fromEdge: number;
    let toEdge: number;
    let tooltipSize: number;

    const toTooltipRect = this.to.tooltip.element.getBoundingClientRect();
    const fromRect = this.from.element.getBoundingClientRect();
    const toRect = this.to.element.getBoundingClientRect();

    if (this.settings.isVertical) {
      tooltipSize = toTooltipRect.height;
      fromEdge = fromRect.top;
      toEdge = toRect.top;
    } else {
      tooltipSize = toTooltipRect.width;
      fromEdge = fromRect.right;
      toEdge = toRect.right;
    }
    return toEdge - fromEdge <= tooltipSize;
  }

  private setDistanceBetweenTooltips(): void {
    if (!this.settings) {
      throw new Error('\'this.settings\' is undefined !');
    }

    const from = this.from.tooltip.element.style;
    const to = this.to.tooltip.element.style;

    if (this.isThumbsCollision()) {
      if (this.settings.isVertical) {
        from.left = `${-70}%`;
        to.left = `${-30}%`;
      } else {
        from.left = `${-100}%`;
        to.left = `${0}%`;
      }
    } else {
      from.left = `${-50}%`;
      to.left = `${-50}%`;
    }
  }

  private setZindexTop(thumb: ThumbName) {
    const from = this.from.element;
    const to = this.to.element;

    const zIndexClass = 'range-slider__tooltip_z-index-top';

    /**
     * меняем z-index бегунков в зависимости от выбранного бегунка
     */
    if (thumb === 'from') {
      from.classList.add(zIndexClass);
      to.classList.remove(zIndexClass);
    } else if (thumb === 'to') {
      from.classList.remove(zIndexClass);
      to.classList.add(zIndexClass);
    }
  }
}
