/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable lines-between-class-members */
import { ISettings, ThumbName } from '../RangeSlider/types';

import Observer from '../Observer/Observer';
import Slider from './Slider';
import Thumb from './Thumb';
import Range from './Range';
import Scale from './Scale';
import ConfigurationPanel from '../ConfigurationPanel/ConfigurationPanel';

import { getElementLengthInPx, getMinMaxElementEdgesInPx, getOnePointInPx } from '../lib/common';

export default class View extends Observer {
  slider: Slider;
  from: Thumb;
  to: Thumb;
  range: Range;
  scale: Scale;

  settings: ISettings;

  rangeMarginTo: number;
  rangeMarginFrom: number;
  thumbMarginFrom: number;
  thumbMarginTo: number;

  changeSettingsObserver: Observer;

  configurationPanel: ConfigurationPanel;

  constructor(id: string, mergedSettings: ISettings) {
    super();
    this.settings = mergedSettings;

    this.slider = new Slider(id);
    this.from = new Thumb('from');
    this.to = new Thumb('to');
    this.range = new Range();
    this.scale = new Scale();

    this.configurationPanel = new ConfigurationPanel(this.settings);

    this.rangeMarginTo = 0;
    this.rangeMarginFrom = 0;
    this.thumbMarginFrom = 0;
    this.thumbMarginTo = 0;

    this.beginSliding = this.beginSliding.bind(this);
    this.stopSliding = this.stopSliding.bind(this);
    this.moveClosestThumb = this.moveClosestThumb.bind(this);
    this.setMargins = this.setMargins.bind(this);
    this.isTooltipsCollision = this.isTooltipsCollision.bind(this);
    this.getStepInPx = this.getStepInPx.bind(this);

    this.changeSettingsObserver = new Observer();
  }

