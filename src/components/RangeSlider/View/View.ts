import {
  getMinMaxElementEdgesInPx,
} from '../lib/common';

import ConfigurationPanel from '../ConfigurationPanel/ConfigurationPanel';
import Range from '../Range/Range';
import Scale from '../Scale/Scale';
import Slider from '../Slider/Slider';
import Thumb from '../Thumb/Thumb';
import Observer from '../Observer/Observer';

import {
  AbstractConfigurationPanel,
  AbstractObserver,
  AbstractRange,
  AbstractScale,
  AbstractSlider,
  AbstractThumb,
  IModelSettings,
  IViewSettings,
  MeasureUnit,
  ThumbName,
} from '../RangeSlider/types';

class View {
  private slider: AbstractSlider;

  private from: AbstractThumb = new Thumb('from');

  private to: AbstractThumb = new Thumb('to');

  private range: AbstractRange = new Range();

  private scale: AbstractScale = new Scale();

  modelSettings: IModelSettings;

  viewSettings: IViewSettings;

  configurationPanel?: AbstractConfigurationPanel;

  changeSettingsObserver: AbstractObserver = new Observer();

  changeCurrentPosObserver: AbstractObserver = new Observer();

  updateThumbsValueObserver: AbstractObserver = new Observer();

  getMarginObserver: AbstractObserver = new Observer();

  constructor(id: string, mergedSettings: IModelSettings, viewSettings: IViewSettings) {
    this.modelSettings = mergedSettings;
    this.viewSettings = viewSettings;

    this.slider = new Slider(id);

    if (process.env['NODE_ENV'] !== 'production') {
      this.configurationPanel = new ConfigurationPanel(this.modelSettings, this.viewSettings);
    }

    this.setBindings();
  }

  public createRangeSlider(settings: IModelSettings): View {
    if (this.viewSettings.range) {
      this.slider.element.appendChild(this.from.element);
    }
    this.slider.element.appendChild(this.to.element);
    if (this.viewSettings.bar) {
      this.slider.element.appendChild(this.range.element);
    }

    const THUMB_VERTICAL = 'thumb-vertical';
    const RS_VERTICAL = 'range-slider_vertical';
    const RS_SCALE_VERTICAL = 'scale_vertical';
    if (this.viewSettings.vertical) {
      this.slider.element.classList.add(RS_VERTICAL);
      this.scale.element.classList.add(RS_SCALE_VERTICAL);

      // add class for vertical thumbs
      if (this.viewSettings.range) {
        this.from.element.classList.add(THUMB_VERTICAL);
      }
      this.to.element.classList.add(THUMB_VERTICAL);
    } else {
      this.slider.element?.classList.remove(RS_VERTICAL);
      this.scale.element.classList.remove(RS_SCALE_VERTICAL);

      if (this.viewSettings.range) {
        this.from.element.classList.remove(THUMB_VERTICAL);
      }
      this.to.element.classList.remove(THUMB_VERTICAL);
    }

    if (!this.viewSettings.tooltips) {
      this.from.tooltip.element.classList.add('hidden');
      this.to.tooltip.element.classList.add('hidden');
    } else {
      this.from.tooltip.element.classList.remove('hidden');
      this.to.tooltip.element.classList.remove('hidden');
    }

    if (this.viewSettings.scale) {
      this.slider.element.appendChild(this.scale.element);
      this.scale.createScaleMarks(settings, this.viewSettings);
    }

    this.setRangeSliderMargins();
    this.updateRangeSliderValues();
    this.addListenersToThumbs();
    this.setDistanceBetweenTooltips();

    if (
      process.env['NODE_ENV'] !== 'production'
      && this.viewSettings.confpanel
      && this.configurationPanel
    ) {
      this.slider.element.after(this.configurationPanel.element);
      this.configurationPanel.updateState(this.modelSettings, this.viewSettings);
    }

    this.handleUpdateRangeSliderView();

    return this;
  }

  public destroyView(): View {
    this.scale.element.replaceChildren();
    this.slider.element.replaceChildren();

    return this;
  }

  private setBindings(): void {
    this.handleBeginSliding = this.handleBeginSliding.bind(this);
    this.handleMoveClosestThumb = this.handleMoveClosestThumb.bind(this);
    this.setMargins = this.setMargins.bind(this);
    this.changeCurrentPos = this.changeCurrentPos.bind(this);
  }

  private updateRangeSliderValues(): View {
    const { vertical } = this.viewSettings;

    this.range.setMarginFromBegin(this.viewSettings.rangeMarginFrom, vertical);
    this.from.setMargin(this.viewSettings.thumbMarginFrom, this.viewSettings);
    this.from.tooltip.setTooltipText(this.modelSettings.from, this.modelSettings);

    this.range.setMarginFromEnd(this.viewSettings.rangeMarginTo, vertical);
    this.to.setMargin(this.viewSettings.thumbMarginTo, this.viewSettings);
    this.to.tooltip.setTooltipText(this.modelSettings.to, this.modelSettings);

    return this;
  }

