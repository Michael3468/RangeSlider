import Thumb from '../Thumb/Thumb';
import Slider from '../Slider/Slider';
import Scale from '../Scale/Scale';
import {
  AbstractConfigurationPanel,
  AbstractObserver,
  AbstractRange,
  AbstractScale,
  AbstractSlider,
  AbstractThumb,
  ISettings,
  MeasureUnit,
  ThumbName,
} from '../RangeSlider/types';
import Range from '../Range/Range';
import Observer from '../Observer/Observer';
import {
  getDigitsAfterPoint,
  getElementLengthInPx,
  getMinMaxElementEdgesInPx,
  getOnePointInPx,
} from '../lib/common';
import ConfigurationPanel from '../ConfigurationPanel/ConfigurationPanel';

class View {
  private slider: AbstractSlider;

  private from: AbstractThumb;

  private to: AbstractThumb;

  private range: AbstractRange;

  private scale: AbstractScale;

  private settings: ISettings;

  private rangeMarginTo: number;

  private rangeMarginFrom: number;

  private thumbMarginFrom: number;

  private thumbMarginTo: number;

  configurationPanel?: AbstractConfigurationPanel;

  changeSettingsObserver: AbstractObserver;

  constructor(id: string, mergedSettings: ISettings) {
    this.settings = mergedSettings;

    this.slider = new Slider(id);
    this.from = new Thumb('from');
    this.to = new Thumb('to');
    this.range = new Range();
    this.scale = new Scale();

    if (process.env['NODE_ENV'] !== 'production') {
      this.configurationPanel = new ConfigurationPanel(this.settings);
    }

    this.rangeMarginTo = 0;
    this.rangeMarginFrom = 0;
    this.thumbMarginFrom = 0;
    this.thumbMarginTo = 0;

    this.handleBeginSlidingPointerEvent = this.handleBeginSlidingPointerEvent.bind(this);
    this.handleMoveClosestThumbPointerEvent = this.handleMoveClosestThumbPointerEvent.bind(this);
    this.setMargins = this.setMargins.bind(this);
    this.isTooltipsCollision = this.isTooltipsCollision.bind(this);
    this.getStepInPx = this.getStepInPx.bind(this);
    this.getMargin = this.getMargin.bind(this);

    this.changeSettingsObserver = new Observer();
  }

  public createRangeSlider(settings: ISettings): View {
    if (settings.range) {
      this.slider.element.appendChild(this.from.element);
    }
    this.slider.element.appendChild(this.to.element);
    if (this.settings.bar) {
      this.slider.element.appendChild(this.range.element);
    }

    const THUMB_VERTICAL = 'thumb-vertical';
    const RS_VERTICAL = 'range-slider_vertical';
    const RS_SCALE_VERTICAL = 'scale_vertical';
    if (settings.vertical) {
      this.slider.element.classList.add(RS_VERTICAL);
      this.scale.element.classList.add(RS_SCALE_VERTICAL);

      // add class for vertical thumbs
      if (settings.range) {
        this.from.element.classList.add(THUMB_VERTICAL);
      }
      this.to.element.classList.add(THUMB_VERTICAL);
    } else {
      this.slider.element?.classList.remove(RS_VERTICAL);
      this.scale.element.classList.remove(RS_SCALE_VERTICAL);

      if (settings.range) {
        this.from.element.classList.remove(THUMB_VERTICAL);
      }
      this.to.element.classList.remove(THUMB_VERTICAL);
    }

    if (!settings.tooltips) {
      this.from.tooltip.element.classList.add('hidden');
      this.to.tooltip.element.classList.add('hidden');
    } else {
      this.from.tooltip.element.classList.remove('hidden');
      this.to.tooltip.element.classList.remove('hidden');
    }

    if (settings.scale) {
      this.slider.element.appendChild(this.scale.element);
      this.scale.createScaleMarks(settings);
    }

    this.initRangeSliderMargins();
    this.updateRangeSliderValues();
    this.addListenersToThumbs();
    this.setDistanceBetweenTooltips();

    if (process.env['NODE_ENV'] !== 'production') {
      if (settings.confpanel && this.configurationPanel) {
        this.slider.element.after(this.configurationPanel.element);
        this.configurationPanel.updateState(this.settings);
      }
    }

    this.handleUpdateRangeSliderView();

    return this;
  }

  public updateRangeSliderValues(): View {
    const vertical = <boolean> this.settings?.vertical;

    this.range.setMarginFromBegin(this.rangeMarginFrom, vertical);
    this.from.setMargin(this.thumbMarginFrom, this.settings);
    this.from.tooltip.setTooltipText(this.settings.from, this.settings);

    this.range.setMarginFromEnd(this.rangeMarginTo, vertical);
    this.to.setMargin(this.thumbMarginTo, this.settings);
    this.to.tooltip.setTooltipText(this.settings.to, this.settings);

    return this;
  }

