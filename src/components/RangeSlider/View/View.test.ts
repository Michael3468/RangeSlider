/**
 * @jest-environment jsdom
 */

/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

import View from './View';
import {
  ISettings,
  ThumbName,
  MeasureUnit,
} from '../RangeSlider/types';

class PointerEvent extends MouseEvent {
  public height: number;

  public isPrimary: boolean;

  public pointerId: number;

  public pointerType: string;

  public pressure: number;

  public tangentialPressure: number;

  public tiltX: number;

  public tiltY: number;

  public twist: number;

  public width: number;

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params);
    this.pointerId = params.pointerId!;
    this.width = params.width!;
    this.height = params.height!;
    this.pressure = params.pressure!;
    this.tangentialPressure = params.tangentialPressure!;
    this.tiltX = params.tiltX!;
    this.tiltY = params.tiltY!;
    this.twist = params.twist!;
    this.pointerType = params.pointerType!;
    this.isPrimary = params.isPrimary!;
  }

  public ReleasePointerCapture(): any {}

  public getCoalescedEvents(): any {}

  public getPredictedEvents(): any {}
}
global.PointerEvent = <any> PointerEvent;

abstract class ViewHint {
  abstract getPosOnScale(currentPos: number): number;

  abstract setZIndexTop(thumb: ThumbName): View;

  abstract isTooltipsCollision(): boolean;

  abstract setDistanceBetweenTooltips(): View;

  abstract setMargins(thumbName: ThumbName, currentPos: number): void;

  abstract updateRangeSliderValues(): View;

  abstract initRangeSliderMargins(): View;

  abstract handleNotifyChangeSettingsObserver(): void;
}

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    range: true,
    scale: true,
    vertical: true,
    tooltips: true,
    confpanel: true,
    bar: true,
    from: 1000,
    to: 1490,
    step: 10,
  };
});

function createRS(settings: ISettings) {
  const view = new View('range-slider', settings);
  return view.createRangeSlider(settings);
}

describe('constructor', () => {
  function testConstructor(settings: ISettings) {
    expect(createRS(settings)['slider'].element.nodeName).toBe('DIV');

    const isHasId = createRS(settings)['slider'].element.id;
    expect(isHasId).toBe('range-slider');

    const isHasClass = createRS(settings)['slider'].element.classList.contains('range-slider');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = createRS(settings)['slider'].element.classList.contains('range-slider_vertical');

    return isHasClassVertical;
  }

  test('should return "div" element with id="range-slider" and class="range-slider"', () => {
    settings.vertical = false;
    const isHasClassVertical = testConstructor(settings);

    expect(isHasClassVertical).toBeFalsy();
  });

  test('should return "div" with id="range-slider" and class="range-slider range-slider_vertical"', () => {
    settings.vertical = true;
    const isHasClassVertical = testConstructor(settings);

    expect(isHasClassVertical).toBeTruthy();
  });
});