  private handleChangeSettingsObserverNotify = (): void => {
    this.changeSettingsObserver.notifyObservers(this.modelSettings);
  };

  private handleUpdateRangeSliderView = (): void => {
    this.setRangeSliderMargins();
    this.updateRangeSliderValues();

    if (!this.viewSettings.vertical) {
      this.scale.element.replaceChildren();
      this.scale.createScaleMarks(this.modelSettings, this.viewSettings);
    }

    this.setDistanceBetweenTooltips();
  };

  private addListenersToThumbs(): View {
    if (this.viewSettings.range) {
      this.from.element.addEventListener('pointerdown', this.handleBeginSliding);
      this.from.element.addEventListener('pointerup', View.handleStopSliding);
    }
    this.to.element.addEventListener('pointerdown', this.handleBeginSliding);
    this.to.element.addEventListener('pointerup', View.handleStopSliding);

    this.slider.element.addEventListener('pointerdown', this.handleMoveClosestThumb);
    this.slider.element.addEventListener('pointerup', this.handleChangeSettingsObserverNotify);
    window.addEventListener('DOMContentLoaded', this.handleUpdateRangeSliderView);
    window.addEventListener('resize', this.handleUpdateRangeSliderView);

    return this;
  }

  private changeCurrentPos(e: PointerEvent, value?: number): number {
    let currentPos: number;
    if (value || value === 0) {
      currentPos = value;
    } else {
      currentPos = this.getPosOnScale(this.currentCursorPosition(e));
    }

    this.modelSettings.currentPos = this.isLastMarkValue(e)
      ? 100
      : this.convertPosInPercents(currentPos);

    this.changeCurrentPosObserver.notifyObservers(this.modelSettings);

    return currentPos;
  }

  private isLastMarkValue(e: PointerEvent): boolean {
    const target = <HTMLElement> e.target;
    const markValue = target.classList.contains('scale__mark-value');

    if (markValue) {
      if (target.nextSibling === null) return true;
    }

    return false;
  }

  private setEventTarget(target: HTMLElement): HTMLElement {
    if (target.classList.contains('tooltip-from')) {
      return this.from.element;
    }
    if (target.classList.contains('tooltip-to')) {
      return this.to.element;
    }
    return target;
  }

  private handleBeginSliding(event: PointerEvent): HTMLElement {
    event.preventDefault();
    const target = this.setEventTarget(<HTMLElement> event.target);
    target.setPointerCapture(event.pointerId);

    target.onpointermove = (e: PointerEvent): void => {
      let thumbName: ThumbName = 'to';

      if (target.classList.contains('thumb-from')) {
        thumbName = 'from';
      }

      if (target.classList.contains('thumb-to')) {
        thumbName = 'to';
      }

      this.changeCurrentPos(e);
      this.updateMargins(this.modelSettings, thumbName);

      this.updateRangeSliderValues();
      this.setDistanceBetweenTooltips();
    };
    return target;
  }

  private static handleStopSliding(event: PointerEvent): HTMLElement {
    const target = <HTMLElement> event.target;
    target.onpointermove = null;
    target.releasePointerCapture(event.pointerId);
    return target;
  }

  private handleMoveClosestThumb(e: PointerEvent): View {
    const target = <HTMLElement> e.target;

    let currentPos: number;
    if (target.classList.contains('scale__mark-value')) {
      // TODO check vertical last mark value
      const currentPosValue = this.viewSettings.vertical
        ? Number(target.style.marginTop.slice(0, -2))
        : Number(target.style.marginLeft.slice(0, -2));

      currentPos = this.changeCurrentPos(e, currentPosValue);
    } else {
      currentPos = this.changeCurrentPos(e);
    }

    // get closest thumb from cursor
    let thumbName: ThumbName = 'to';

    if (this.viewSettings.range) {
      const fromPos = this.viewSettings.thumbMarginFrom;
      const toPos = this.viewSettings.thumbMarginTo;

      const fromDiff = this.getDifferenceBetween(currentPos, fromPos);
      const toDiff = this.getDifferenceBetween(currentPos, toPos);

      thumbName = fromDiff < toDiff ? 'from' : 'to';
    }
    // get closest thumb from cursor end

    this.updateMargins(this.modelSettings, thumbName);
    this.updateRangeSliderValues();

    if (this.viewSettings.range) {
      this.setZIndexTop(thumbName);
    }

    this.setDistanceBetweenTooltips();

    return this;
  }

  private updateMargins(settings: IModelSettings, thumbName: ThumbName): View {
    if (settings.posWithStepInPercents !== undefined) {
      const currentPosWithStep = this.convertPercentsToPixels(
        settings.posWithStepInPercents,
      );

      this.setMargins(thumbName, currentPosWithStep);
    }
    return this;
  }

  private getDifferenceBetween(
    currentPos: number,
    thumbMargin: number,
  ): number {
    return Math.abs(currentPos - thumbMargin);
  }