  public destroyView(): View {
    this.from.element.parentNode?.removeChild(this.from.element);
    this.to.element.parentNode?.removeChild(this.to.element);
    this.range.element.parentNode?.removeChild(this.range.element);
    while (this.scale.element.firstChild) {
      this.scale.element.removeChild(this.scale.element.firstChild);
    }
    this.scale.element.parentNode?.removeChild(this.scale.element);

    return this;
  }

  private handleNotifyChangeSettingsObserver = (): void => {
    this.changeSettingsObserver.notifyObservers(this.settings);
  };

  private handleUpdateRangeSliderView = (): void => {
    this.initRangeSliderMargins();
    this.updateRangeSliderValues();

    if (!this.settings.vertical) {
      this.scale.element.replaceChildren();
      this.scale.createScaleMarks(this.settings);
    }

    this.setDistanceBetweenTooltips();
  };

  private addListenersToThumbs(): View {
    if (this.settings.range) {
      this.from.element.addEventListener('pointerdown', this.handleBeginSlidingPointerEvent);
      this.from.element.addEventListener('pointerup', View.handleStopSlidingPointerEvent);
    }
    this.to.element.addEventListener('pointerdown', this.handleBeginSlidingPointerEvent);
    this.to.element.addEventListener('pointerup', View.handleStopSlidingPointerEvent);

    this.slider.element.addEventListener('pointerdown', this.handleMoveClosestThumbPointerEvent);
    this.slider.element.addEventListener('pointerup', this.handleNotifyChangeSettingsObserver);
    window.addEventListener('DOMContentLoaded', this.handleUpdateRangeSliderView);
    window.addEventListener('resize', this.handleUpdateRangeSliderView);
    return this;
  }

  private handleBeginSlidingPointerEvent(event: PointerEvent): HTMLElement {
    const { pointerId } = event;
    const target = <HTMLElement> event.target;
    event.preventDefault();
    target.setPointerCapture(pointerId);

    target.onpointermove = (e: PointerEvent): void => {
      let thumbName: ThumbName = 'to';

      if (target.classList.contains('thumb-from')) {
        thumbName = 'from';
      } else if (target.classList.contains('thumb-to')) {
        thumbName = 'to';
      }

      const currentPos = this.getPosOnScale(this.currentCursorPosition(e));
      this.setMargins(thumbName, currentPos);
      this.updateRangeSliderValues();
      this.setDistanceBetweenTooltips();
    };
    return target;
  }

  private static handleStopSlidingPointerEvent(event: PointerEvent): HTMLElement {
    const target = <HTMLElement> event.target;
    target.onpointermove = null;
    target.releasePointerCapture(event.pointerId);
    return target;
  }

  private handleMoveClosestThumbPointerEvent(e: PointerEvent): View {
    const currentPos: number = this.getPosOnScale(this.currentCursorPosition(e));
    const fromPos: number = this.thumbMarginFrom;
    const toPos: number = this.thumbMarginTo;
    let thumbName: ThumbName = 'to';

    // check which thumb is closest to the cursor position
    if (this.settings.range) {
      const fromDiff = View.getDifferenceBetween(currentPos, fromPos);
      const toDiff = View.getDifferenceBetween(currentPos, toPos);

      thumbName = fromDiff < toDiff ? 'from' : 'to';
    }

    this.setMargins(thumbName, currentPos);
    this.updateRangeSliderValues();

    if (this.settings.range) {
      this.setZIndexTop(thumbName);
    }

    this.setDistanceBetweenTooltips();

    return this;
  }

  private static getDifferenceBetween(
    currentPos: number,
    thumbMargin: number,
  ): number {
    return Math.abs(currentPos - thumbMargin);
  }

  private getPosOnScale(currentPos: number): number {
    const sliderRect = this.slider.element.getBoundingClientRect();

    return this.settings.vertical
      ? currentPos - sliderRect.top
      : currentPos - sliderRect.left;
  }