describe('public createRangeSlider', () => {
  const spyFunc = jest.fn((sliderId: string) => {
    const sliderElement = document.createElement('div');
    sliderElement.id = sliderId;
    return sliderElement;
  });

  Object.defineProperty(global.document, 'querySelector', { value: spyFunc });

  function testChild(settings: ISettings, childNum: number, childClass: string) {
    const firstChildThumb = createRS(settings)['slider'].element.children[childNum];
    const isHasClass = firstChildThumb?.classList.contains(childClass);
    expect(isHasClass).toBeTruthy();
  }

  test('should return slider with one runner', () => {
    settings.range = false;
    testChild(settings, 0, 'thumb-to');
    testChild(settings, 1, 'range-slider__range');
  });

  test('should return slider with two runners', () => {
    settings.range = true;
    testChild(settings, 0, 'thumb-from');
    testChild(settings, 1, 'thumb-to');
    testChild(settings, 2, 'range-slider__range');
  });

  function isSliderHasClassVertical(settings: ISettings) {
    return createRS(settings)['slider'].element.classList.contains('range-slider_vertical');
  }

  function isScaleHasClassVertical(settings: ISettings) {
    return createRS(settings)['scale'].element.classList.contains('scale_vertical');
  }

  /* if (settings.vertical) and if (settings.tooltips) */
  function isTooltipFromHaveClassVertical(settings: ISettings) {
    return createRS(settings)['from'].tooltip.element.classList.contains('tooltip_vertical');
  }
  function isTooltipToHaveClassVertical(settings: ISettings) {
    return createRS(settings)['to'].tooltip.element.classList.contains('tooltip_vertical');
  }

  /* if (settings.vertical) and if (settings.range) */
  function isThumbFromHaveClassVertical(settings: ISettings) {
    return createRS(settings)['from'].element.classList.contains('thumb-vertical');
  }
  function isThumbToHaveClassVertical(settings: ISettings) {
    return createRS(settings)['to'].element.classList.contains('thumb-vertical');
  }

  test('if settings.vertical == true, should add vertical classes, ', () => {
    /* if (settings.vertical) */
    settings.vertical = true;
    expect(isSliderHasClassVertical(settings)).toBeTruthy();

    settings.vertical = false;
    expect(isSliderHasClassVertical(settings)).toBeFalsy();

    settings.vertical = true;
    expect(isScaleHasClassVertical(settings)).toBeTruthy();

    settings.vertical = false;
    expect(isScaleHasClassVertical(settings)).toBeFalsy();

    /* if (settings.vertical) and if (settings.tooltips) */
    settings.vertical = true;
    settings.tooltips = false;
    expect(isTooltipFromHaveClassVertical(settings)).toBeFalsy();
    expect(isTooltipToHaveClassVertical(settings)).toBeFalsy();

    settings.vertical = false;
    settings.tooltips = true;
    expect(isTooltipFromHaveClassVertical(settings)).toBeFalsy();
    expect(isTooltipToHaveClassVertical(settings)).toBeFalsy();

    /* if (settings.vertical) and if (settings.range) */
    settings.vertical = true;
    settings.range = true;
    expect(isThumbFromHaveClassVertical(settings)).toBeTruthy();
    expect(isThumbToHaveClassVertical(settings)).toBeTruthy();

    settings.vertical = true;
    settings.range = false;
    expect(isThumbFromHaveClassVertical(settings)).toBeFalsy();
    expect(isThumbToHaveClassVertical(settings)).toBeTruthy();
  });

  /* if (!settings.tooltips) */
  function isTooltipFromHaveClassHidden(settings: ISettings) {
    return createRS(settings)['from'].tooltip.element.classList.contains('hidden');
  }

  function isTooltipToHaveClassHidden(settings: ISettings) {
    return createRS(settings)['to'].tooltip.element.classList.contains('hidden');
  }

  /* if (!settings.tooltips) */
  test('should return tooltips with class="hidden"', () => {
    settings.tooltips = true;
    expect(isTooltipFromHaveClassHidden(settings)).toBeFalsy();
    expect(isTooltipToHaveClassHidden(settings)).toBeFalsy();

    settings.tooltips = false;
    expect(isTooltipFromHaveClassHidden(settings)).toBeTruthy();
    expect(isTooltipToHaveClassHidden(settings)).toBeTruthy();
  });

  /* if (settings.scale) */
  function isHasScale(settings: ISettings) {
    if (settings.range) {
      return createRS(settings)['slider'].element.children[3]?.classList.contains('scale');
    }
    return createRS(settings)['slider'].element.children[2]?.classList.contains('scale');
  }

  test('should return slider with scale element', () => {
    /* has child */
    settings.scale = true;
    settings.range = true;
    expect(isHasScale(settings)).toBeTruthy();

    settings.scale = true;
    settings.range = false;
    expect(isHasScale(settings)).toBeTruthy();

    /* has no child */
    settings.scale = false;
    settings.range = true;
    expect(isHasScale(settings)).toBeFalsy();

    settings.scale = false;
    settings.range = false;
    expect(isHasScale(settings)).toBeFalsy();
  });

  test('if (settings.scale) "createScaleMarks" should have been called ', () => {
    settings.scale = true;
    let view = new View('range-slider', settings);
    let createScaleMarksSpy = jest.spyOn(view['scale'], 'createScaleMarks');
    view.createRangeSlider(settings);
    expect(createScaleMarksSpy).toHaveBeenCalled();

    settings.scale = false;
    view = new View('range-slider', settings);
    createScaleMarksSpy = jest.spyOn(view['scale'], 'createScaleMarks');
    view.createRangeSlider(settings);
    expect(createScaleMarksSpy).not.toHaveBeenCalled();
  });
});

