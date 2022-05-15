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
  ISettings,
  MeasureUnit,
  ThumbName,
} from '../RangeSlider/types';

class View {
  private slider: AbstractSlider;

  private from: AbstractThumb;

  private to: AbstractThumb;

  private range: AbstractRange;

  private scale: AbstractScale;

  settings: ISettings;

  private rangeMarginTo: number;

  private rangeMarginFrom: number;

  isTooltipsCollision = false;

  configurationPanel?: AbstractConfigurationPanel;

  changeSettingsObserver: AbstractObserver;

  tooltipsCollisionObserver: AbstractObserver;

  changeCurrentPosObserver: AbstractObserver;

  updateThumbsValueObserver: AbstractObserver;

  getMarginObserver: AbstractObserver;

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
    this.settings.thumbMarginFrom = 0;
    this.settings.thumbMarginTo = 0;

    this.handleBeginSlidingPointerEvent = this.handleBeginSlidingPointerEvent.bind(this);
    this.handleMoveClosestThumbPointerEvent = this.handleMoveClosestThumbPointerEvent.bind(this);
    this.setMargins = this.setMargins.bind(this);

    this.changeSettingsObserver = new Observer();
    this.tooltipsCollisionObserver = new Observer();
    this.changeCurrentPosObserver = new Observer();
    this.updateThumbsValueObserver = new Observer();
    this.getMarginObserver = new Observer();
  }

  public createRangeSlider(settings: ISettings): View {
    if (!this.slider.element) {
      return this;
    }

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

    this.setRangeSliderMargins();
    this.updateRangeSliderValues();
    this.addListenersToThumbs();
    this.setDistanceBetweenTooltips();

    if (
      process.env['NODE_ENV'] !== 'production'
      && settings.confpanel
      && this.configurationPanel
    ) {
      this.slider.element.after(this.configurationPanel.element);
      this.configurationPanel.updateState(this.settings);
    }

    this.handleUpdateRangeSliderView();

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

  private updateRangeSliderValues(): View {
    const vertical = <boolean> this.settings?.vertical;

    this.range.setMarginFromBegin(this.rangeMarginFrom, vertical);
    this.from.setMargin(<number> this.settings.thumbMarginFrom, this.settings);
    this.from.tooltip.setTooltipText(this.settings.from, this.settings);

    this.range.setMarginFromEnd(this.rangeMarginTo, vertical);
    this.to.setMargin(<number> this.settings.thumbMarginTo, this.settings);
    this.to.tooltip.setTooltipText(this.settings.to, this.settings);

    return this;
  }

  private handleChangeSettingsObserverNotify = (): void => {
    this.changeSettingsObserver.notifyObservers(this.settings);
  };

  private handleUpdateRangeSliderView = (): void => {
    this.setRangeSliderMargins();
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
    this.slider.element.addEventListener('pointerup', this.handleChangeSettingsObserverNotify);
    window.addEventListener('DOMContentLoaded', this.handleUpdateRangeSliderView);
    window.addEventListener('resize', this.handleUpdateRangeSliderView);
    return this;
  }

  private handleBeginSlidingPointerEvent(event: PointerEvent): HTMLElement {
    const target = <HTMLElement> event.target;
    event.preventDefault();
    target.setPointerCapture(event.pointerId);

    target.onpointermove = (e: PointerEvent): void => {
      let thumbName: ThumbName = 'to';

      if (target.classList.contains('thumb-from')) {
        thumbName = 'from';
      } else if (target.classList.contains('thumb-to')) {
        thumbName = 'to';
      }

      // TODO getPos
      const currentPos = this.getPosOnScale(this.currentCursorPosition(e));
      // TODO repeated code
      this.settings.currentPos = this.convertPosInPercents(currentPos);

      this.changeCurrentPosObserver.notifyObservers(this.settings);
      // TODO getPos end

      // TODO updateMargins
      if (this.settings.posWithStepInPercents !== undefined) {
        const currentPosWithStep = this.convertPercentsToPixels(
          this.settings.posWithStepInPercents,
        );

        this.setMargins(thumbName, currentPosWithStep);
      }
      // TODO updateMargins end
      // TODO repeated code end

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
    // TODO getPos
    const currentPos = this.getPosOnScale(this.currentCursorPosition(e));
    this.settings.currentPos = this.convertPosInPercents(currentPos);

    this.changeCurrentPosObserver.notifyObservers(this.settings);
    // TODO getPos end

    // getClosestThumbFromCursor
    const fromPos = <number> this.settings.thumbMarginFrom;
    const toPos = <number> this.settings.thumbMarginTo;
    let thumbName: ThumbName = 'to';

    if (this.settings.range) {
      const fromDiff = View.getDifferenceBetween(currentPos, fromPos);
      const toDiff = View.getDifferenceBetween(currentPos, toPos);

      thumbName = fromDiff < toDiff ? 'from' : 'to';
    }
    // getClosestThumbFromCursor end

    // TODO updateMargins
    if (this.settings.posWithStepInPercents !== undefined) {
      const currentPosWithStep = this.convertPercentsToPixels(
        this.settings.posWithStepInPercents,
      );

      this.setMargins(thumbName, currentPosWithStep);
    }
    // TODO updateMargins end

    this.updateRangeSliderValues();

    if (this.settings.range) {
      this.setZIndexTop(thumbName);
    }

    this.setDistanceBetweenTooltips();

    return this;
  }

  // TODO del static
  private static getDifferenceBetween(
    currentPos: number,
    thumbMargin: number,
  ): number {
    return Math.abs(currentPos - thumbMargin);
  }

  private convertPosInPercents(currentPos: number): number {
    const sliderRect = this.slider.element.getBoundingClientRect();

    const sliderLengthInPx = this.settings.vertical
      ? sliderRect.height
      : sliderRect.width;

    const sliderOnePercentInPx = sliderLengthInPx / 100;
    const currentPosInPercents = currentPos / sliderOnePercentInPx;
    return currentPosInPercents;
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

      let stepInPx = 0;
      if (this.settings.stepInPrecents) {
        stepInPx = this.convertPercentsToPixels(this.settings.stepInPrecents);
      }

      if (target.classList.contains('thumb-from')) {
        max = <number> this.settings.thumbMarginTo - stepInPx + min;
      } else if (target.classList.contains('thumb-to')) {
        min = <number> this.settings.thumbMarginFrom + stepInPx + min;
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

  private setMargins(thumbName: ThumbName, currentPosWithStep: number): void {
    if (thumbName === 'from') {
      this.settings.thumbMarginFrom = currentPosWithStep;
      this.rangeMarginFrom = currentPosWithStep;

      if (this.settings.curPosInPoints !== undefined) {
        this.settings.from = this.settings.curPosInPoints;
      }
      this.settings.curPosInPoints = undefined;
    } else if (thumbName === 'to') {
      // TODO change min max to slider rect?
      const { min, max } = getMinMaxElementEdgesInPx(this.settings, this.slider);
      const sliderLengthInPx: number = max - min;

      this.settings.thumbMarginTo = currentPosWithStep;
      this.rangeMarginTo = sliderLengthInPx - currentPosWithStep;

      if (this.settings.curPosInPoints !== undefined) {
        this.settings.to = this.settings.curPosInPoints;
      }
      this.settings.curPosInPoints = undefined;
    }
  }

  private setRangeSliderMargins(): View {
    this.getMarginObserver.notifyObservers(this.settings);

    if (this.settings.range) {
      const marginFrom = this.convertPercentsToPixels(
        <number> this.settings.thumbMarginFrom,
      );
      this.setMargins('from', marginFrom);
    } else {
      this.setMargins('from', 0);
    }

    const marginTo = this.convertPercentsToPixels(
      <number> this.settings.thumbMarginTo,
    );
    this.setMargins('to', marginTo);

    return this;
  }

  private convertPercentsToPixels(valInPercents: number): number {
    const sliderRect = this.slider.element.getBoundingClientRect();

    const sliderLengthInPx = this.settings.vertical
      ? sliderRect.height
      : sliderRect.width;

    const onePercentInPx = sliderLengthInPx / 100;

    return onePercentInPx * valInPercents;
  }

  private setDistanceBetweenTooltips(): View {
    this.settings.rectFrom = this.from.element.getBoundingClientRect();
    this.settings.rectTo = this.to.element.getBoundingClientRect();

    this.tooltipsCollisionObserver.notifyObservers(this.settings);

    // TODO move setThumbPosition parameter into the methods constants
    if (this.isTooltipsCollision) {
      if (this.settings.vertical) {
        this.setThumbsPosition('px', '-12', '15', '12', '15');
      } else {
        this.setThumbsPosition('%', '-130', '-105', '-130', '5');
      }
    } else if (this.settings.vertical) {
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
    } else if (thumb === 'to') {
      from.classList.remove(zIndexClass);
      to.classList.add(zIndexClass);
    }
    return this;
  }
}

export default View;