  public createRangeSlider(settings: ISettings): View {
    this.settings = settings;

    if (settings.isTwoRunners) {
      this.slider.element!.appendChild(this.from.element);
    }
    this.slider.element!.appendChild(this.to.element);
    this.slider.element!.appendChild(this.range.element);

    if (settings.isVertical) {
      this.slider.element!.className += ' range-slider_vertical';
      this.scale.element.className += ' range-slider__scale_vertical';

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

    if (settings.isConfPanel) {
      this.slider.element.after(this.configurationPanel!.element);
    }

    this.initRangeSliderMargins();
    this.updateRangeSliderValues();
    this.addListenersToThumbs();

    return this;
  }

  public updateRangeSliderValues(): View {
    const isVertical = this.settings?.isVertical as boolean;

    if (this.settings.isTwoRunners) {
      this.range.setMarginFromBegin(this.rangeMarginFrom, isVertical);
      this.from.setMargin(this.thumbMarginFrom, this.settings);
      this.from.tooltip.setTooltipText(this.settings!.valueFrom);
    }
    this.range.setMarginFromEnd(this.rangeMarginTo, isVertical);
    this.to.setMargin(this.thumbMarginTo, this.settings);
    this.to.tooltip.setTooltipText(this.settings!.valueTo);

    return this;
  }

  private addListenersToThumbs(): View {
    if (this.settings!.isTwoRunners) {
      this.from.element.addEventListener('pointerdown', this.beginSliding);
      this.from.element.addEventListener('pointerup', this.stopSliding);
    }
    this.to.element.addEventListener('pointerdown', this.beginSliding);
    this.to.element.addEventListener('pointerup', this.stopSliding);

    this.slider.element!.addEventListener('pointerdown', this.moveClosestThumb);
    this.slider.element!.addEventListener('pointerup', () => {
      this.changeSettingsObserver.notifyObservers(this.settings);
    });

    window.addEventListener('resize', () => {
      this.initRangeSliderMargins();
      this.updateRangeSliderValues();

      if (!this.settings?.isVertical) {
        this.scale.element.replaceChildren();
        this.scale.createScaleMarks(this.settings!);
      }

      this.setDistanceBetweenTooltips();
    });
    return this;
  }

  private beginSliding(event: PointerEvent): HTMLElement {
    const { pointerId } = event;
    const target = event.target as HTMLElement;
    event.preventDefault();
    target.setPointerCapture(pointerId);

    target.onpointermove = (e: PointerEvent) => {
      let thumbName: ThumbName = 'to';

      if (target.classList.contains('range-slider__thumb_from')) {
        thumbName = 'from';
      } else if (target.classList.contains('range-slider__thumb_to')) {
        thumbName = 'to';
      }

      const currentPos = this.getPosOnScale(this.currentCursorPosition(e));
      this.setMargins(thumbName, currentPos);
      this.updateRangeSliderValues();
      this.setDistanceBetweenTooltips();
    };
    return target;
  }

  // eslint-disable-next-line class-methods-use-this
  private stopSliding(event: PointerEvent): HTMLElement {
    const target = event.target as HTMLElement;
    target.onpointermove = null;
    target.releasePointerCapture(event.pointerId);
    return target;
  }

  private moveClosestThumb(e: PointerEvent | MouseEvent): View {
    const currentPos: number = this.getPosOnScale(this.currentCursorPosition(e));
    const fromPos: number = this.thumbMarginFrom;
    const toPos: number = this.thumbMarginTo;
    let thumbName: ThumbName = 'to';

    // check which thumb is closest to the cursor position
    if (this.settings.isTwoRunners) {
      const fromDiff = this.getDifferenceBetween(currentPos, fromPos);
      const toDiff = this.getDifferenceBetween(currentPos, toPos);

      thumbName = fromDiff < toDiff ? 'from' : 'to';
    }

    this.setMargins(thumbName, currentPos);
    this.updateRangeSliderValues();

    if (this.settings.isTwoRunners) {
      this.setZindexTop(thumbName);
    }

    this.setDistanceBetweenTooltips();

    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  private getDifferenceBetween(
    currentPos: number,
    thumbMargin: number,
  ): number {
    return Math.abs(currentPos - thumbMargin);
  }

  private getPosOnScale(currentPos: number): number {
    const sliderRect = this.slider.element!.getBoundingClientRect();

    return this.settings.isVertical
      ? currentPos - sliderRect.top
      : currentPos - sliderRect.left;
  }

  private currentCursorPosition(event: PointerEvent | MouseEvent): number {
    let currentPos: number = this.settings.isVertical
      ? event.clientY
      : event.clientX;

    let { min, max } = getMinMaxElementEdgesInPx(this.settings, this.slider);

    // set Edge values to thumbs for twoRunners slider
    if (this.settings.isTwoRunners) {
      const target = event.target as Element;
      const stepInPx = this.getStepInPx(this.settings, this.slider);

      if (target.classList.contains('range-slider__thumb_from')) {
        max = this.thumbMarginTo! - stepInPx + min;
      } else if (target.classList.contains('range-slider__thumb_to')) {
        min = this.thumbMarginFrom! + stepInPx + min;
      }
    }

    // validate currentPos
    if (currentPos < min) {
      currentPos = min;
    } else if (currentPos > max) {
      currentPos = max;
    }
    return currentPos;
  }

  private setMargins(thumbName: ThumbName, currentPos: number): void {
    const currentPosWithStep = this.getCurrentPosWithStep(this.settings, this.slider, currentPos);

    if (thumbName === 'from' && this.settings.isTwoRunners) {
      this.thumbMarginFrom = currentPosWithStep;
      this.rangeMarginFrom = currentPosWithStep;
      this.settings!.valueFrom = this.getThumbValue(thumbName);
    } else if (thumbName === 'to') {
      const { min, max } = getMinMaxElementEdgesInPx(this.settings, this.slider);
      const sliderLengthInPx: number = max! - min!;

      this.thumbMarginTo = currentPosWithStep;
      this.rangeMarginTo = sliderLengthInPx - currentPosWithStep;
      this.settings!.valueTo = this.getThumbValue(thumbName);
    }
  }

  private getCurrentPosWithStep(
    settings: ISettings,
    slider: Slider,
    currentPos: number,
  ): number {
    const stepInPx = this.getStepInPx(settings, slider);
    const currentPosWidthStep: number = Math.round(currentPos / stepInPx) * stepInPx;
    const { min, max } = getMinMaxElementEdgesInPx(settings, slider);

    const absolutePosWithStep = min! + currentPosWidthStep;
    const absolutePos = min! + currentPos;
    const sliderMaxPos = max! - min!;
    const sliderMinPos = 0; // min - min

    const isCursorPosGreaterThanMax = absolutePosWithStep > max! || absolutePos >= max!;
    const isCursorPosLessThanMin = absolutePosWithStep < min! || absolutePos <= min!;

    if (isCursorPosGreaterThanMax) return sliderMaxPos;
    if (isCursorPosLessThanMin) return sliderMinPos;

    return currentPosWidthStep;
  }

  // eslint-disable-next-line class-methods-use-this
  public getStepInPx(settings: ISettings, slider: Slider): number {
    const sliderLengthInPx: number = getElementLengthInPx(settings, slider.element);
    const onePointInPx: number = sliderLengthInPx / (settings.max - settings.min);

    return onePointInPx * settings.step;
  }

  private getThumbValue(thumbName: ThumbName): number {
    const thumbMargin: number = thumbName === 'from'
      ? this.thumbMarginFrom!
      : this.thumbMarginTo!;

    const valueInPoints = thumbMargin / getOnePointInPx(this.settings!, this.slider.element);
    const totalValue = valueInPoints + this.settings!.min;

    return totalValue;
  }

  private initRangeSliderMargins(): View {
    const onePointInPx = getOnePointInPx(this.settings, this.slider.element);

    /**
     * получаем относительные значения марджинов в пикселах от начала слайдера
     * и устанавливаем марджины
     * */
    if (this.settings.isTwoRunners) {
      const marginFrom = (this.settings.valueFrom - this.settings.min) * onePointInPx;
      this.setMargins('from', marginFrom);
    }
    const marginTo = (this.settings.valueTo - this.settings.min) * onePointInPx;
    this.setMargins('to', marginTo);

    return this;
  }

  private isTooltipsCollision(): boolean {
    let tooltipSize: number;
    let fromEdge: number;
    let toEdge: number;

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

  private setDistanceBetweenTooltips(): View {
    const from = this.from.tooltip.element.style;
    const to = this.to.tooltip.element.style;

    if (this.isTooltipsCollision()) {
      if (this.settings.isVertical) {
        from.top = `${-55}%`;
        to.top = `${55}%`;
      } else {
        from.left = `${-105}%`;
        to.left = `${5}%`;
      }
    } else if (this.settings.isVertical) {
      from.top = `${0}%`;
      to.top = `${0}%`;
    } else {
      from.left = `${-50}%`;
      to.left = `${-50}%`;
    }
    return this;
  }

  private setZindexTop(thumb: ThumbName): View {
    const from = this.from.element;
    const to = this.to.element;

    const zIndexClass = 'range-slider__tooltip_z-index-top';

    if (thumb === 'from') {
      from.classList.add(zIndexClass);
      to.classList.remove(zIndexClass);
    } else if (thumb === 'to') {
      from.classList.remove(zIndexClass);
      to.classList.add(zIndexClass);
    }
    return this;
  }
}