describe('private isTooltipsCollision', () => {
  test('check settings.vertical - true', () => {
    settings.vertical = true;
    const view = new View('range-slider', settings);

    view['from'].element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100, /* value to check */
      left: 100,
      bottom: 120,
      right: 120,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    view['to'].element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100, /* value to check */
      left: 120,
      bottom: 120,
      right: 140,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    view['to'].tooltip.element.getBoundingClientRect = jest.fn(() => ({
      width: 40,
      height: 20, /* value to check */
      top: 100,
      left: 120,
      bottom: 120,
      right: 160,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    let result = view['isTooltipsCollision']();
    expect(result).toBeTruthy();

    view['to'].element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 150, /* value 150 to return false */
      left: 120,
      bottom: 120,
      right: 140,
      x: 150,
      y: 100,
      toJSON: () => {},
    }));

    result = view['isTooltipsCollision']();
    expect(result).toBeFalsy();
  });

  test('check settings.vertical - false', () => {
    settings.vertical = false;
    const view = new View('range-slider', settings);

    view['from'].element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100,
      left: 100,
      bottom: 120,
      right: 120, /* value to check */
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    view['to'].element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100,
      left: 100,
      bottom: 120,
      right: 140, /* value to check */
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    view['to'].tooltip.element.getBoundingClientRect = jest.fn(() => ({
      width: 40, /* value to check */
      height: 20,
      top: 100,
      left: 150,
      bottom: 120,
      right: 160,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    let result = view['isTooltipsCollision']();
    expect(result).toBeTruthy();

    view['to'].element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100,
      left: 130, /* value 170 to return false */
      bottom: 120,
      right: 170,
      x: 150,
      y: 100,
      toJSON: () => {},
    }));

    result = view['isTooltipsCollision']();
    expect(result).toBeFalsy();
  });
});

describe('private setDistanceBetweenTooltips', () => {
  test('should move tooltips in different directions (vertical)', () => {
    settings.vertical = true;
    const view = new View('range-slider', settings);
    jest.spyOn(view as unknown as ViewHint, 'isTooltipsCollision').mockReturnValue(true);

    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result['from'].tooltip.element.style.top;
    const toTop = result['to'].tooltip.element.style.top;

    expect(fromTop).toBe('-12px');
    expect(toTop).toBe('12px');
  });

  test('should move tooltips close to each other (vertical)', () => {
    settings.vertical = true;
    const view = new View('range-slider', settings);
    jest.spyOn(view as unknown as ViewHint, 'isTooltipsCollision').mockReturnValue(false);

    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result['from'].tooltip.element.style.top;
    const toTop = result['to'].tooltip.element.style.top;

    expect(fromTop).toBe('0px');
    expect(toTop).toBe('0px');
  });

  test('should move tooltips in different directions (horizontal)', () => {
    settings.vertical = false;
    const view = new View('range-slider', settings);
    jest.spyOn(view as unknown as ViewHint, 'isTooltipsCollision').mockReturnValue(true);

    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result['from'].tooltip.element.style.left;
    const toTop = result['to'].tooltip.element.style.left;

    expect(fromTop).toBe('-105%');
    expect(toTop).toBe('5%');
  });

  test('should move tooltips close to each other (horizontal)', () => {
    settings.vertical = false;
    const view = new View('range-slider', settings);
    jest.spyOn(view as unknown as ViewHint, 'isTooltipsCollision').mockReturnValue(false);

    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result['from'].tooltip.element.style.left;
    const toTop = result['to'].tooltip.element.style.left;

    expect(fromTop).toBe('-50%');
    expect(toTop).toBe('-50%');
  });
});

describe('private setZIndexTop', () => {
  const settings: ISettings = {
    min: 0,
    max: 1500,
    range: true,
    scale: true,
    vertical: true,
    tooltips: true,
    confpanel: true,
    bar: true,
    from: 1000,
    to: 1490,
    step: 10,
  };

  const zIndexClass = 'tooltip-z-index-top';
  const view = new View('range-slider', settings);

  test('should add zIndexClass to "from" element and del from "to" element', () => {
    const result = view['setZIndexTop']('from');
    const fromContainsClass = result['from'].element.classList.contains(zIndexClass);
    const toContainsClass = result['to'].element.classList.contains(zIndexClass);
    expect(fromContainsClass).toBeTruthy();
    expect(toContainsClass).toBeFalsy();
  });

  test('should del zIndexClass from "from" element and add to "to" element', () => {
    const result = view['setZIndexTop']('to');
    const fromContainsClass = result['from'].element.classList.contains(zIndexClass);
    const toContainsClass = result['to'].element.classList.contains(zIndexClass);
    expect(fromContainsClass).toBeFalsy();
    expect(toContainsClass).toBeTruthy();
  });
});