  private currentCursorPosition(event: PointerEvent): number {
    let currentPos: number = this.settings.vertical
      ? event.clientY
      : event.clientX;

    let { min, max } = getMinMaxElementEdgesInPx(this.settings, this.slider);

    // set Edge values to thumbs for twoRunners slider
    if (this.settings.range) {
      const target = <Element> event.target;
      const stepInPx = this.getStepInPx();

      if (target.classList.contains('thumb-from')) {
        max = this.thumbMarginTo - stepInPx + min;
      } else if (target.classList.contains('thumb-to')) {
        min = this.thumbMarginFrom + stepInPx + min;
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

    if (thumbName === 'from') {
      this.thumbMarginFrom = currentPosWithStep;
      this.rangeMarginFrom = currentPosWithStep;
      this.settings.from = this.getThumbValue(thumbName);
    } else if (thumbName === 'to') {
      const { min, max } = getMinMaxElementEdgesInPx(this.settings, this.slider);
      const sliderLengthInPx: number = max - min;

      this.thumbMarginTo = currentPosWithStep;
      this.rangeMarginTo = sliderLengthInPx - currentPosWithStep;
      this.settings.to = this.getThumbValue(thumbName);
    }
  }

  private getCurrentPosWithStep(
    settings: ISettings,
    slider: AbstractSlider,
    currentPos: number,
  ): number {
    const stepInPx = this.getStepInPx();
    const currentPosWidthStep: number = Math.round(currentPos / stepInPx) * stepInPx;
    const { min, max } = getMinMaxElementEdgesInPx(settings, slider);

    const absolutePosWithStep = min + currentPosWidthStep;
    const absolutePos = min + currentPos;
    const sliderMaxPos = max - min;
    const sliderMinPos = 0; // min - min

    const isCursorPosGreaterThanMax = absolutePosWithStep > max || absolutePos >= max;
    const isCursorPosLessThanMin = absolutePosWithStep < min || absolutePos <= min;

    if (isCursorPosGreaterThanMax) return sliderMaxPos;
    if (isCursorPosLessThanMin) return sliderMinPos;

    return Number(currentPosWidthStep.toFixed(3));
  }

  private getStepInPx(): number {
    const sliderLengthInPx: number = getElementLengthInPx(this.settings, this.slider.element);
    const onePointInPx: number = sliderLengthInPx / (this.settings.max - this.settings.min);

    return onePointInPx * this.settings.step;
  }

  private getThumbValue(thumbName: ThumbName): number {
    const thumbMargin: number = thumbName === 'from'
      ? this.thumbMarginFrom
      : this.thumbMarginTo;

    const valueInPoints = thumbMargin / getOnePointInPx(this.settings, this.slider.element);
    const totalValue = (this.settings.step >= 1)
      ? Math.round(valueInPoints)
      : Math.round(valueInPoints) * this.settings.step;

    return Number((totalValue + this.settings.min)
      .toFixed(getDigitsAfterPoint(this.settings)));
  }

  private initRangeSliderMargins(): View {
    if (this.settings.range) {
      this.setMargins('from', this.getMargin('from'));
    } else {
      this.setMargins('from', 0);
    }

    this.setMargins('to', this.getMargin('to'));

    return this;
  }

  private getMargin(thumbName: ThumbName): number {
    const onePointInPx = getOnePointInPx(this.settings, this.slider.element);

    const value = thumbName === 'from'
      ? this.settings.from
      : this.settings.to;

    let margin: number;
    if (this.settings.step >= 1) {
      margin = (value - this.settings.min) * onePointInPx;
    } else {
      margin = ((value - this.settings.min)
      / this.settings.step)
      * onePointInPx;
    }

    return margin;
  }

  private isTooltipsCollision(): boolean {
    let fromEdge: number;
    let toEdge: number;

    const fromRect = this.from.element.getBoundingClientRect();
    const toRect = this.to.element.getBoundingClientRect();

    if (this.settings.vertical) {
      fromEdge = fromRect.bottom;
      toEdge = toRect.top;
    } else {
      fromEdge = fromRect.right;
      toEdge = toRect.left;
    }
    return toEdge - fromEdge <= 5;
  }

  private setDistanceBetweenTooltips(): View {
    if (this.isTooltipsCollision()) {
      if (this.settings.vertical) {
        this.setTopLeft('px', '-12', '15', '12', '15');
      } else {
        this.setTopLeft('%', '-130', '-105', '-130', '5');
      }
    } else if (this.settings.vertical) {
      this.setTopLeft('px', '0', '15', '0', '15');
    } else {
      this.setTopLeft('%', '-130', '-50', '-130', '-50');
    }
    return this;
  }

  private setTopLeft = (
    mu: MeasureUnit,
    fTop: string,
    fLeft: string,
    tTop: string,
    tLeft: string,
  ): View => {
    const from = this.from.tooltip.element.style;
    const to = this.to.tooltip.element.style;

    from.top = fTop + mu;
    from.left = fLeft + mu;
    to.top = tTop + mu;
    to.left = tLeft + mu;

    return this;
  };

  private setZIndexTop(thumb: ThumbName): View {
    const from = this.from.element;
    const to = this.to.element;

    const zIndexClass = 'tooltip-z-index-top';

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

export default View;