  private convertPosInPercents(currentPos: number): number {
    const sliderRect = this.slider.element.getBoundingClientRect();

    const sliderLengthInPx = this.viewSettings.vertical
      ? sliderRect.height
      : sliderRect.width;

    const sliderOnePercentInPx = sliderLengthInPx / 100;
    const currentPosInPercents = currentPos / sliderOnePercentInPx;
    return currentPosInPercents;
  }

  private getPosOnScale(currentPos: number): number {
    const sliderRect = this.slider.element.getBoundingClientRect();

    return this.viewSettings.vertical
      ? currentPos - sliderRect.top
      : currentPos - sliderRect.left;
  }

  private currentCursorPosition(event: PointerEvent): number {
    let currentPos: number = this.viewSettings.vertical
      ? event.clientY
      : event.clientX;

    let { min, max } = getMinMaxElementEdgesInPx(this.viewSettings, this.slider);

    // set Edge values to thumbs for twoRunners slider
    if (this.viewSettings.range) {
      const target = <HTMLElement> event.target;
      let stepInPx = 0;
      if (this.modelSettings.stepInPercents) {
        stepInPx = this.convertPercentsToPixels(this.modelSettings.stepInPercents);
      }

      if (target.classList.contains('thumb-from')) {
        max = this.viewSettings.thumbMarginTo - stepInPx + min;
      } else if (target.classList.contains('thumb-to')) {
        min = this.viewSettings.thumbMarginFrom + stepInPx + min;
      }
    }

    // validate currentPos
    if (currentPos < min) {
      currentPos = min;
    }
    if (currentPos > max) {
      currentPos = max;
    }
    return currentPos;
  }

  private setMargins(thumbName: ThumbName, currentPosWithStep: number): View {
    if (thumbName === 'from') {
      this.viewSettings.thumbMarginFrom = currentPosWithStep;
      this.viewSettings.rangeMarginFrom = currentPosWithStep;

      if (this.modelSettings.curPosInPoints !== undefined) {
        this.modelSettings.from = this.modelSettings.curPosInPoints;
      }
      this.modelSettings.curPosInPoints = undefined;
    }

    if (thumbName === 'to') {
      const { min, max } = getMinMaxElementEdgesInPx(this.viewSettings, this.slider);
      const sliderLengthInPx: number = max - min;

      this.viewSettings.thumbMarginTo = currentPosWithStep;
      this.viewSettings.rangeMarginTo = sliderLengthInPx - currentPosWithStep;

      if (this.modelSettings.curPosInPoints !== undefined) {
        this.modelSettings.to = this.modelSettings.curPosInPoints;
      }
      this.modelSettings.curPosInPoints = undefined;
    }

    return this;
  }

  private setRangeSliderMargins(): View {
    this.getMarginObserver.notifyObservers(this.modelSettings);

    if (this.viewSettings.range) {
      const marginFrom = this.convertPercentsToPixels(
        this.viewSettings.thumbMarginFrom,
      );
      this.setMargins('from', marginFrom);
    } else {
      this.setMargins('from', 0);
    }

    const marginTo = this.convertPercentsToPixels(
      this.viewSettings.thumbMarginTo,
    );
    this.setMargins('to', marginTo);

    return this;
  }

  private convertPercentsToPixels(valInPercents: number): number {
    const sliderRect = this.slider.element.getBoundingClientRect();

    const sliderLengthInPx = this.viewSettings.vertical
      ? sliderRect.height
      : sliderRect.width;

    const onePercentInPx = sliderLengthInPx / 100;

    return onePercentInPx * valInPercents;
  }

  private isTooltipsCollision(): boolean {
    let fromEdge: number;
    let toEdge: number;

    const fromRect = this.from.element.getBoundingClientRect();
    const toRect = this.to.element.getBoundingClientRect();

    if (this.viewSettings.vertical) {
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
      if (this.viewSettings.vertical) {
        this.setThumbsPosition('px', '-12', '15', '12', '15');
      } else {
        this.setThumbsPosition('%', '-130', '-105', '-130', '5');
      }
    } else if (this.viewSettings.vertical) {
      this.setThumbsPosition('px', '0', '15', '0', '15');
    } else {
      this.setThumbsPosition('%', '-130', '-50', '-130', '-50');
    }
    return this;
  }

  private setThumbsPosition = (
    mu: MeasureUnit,
    fromTop: string,
    fromLeft: string,
    toTop: string,
    toLeft: string,
  ): View => {
    const from = this.from.tooltip.element.style;
    const to = this.to.tooltip.element.style;

    from.top = fromTop + mu;
    from.left = fromLeft + mu;
    to.top = toTop + mu;
    to.left = toLeft + mu;

    return this;
  };

  private setZIndexTop(thumb: ThumbName): View {
    const from = this.from.element;
    const to = this.to.element;

    const zIndexClass = 'tooltip-z-index-top';

    if (thumb === 'from') {
      from.classList.add(zIndexClass);
      to.classList.remove(zIndexClass);
    }

    if (thumb === 'to') {
      from.classList.remove(zIndexClass);
      to.classList.add(zIndexClass);
    }
    return this;
  }
}

export default View;