describe('private currentCursorPosition', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 30,
      height: 300,
      top: 100,
      left: 100,
      bottom: 400,
      right: 130,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    settings.vertical = true;
    settings.range = true;
  });

  test('should return currentPos > max', () => {
    const downEvent = new PointerEvent(
      'pointerdown',
      {
        bubbles: true,
        cancelable: true,
        clientX: 590,
        clientY: 590,
      },
    );

    const view = new View('range-slider', settings);
    view['thumbMarginTo'] = 150; /* +min(100) -step(2) = 248 */

    view['from'].element.dispatchEvent(downEvent);
    const result = view['currentCursorPosition'](downEvent);
    expect(result).toBe(248);
  });

  test('should return currentPos < min', () => {
    const downEvent = new PointerEvent(
      'pointerdown',
      {
        bubbles: true,
        cancelable: true,
        clientX: 150,
        clientY: 150,
      },
    );

    const view = new View('range-slider', settings);
    view['thumbMarginFrom'] = 110; /* +min(100) +step(2) = 212 */
    view['to'].element.dispatchEvent(downEvent);
    const result = view['currentCursorPosition'](downEvent);
    expect(result).toBe(212);
  });
});

describe('private getPosOnScale', () => {
  const topValue = 100;
  const leftValue = 200;

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 30,
      height: 300,
      top: topValue,
      left: leftValue,
      bottom: 400,
      right: 130,
      x: 100,
      y: 200,
      toJSON: () => {},
    }));
  });

  const currentPos = 250;

  test(`should return ${currentPos} - ${topValue}`, () => {
    settings.vertical = true;
    const view = new View('range-slider', settings);
    const result = view['getPosOnScale'](currentPos);

    expect(result).toBe(currentPos - topValue);
  });

  test(`should return ${currentPos} - ${topValue}`, () => {
    settings.vertical = false;
    const view = new View('range-slider', settings);
    const result = view['getPosOnScale'](currentPos);

    expect(result).toBe(currentPos - leftValue);
  });
});

describe('private getDifferenceBetween', () => {
  test('should return absolute difference between two numbers = 50', () => {
    let currentPos = 100;
    let thumbMargin = 150; /* currentPos - thumbMargin = 50 */

    let result = View['getDifferenceBetween'](currentPos, thumbMargin);
    expect(result).toBe(50);

    currentPos = 200;
    thumbMargin = 150; /* currentPos - thumbMargin = -50 */

    result = View['getDifferenceBetween'](currentPos, thumbMargin);
    expect(result).toBe(50);
  });
});

describe('private handleMoveClosestThumbPointerEvent', () => {
  function testMoveClosestThumb(view: View, clickPosition: number) {
    /* 'should' return mouseEvent coords */
    jest.spyOn(view as unknown as ViewHint, 'getPosOnScale').mockReturnValueOnce(clickPosition);

    const updateRangeSliderValuesSpy = jest.spyOn(view, 'updateRangeSliderValues');
    const setZIndexTopSpy = jest.spyOn(view as unknown as ViewHint, 'setZIndexTop');
    const setDistanceBetweenTooltipsSpy = jest
      .spyOn(view as unknown as ViewHint, 'setDistanceBetweenTooltips');

    const downEvent = new PointerEvent(
      'pointerdown',
      {
        bubbles: true,
        cancelable: true,
        clientX: clickPosition,
        clientY: 150,
      },
    );

    view['slider'].element.dispatchEvent(downEvent);
    const result = view['handleMoveClosestThumbPointerEvent'](downEvent);

    return {
      updateRangeSliderValuesSpy,
      setZIndexTopSpy,
      setDistanceBetweenTooltipsSpy,
      result,
    };
  }

  function isHasClasses(result: View, thumbName: ThumbName) {
    const isHasThumbClass = result[thumbName].element.classList.contains(`thumb-${thumbName}`);
    expect(isHasThumbClass).toBeTruthy();

    const isHasZIndexClass = result[thumbName].element.classList.contains('tooltip-z-index-top');
    expect(isHasZIndexClass).toBeTruthy();
  }

  test('should return thumbMarginFrom = \'clickPosition\'', () => {
    settings.range = true;
    const view = new View('range-slider', settings);
    view['thumbMarginFrom'] = 150;
    view['thumbMarginTo'] = 250;

    const clickPosition = 100;

    const {
      updateRangeSliderValuesSpy,
      setZIndexTopSpy,
      setDistanceBetweenTooltipsSpy,
      result,
    } = testMoveClosestThumb(view, clickPosition);

    expect(result['thumbMarginFrom']).toBe(clickPosition);
    expect(result['thumbMarginTo']).not.toBe(clickPosition);
    expect(updateRangeSliderValuesSpy).toBeCalled();
    expect(setDistanceBetweenTooltipsSpy).toBeCalled();

    if (result['settings'].range) {
      expect(setZIndexTopSpy).toBeCalled();

      isHasClasses(result, 'from');
    }
  });

  test('should return thumbMarginTo = \'clickPosition\'', () => {
    settings.range = true;
    const view = new View('range-slider', settings);
    view['thumbMarginFrom'] = 150;
    view['thumbMarginTo'] = 250;

    const clickPosition = 200;

    const {
      updateRangeSliderValuesSpy,
      setZIndexTopSpy,
      setDistanceBetweenTooltipsSpy,
      result,
    } = testMoveClosestThumb(view, clickPosition);

    expect(result['thumbMarginFrom']).not.toBe(clickPosition);
    expect(result['thumbMarginTo']).toBe(clickPosition);
    expect(updateRangeSliderValuesSpy).toBeCalled();
    expect(setDistanceBetweenTooltipsSpy).toBeCalled();

    if (result['settings'].range) {
      expect(setZIndexTopSpy).toBeCalled();

      isHasClasses(result, 'to');
    }
  });
});

describe('private handleStopSlidingPointerEvent', () => {
  test('event.target.onpointermove should return null', () => {
    const upEvent = new PointerEvent('pointerup', {
      pointerId: 1,
      bubbles: true,
      cancelable: true,
      clientX: 150,
      clientY: 150,
      pointerType: 'touch',
      width: 20,
      height: 20,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      isPrimary: true,
    });

    Element.prototype.releasePointerCapture = jest.fn().mockReturnValue(undefined);
    const view = new View('range-slider', settings);
    view['to'].element.dispatchEvent(upEvent);
    const result = View['handleStopSlidingPointerEvent'](upEvent);

    expect(result.onpointermove).toBeNull();
  });
});

describe('private handleBeginSlidingPointerEvent', () => {
  function getMoveEvent() {
    const moveEvent = new PointerEvent('pointermove', {
      pointerId: 1,
      bubbles: true,
      cancelable: true,
      clientX: 150,
      clientY: 150,
      pointerType: 'touch',
      width: 20,
      height: 20,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      isPrimary: true,
    });

    return moveEvent;
  }

  function getSpyMethods() {
    const view = new View('range-slider', settings);

    const currentPos = 150;
    const getPosOnScaleSpy = jest
      .spyOn(view as unknown as ViewHint, 'getPosOnScale')
      .mockReturnValue(currentPos);
    const setMarginsSpy = jest.spyOn(view as unknown as ViewHint, 'setMargins');
    const updateRangeSliderValuesSpy = jest
      .spyOn(view as unknown as ViewHint, 'updateRangeSliderValues');
    const setDistanceBetweenTooltipsSpy = jest
      .spyOn(view as unknown as ViewHint, 'setDistanceBetweenTooltips');

    return {
      view,
      currentPos,
      getPosOnScaleSpy,
      setMarginsSpy,
      updateRangeSliderValuesSpy,
      setDistanceBetweenTooltipsSpy,
    };
  }

  it('should call setMargins method with thumbName = "from"', () => {
    const moveEvent = getMoveEvent();

    Element.prototype.setPointerCapture = jest.fn().mockReturnValueOnce(undefined);

    const {
      view,
      currentPos,
      getPosOnScaleSpy,
      setMarginsSpy,
      updateRangeSliderValuesSpy,
      setDistanceBetweenTooltipsSpy,
    } = getSpyMethods();

    view['from'].element.dispatchEvent(moveEvent);
    const result = view['handleBeginSlidingPointerEvent'](moveEvent);
    expect(result.onpointermove).not.toBeNull();

    result.onpointermove!(moveEvent);
    expect(getPosOnScaleSpy).toBeCalled();

    expect(setMarginsSpy).toBeCalled();
    expect(setMarginsSpy).toBeCalledWith('from', currentPos);

    expect(updateRangeSliderValuesSpy).toBeCalled();
    expect(setDistanceBetweenTooltipsSpy).toBeCalled();
  });

  it('should call setMargins method with thumbName = "to"', () => {
    const moveEvent = getMoveEvent();

    Element.prototype.setPointerCapture = jest.fn().mockReturnValueOnce(undefined);

    const {
      view,
      currentPos,
      getPosOnScaleSpy,
      setMarginsSpy,
      updateRangeSliderValuesSpy,
      setDistanceBetweenTooltipsSpy,
    } = getSpyMethods();

    view['to'].element.dispatchEvent(moveEvent);
    const result = view['handleBeginSlidingPointerEvent'](moveEvent);
    expect(result.onpointermove).not.toBeNull();

    result.onpointermove!(moveEvent);
    expect(getPosOnScaleSpy).toBeCalled();

    expect(setMarginsSpy).toBeCalled();
    expect(setMarginsSpy).toBeCalledWith('to', currentPos);

    expect(updateRangeSliderValuesSpy).toBeCalled();
    expect(setDistanceBetweenTooltipsSpy).toBeCalled();
  });
});

describe('private addListenersToThumbs', () => {
  function testAddListenerToThumbs(settings: ISettings) {
    const view = new View('range-slider', settings);

    const initRangeSliderMarginsSpy = jest
      .spyOn(view as unknown as ViewHint, 'initRangeSliderMargins');
    const updateRangeSliderValuesSpy = jest
      .spyOn(view, 'updateRangeSliderValues');
    const setDistanceBetweenTooltipsSpy = jest
      .spyOn(view as unknown as ViewHint, 'setDistanceBetweenTooltips');
    const createScaleMarksSpy = jest.spyOn(view['scale'], 'createScaleMarks');

    view['addListenersToThumbs']();

    window.dispatchEvent(new Event('resize'));
    expect(initRangeSliderMarginsSpy).toBeCalled();
    expect(updateRangeSliderValuesSpy).toBeCalled();
    expect(setDistanceBetweenTooltipsSpy).toBeCalled();

    return createScaleMarksSpy;
  }

  it('should NOT recreate scale marks on window resize on vertical slider', () => {
    settings.vertical = true;
    const createScaleMarksSpy = testAddListenerToThumbs(settings);

    expect(createScaleMarksSpy).not.toBeCalled();
  });

  it('should recreate scale marks on window resize on horizontal slider', () => {
    settings.vertical = false;
    const createScaleMarksSpy = testAddListenerToThumbs(settings);

    expect(createScaleMarksSpy).toBeCalled();
  });
});

describe('private setTopLeft', () => {
  it('should return style values in form "param" + "mu" (mu === "px" | "%")', () => {
    const view = new View('range-slider', settings);
    const mu: MeasureUnit = 'px';
    const fTop = '1';
    const fLeft = '2';
    const tTop = '3';
    const tLeft = '4';
    const result = view['setTopLeft'](mu, fTop, fLeft, tTop, tLeft);

    const fromTop = result['from'].tooltip.element.style.top;
    const fromLeft = result['from'].tooltip.element.style.left;
    const toTop = result['to'].tooltip.element.style.top;
    const toLeft = result['to'].tooltip.element.style.left;

    expect(fromTop).toBe(fTop + mu);
    expect(fromLeft).toBe(fLeft + mu);
    expect(toTop).toBe(tTop + mu);
    expect(toLeft).toBe(tLeft + mu);
  });
});

describe('private handleNotifyChangeSettingsObserver', () => {
  it('should be called with this.settings', () => {
    const view = new View('range-slider', settings);
    const spyChangeSettingsObserverNotify = jest
      .spyOn(view.changeSettingsObserver, 'notifyObservers');

    view['handleNotifyChangeSettingsObserver']();

    expect(spyChangeSettingsObserverNotify).toBeCalledWith(settings);
  });
});
