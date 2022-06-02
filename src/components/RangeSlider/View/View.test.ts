/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import View from './View';

import {
  ThumbName,
  MeasureUnit,
  IModelSettings,
  IViewSettings,
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

  // eslint-disable-next-line no-undef
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

  abstract setMargins(thumbName: ThumbName, currentPos: number): View;

  abstract updateRangeSliderValues(): View;

  abstract setRangeSliderMargins(): View;

  abstract handleChangeSettingsObserverNotify(): void;

  abstract changeCurrentPos(e: PointerEvent, value?: number): number;
}

let modelSettings: IModelSettings;
let viewSettings: IViewSettings;

beforeEach(() => {
  modelSettings = {
    min: 0,
    max: 100,
    from: 30,
    to: 70,
    step: 1,

    stepInPercents: 1,
    currentPos: 0,
    posWithStepInPercents: 0,
    curPosInPoints: undefined,
  };

  viewSettings = {
    range: true,
    scale: false,
    tooltips: true,
    vertical: false,
    confpanel: false,
    bar: true,

    thumbMarginFrom: 0,
    thumbMarginTo: 0,
    rangeMarginFrom: 0,
    rangeMarginTo: 0,
  };
});

function createRS() {
  const view = new View('range-slider', modelSettings, viewSettings);
  return view.createRangeSlider(modelSettings);
}

describe('constructor', () => {
  function testConstructor() {
    expect(createRS()['slider'].element.nodeName).toBe('DIV');

    const isHasId = createRS()['slider'].element.id;
    expect(isHasId).toBe('range-slider');

    const isHasClass = createRS()['slider'].element.classList.contains('range-slider');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = createRS()['slider'].element.classList.contains('range-slider_vertical');

    return isHasClassVertical;
  }

  test('should return "div" element with id="range-slider" and class="range-slider"', () => {
    viewSettings.vertical = false;
    const isHasClassVertical = testConstructor();

    expect(isHasClassVertical).toBeFalsy();
  });

  test('should return "div" with id="range-slider" and class="range-slider range-slider_vertical"', () => {
    viewSettings.vertical = true;
    const isHasClassVertical = testConstructor();

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

  function testChild(childNum: number, childClass: string) {
    const firstChildThumb = createRS()['slider'].element.children[childNum];
    const isHasClass = firstChildThumb?.classList.contains(childClass);
    expect(isHasClass).toBeTruthy();
  }

  test('should return slider with one runner', () => {
    viewSettings.range = false;
    testChild(0, 'thumb-to');
    testChild(1, 'range-slider__range');
  });

  test('should return slider with two runners', () => {
    viewSettings.range = true;
    testChild(0, 'thumb-from');
    testChild(1, 'thumb-to');
    testChild(2, 'range-slider__range');
  });

  function isSliderHasClassVertical() {
    return createRS()['slider'].element.classList.contains('range-slider_vertical');
  }

  function isScaleHasClassVertical() {
    return createRS()['scale'].element.classList.contains('scale_vertical');
  }

  /* if (viewSettings.vertical) and if (viewSettings.tooltips) */
  function isTooltipFromHaveClassVertical() {
    return createRS()['from'].tooltip.element.classList.contains('tooltip_vertical');
  }
  function isTooltipToHaveClassVertical() {
    return createRS()['to'].tooltip.element.classList.contains('tooltip_vertical');
  }

  /* if (viewSettings.vertical) and if (viewSettings.range) */
  function isThumbFromHaveClassVertical() {
    return createRS()['from'].element.classList.contains('thumb-vertical');
  }
  function isThumbToHaveClassVertical() {
    return createRS()['to'].element.classList.contains('thumb-vertical');
  }

  test('if viewSettings.vertical == true, should add vertical classes, ', () => {
    /* if (viewSettings.vertical) */
    viewSettings.vertical = true;
    expect(isSliderHasClassVertical()).toBeTruthy();

    viewSettings.vertical = false;
    expect(isSliderHasClassVertical()).toBeFalsy();

    viewSettings.vertical = true;
    expect(isScaleHasClassVertical()).toBeTruthy();

    viewSettings.vertical = false;
    expect(isScaleHasClassVertical()).toBeFalsy();

    /* if (viewSettings.vertical) and if (settings.tooltips) */
    viewSettings.vertical = true;
    viewSettings.tooltips = false;
    expect(isTooltipFromHaveClassVertical()).toBeFalsy();
    expect(isTooltipToHaveClassVertical()).toBeFalsy();

    viewSettings.vertical = false;
    viewSettings.tooltips = true;
    expect(isTooltipFromHaveClassVertical()).toBeFalsy();
    expect(isTooltipToHaveClassVertical()).toBeFalsy();

    /* if (viewSettings.vertical) and if (viewSettings.range) */
    viewSettings.vertical = true;
    viewSettings.range = true;
    expect(isThumbFromHaveClassVertical()).toBeTruthy();
    expect(isThumbToHaveClassVertical()).toBeTruthy();

    viewSettings.vertical = true;
    viewSettings.range = false;
    expect(isThumbFromHaveClassVertical()).toBeFalsy();
    expect(isThumbToHaveClassVertical()).toBeTruthy();
  });

  /* if (!viewSettings.tooltips) */
  function isTooltipFromHaveClassHidden() {
    return createRS()['from'].tooltip.element.classList.contains('hidden');
  }

  function isTooltipToHaveClassHidden() {
    return createRS()['to'].tooltip.element.classList.contains('hidden');
  }

  /* if (!viewSettings.tooltips) */
  test('should return tooltips with class="hidden"', () => {
    viewSettings.tooltips = true;
    expect(isTooltipFromHaveClassHidden()).toBeFalsy();
    expect(isTooltipToHaveClassHidden()).toBeFalsy();

    viewSettings.tooltips = false;
    expect(isTooltipFromHaveClassHidden()).toBeTruthy();
    expect(isTooltipToHaveClassHidden()).toBeTruthy();
  });

  /* if (viewSettings.scale) */
  function isHasScale() {
    if (viewSettings.range) {
      return createRS()['slider'].element.children[3]?.classList.contains('scale');
    }
    return createRS()['slider'].element.children[2]?.classList.contains('scale');
  }

  test('should return slider with scale element', () => {
    /* has child */
    viewSettings.scale = true;
    viewSettings.range = true;
    expect(isHasScale()).toBeTruthy();

    viewSettings.scale = true;
    viewSettings.range = false;
    expect(isHasScale()).toBeTruthy();

    /* has no child */
    viewSettings.scale = false;
    viewSettings.range = true;
    expect(isHasScale()).toBeFalsy();

    viewSettings.scale = false;
    viewSettings.range = false;
    expect(isHasScale()).toBeFalsy();
  });

  test('should add configurationPanel in not "production" mode', () => {
    viewSettings.confpanel = true;
    const view = new View('range-slider', modelSettings, viewSettings);

    view.createRangeSlider(modelSettings);
    const isConfPanel = !!view.configurationPanel;
    expect(isConfPanel).toBe(true);
  });

  // test('if (viewSettings.scale) "createScaleMarks" should have been called ', () => {
  //   viewSettings.scale = true;
  //   let view = new View('range-slider', modelSettings, viewSettings);
  //   let createScaleMarksSpy = jest.spyOn(view['scale'], 'createScaleMarks');
  //   view.createRangeSlider(modelSettings);
  //   expect(createScaleMarksSpy).toHaveBeenCalled();

  //   viewSettings.scale = false;
  //   view = new View('range-slider', modelSettings, viewSettings);
  //   createScaleMarksSpy = jest.spyOn(view['scale'], 'createScaleMarks');
  //   view.createRangeSlider(modelSettings);
  //   expect(createScaleMarksSpy).not.toHaveBeenCalled();
  // });
});

describe('public destroyView', () => {
  test('scale should not has children', () => {
    const view = new View('range-slider', modelSettings, viewSettings);
    view['scale'].createScaleMarks(modelSettings, viewSettings);

    const result = view.destroyView();
    const isScaleHasChildNodes = result['scale'].element.hasChildNodes();
    expect(isScaleHasChildNodes).toBe(false);
  });

  test('slider should not has children', () => {
    const view = new View('range-slider', modelSettings, viewSettings);
    view.createRangeSlider(modelSettings);

    const result = view.destroyView();
    const isSliderHasChildNodes = result['slider'].element.hasChildNodes();
    expect(isSliderHasChildNodes).toBe(false);
  });
});

describe('private isTooltipsCollision', () => {
  test('check viewSettings.vertical - true', () => {
    viewSettings.vertical = true;
    const view = new View('range-slider', modelSettings, viewSettings);

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

  test('check viewSettings.vertical - false', () => {
    viewSettings.vertical = false;
    const view = new View('range-slider', modelSettings, viewSettings);

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
    viewSettings.vertical = true;

    const view = new View('range-slider', modelSettings, viewSettings);
    jest.spyOn(view as unknown as ViewHint, 'isTooltipsCollision').mockReturnValue(true);
    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result['from'].tooltip.element.style.top;
    const toTop = result['to'].tooltip.element.style.top;

    expect(fromTop).toBe('-12px');
    expect(toTop).toBe('12px');
  });

  test('should move tooltips close to each other (vertical)', () => {
    viewSettings.vertical = true;

    const view = new View('range-slider', modelSettings, viewSettings);
    jest.spyOn(view as unknown as ViewHint, 'isTooltipsCollision').mockReturnValue(false);
    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result['from'].tooltip.element.style.top;
    const toTop = result['to'].tooltip.element.style.top;

    expect(fromTop).toBe('0px');
    expect(toTop).toBe('0px');
  });

  test('should move tooltips in different directions (horizontal)', () => {
    viewSettings.vertical = false;

    const view = new View('range-slider', modelSettings, viewSettings);
    jest.spyOn(view as unknown as ViewHint, 'isTooltipsCollision').mockReturnValue(true);
    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result['from'].tooltip.element.style.left;
    const toTop = result['to'].tooltip.element.style.left;

    expect(fromTop).toBe('-105%');
    expect(toTop).toBe('5%');
  });

  test('should move tooltips close to each other (horizontal)', () => {
    viewSettings.vertical = false;

    const view = new View('range-slider', modelSettings, viewSettings);
    jest.spyOn(view as unknown as ViewHint, 'isTooltipsCollision').mockReturnValue(false);
    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result['from'].tooltip.element.style.left;
    const toTop = result['to'].tooltip.element.style.left;

    expect(fromTop).toBe('-50%');
    expect(toTop).toBe('-50%');
  });
});

describe('private setZIndexTop', () => {
  // TODO del ISettings
  // settings = {
  //   min: 0,
  //   max: 1500,
  //   range: true,
  //   scale: true,
  //   vertical: true,
  //   tooltips: true,
  //   confpanel: true,
  //   bar: true,
  //   from: 1000,
  //   to: 1490,
  //   step: 10,
  // };

  // TODO
  // modelSettings = {

  // }

  const zIndexClass = 'tooltip-z-index-top';
  // const view = new View('range-slider', modelSettings, viewSettings);

  test('should add zIndexClass to "from" element and del from "to" element', () => {
    const view = new View('range-slider', modelSettings, viewSettings);
    const result = view['setZIndexTop']('from');
    const fromContainsClass = result['from'].element.classList.contains(zIndexClass);
    const toContainsClass = result['to'].element.classList.contains(zIndexClass);
    expect(fromContainsClass).toBeTruthy();
    expect(toContainsClass).toBeFalsy();
  });

  test('should del zIndexClass from "from" element and add to "to" element', () => {
    const view = new View('range-slider', modelSettings, viewSettings);
    const result = view['setZIndexTop']('to');
    const fromContainsClass = result['from'].element.classList.contains(zIndexClass);
    const toContainsClass = result['to'].element.classList.contains(zIndexClass);
    expect(fromContainsClass).toBeFalsy();
    expect(toContainsClass).toBeTruthy();
  });
});

describe('private currentCursorPosition', () => {
  // beforeEach(() => {
  //   Element.prototype.getBoundingClientRect = jest.fn(() => ({
  //     width: 30,
  //     height: 300,
  //     top: 100,
  //     left: 100,
  //     bottom: 400,
  //     right: 130,
  //     x: 100,
  //     y: 100,
  //     toJSON: () => {},
  //   }));

  //   viewSettings.vertical = true;
  //   viewSettings.range = true;
  // });

  // test('should return currentPos > max', () => {
  //   const downEvent = new PointerEvent(
  //     'pointerdown',
  //     {
  //       bubbles: true,
  //       cancelable: true,
  //       clientX: 590,
  //       clientY: 590,
  //     },
  //   );

  //   const view = new View('range-slider', modelSettings, viewSettings);
  //   view.settings['thumbMarginTo'] = 150; /* +min(100) -step(2) = 248 */

  //   view['from'].element.dispatchEvent(downEvent);
  //   const result = view['currentCursorPosition'](downEvent);
  //   expect(result).toBe(248);
  // });

  // test('should return currentPos < min', () => {
  //   const downEvent = new PointerEvent(
  //     'pointerdown',
  //     {
  //       bubbles: true,
  //       cancelable: true,
  //       clientX: 150,
  //       clientY: 150,
  //     },
  //   );

  //   const view = new View('range-slider', modelSettings, viewSettings);
  //   view.settings['thumbMarginFrom'] = 110; /* +min(100) +step(2) = 212 */
  //   view['to'].element.dispatchEvent(downEvent);
  //   const result = view['currentCursorPosition'](downEvent);
  //   expect(result).toBe(212);
  // });
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
    viewSettings.vertical = true;
    const view = new View('range-slider', modelSettings, viewSettings);
    const result = view['getPosOnScale'](currentPos);

    expect(result).toBe(currentPos - topValue);
  });

  test(`should return ${currentPos} - ${topValue}`, () => {
    viewSettings.vertical = false;
    const view = new View('range-slider', modelSettings, viewSettings);
    const result = view['getPosOnScale'](currentPos);

    expect(result).toBe(currentPos - leftValue);
  });
});

describe('private getDifferenceBetween', () => {
  test('should return absolute difference between two numbers = 50', () => {
    let currentPos = 100;
    let thumbMargin = 150; /* currentPos - thumbMargin = 50 */

    const view = new View('range-slider', modelSettings, viewSettings);
    let result = view['getDifferenceBetween'](currentPos, thumbMargin);
    expect(result).toBe(50);

    currentPos = 200;
    thumbMargin = 150; /* currentPos - thumbMargin = -50 */

    result = view['getDifferenceBetween'](currentPos, thumbMargin);
    expect(result).toBe(50);
  });
});

// describe('private handleMoveClosestThumb', () => {
//   function testMoveClosestThumb(view: View, clickPosition: number) {
//     /* 'should' return mouseEvent coords */
//     jest.spyOn(view as unknown as ViewHint, 'getPosOnScale').mockReturnValueOnce(clickPosition);

//     const updateRangeSliderValuesSpy = jest
//       .spyOn(view as unknown as ViewHint, 'updateRangeSliderValues');
//     const setZIndexTopSpy = jest.spyOn(view as unknown as ViewHint, 'setZIndexTop');
//     const setDistanceBetweenTooltipsSpy = jest
//       .spyOn(view as unknown as ViewHint, 'setDistanceBetweenTooltips');

//     const downEvent = new PointerEvent(
//       'pointerdown',
//       {
//         bubbles: true,
//         cancelable: true,
//         clientX: clickPosition,
//         clientY: 150,
//       },
//     );

//     view['slider'].element.dispatchEvent(downEvent);
//     const result = view['handleMoveClosestThumb'](downEvent);

//     return {
//       updateRangeSliderValuesSpy,
//       setZIndexTopSpy,
//       setDistanceBetweenTooltipsSpy,
//       result,
//     };
//   }

//   function isHasClasses(result: View, thumbName: ThumbName) {
//     const isHasThumbClass = result[thumbName].element.classList.contains(`thumb-${thumbName}`);
//     expect(isHasThumbClass).toBeTruthy();

//     const isHasZIndexClass = result[thumbName].element.classList.contains('tooltip-z-index-top');
//     expect(isHasZIndexClass).toBeTruthy();
//   }

//   test('should return thumbMarginFrom = \'clickPosition\'', () => {
//     viewSettings.range = true;
//     const view = new View('range-slider', modelSettings, viewSettings);
//     view.settings['thumbMarginFrom'] = 150;
//     view.settings['thumbMarginTo'] = 250;

//     const clickPosition = 100;

//     const {
//       updateRangeSliderValuesSpy,
//       setZIndexTopSpy,
//       setDistanceBetweenTooltipsSpy,
//       result,
//     } = testMoveClosestThumb(view, clickPosition);

//     expect(result.settings['thumbMarginFrom']).toBe(clickPosition);
//     expect(result.settings['thumbMarginTo']).not.toBe(clickPosition);
//     expect(updateRangeSliderValuesSpy).toBeCalled();
//     expect(setDistanceBetweenTooltipsSpy).toBeCalled();

//     if (result['viewSettings'].range) {
//       expect(setZIndexTopSpy).toBeCalled();

//       isHasClasses(result, 'from');
//     }
//   });

//   // test('should return thumbMarginTo = \'clickPosition\'', () => {
//   //   viewSettings.range = true;
//   //   const view = new View('range-slider', modelSettings, viewSettings);
//   //   view.viewSettings['thumbMarginFrom'] = 150;
//   //   view.viewSettings['thumbMarginTo'] = 250;

//   //   const clickPosition = 200;

//   //   const {
//   //     updateRangeSliderValuesSpy,
//   //     setZIndexTopSpy,
//   //     setDistanceBetweenTooltipsSpy,
//   //     result,
//   //   } = testMoveClosestThumb(view, clickPosition);

//   //   expect(result.viewSettings['thumbMarginFrom']).not.toBe(clickPosition);
//   //   console.log('viewSettings', result.viewSettings);
//   //   expect(result.viewSettings['thumbMarginTo']).toBe(clickPosition);
//   //   expect(updateRangeSliderValuesSpy).toBeCalled();
//   //   expect(setDistanceBetweenTooltipsSpy).toBeCalled();

//   //   if (result['viewSettings'].range) {
//   //     expect(setZIndexTopSpy).toBeCalled();

//   //     isHasClasses(result, 'to');
//   //   }
//   // });
// });

describe('private handleStopSliding', () => {
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
    const view = new View('range-slider', modelSettings, viewSettings);
    view['to'].element.dispatchEvent(upEvent);
    const result = View['handleStopSliding'](upEvent);

    expect(result.onpointermove).toBeNull();
  });
});

describe('private handleBeginSliding', () => {
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
    const view = new View('range-slider', modelSettings, viewSettings);

    const currentPos = 150;
    // console.log('cp: ', currentPos);
    const getPosOnScaleSpy = jest
      .spyOn(view as unknown as ViewHint, 'getPosOnScale')
      .mockReturnValue(currentPos);
    const setMarginsSpy = jest.spyOn(view as unknown as ViewHint, 'setMargins');
    const updateRangeSliderValuesSpy = jest
      .spyOn(view as unknown as ViewHint, 'updateRangeSliderValues');
    const setDistanceBetweenTooltipsSpy = jest
      .spyOn(view as unknown as ViewHint, 'setDistanceBetweenTooltips');

    // console.log('cp: ', currentPos);
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
      // currentPos,
      getPosOnScaleSpy,
      setMarginsSpy,
      updateRangeSliderValuesSpy,
      setDistanceBetweenTooltipsSpy,
    } = getSpyMethods();

    view['from'].element.dispatchEvent(moveEvent);
    const result = view['handleBeginSliding'](moveEvent);
    expect(result.onpointermove).not.toBeNull();

    result.onpointermove!(moveEvent);
    expect(getPosOnScaleSpy).toBeCalled();

    expect(setMarginsSpy).toBeCalled();

    expect(updateRangeSliderValuesSpy).toBeCalled();
    expect(setDistanceBetweenTooltipsSpy).toBeCalled();
  });

  it('should call setMargins method with thumbName = "to"', () => {
    const moveEvent = getMoveEvent();

    Element.prototype.setPointerCapture = jest.fn().mockReturnValueOnce(undefined);

    const {
      view,
      getPosOnScaleSpy,
      setMarginsSpy,
      updateRangeSliderValuesSpy,
      setDistanceBetweenTooltipsSpy,
    } = getSpyMethods();

    view['to'].element.dispatchEvent(moveEvent);
    const result = view['handleBeginSliding'](moveEvent);
    expect(result.onpointermove).not.toBeNull();

    result.onpointermove!(moveEvent);
    expect(getPosOnScaleSpy).toBeCalled();

    expect(setMarginsSpy).toBeCalled();

    expect(updateRangeSliderValuesSpy).toBeCalled();
    expect(setDistanceBetweenTooltipsSpy).toBeCalled();
  });
});

describe('private addListenersToThumbs', () => {
  function testAddListenerToThumbs() {
    const view = new View('range-slider', modelSettings, viewSettings);

    const setRangeSliderMarginsSpy = jest
      .spyOn(view as unknown as ViewHint, 'setRangeSliderMargins');
    const updateRangeSliderValuesSpy = jest
      .spyOn(view as unknown as ViewHint, 'updateRangeSliderValues');
    const setDistanceBetweenTooltipsSpy = jest
      .spyOn(view as unknown as ViewHint, 'setDistanceBetweenTooltips');
    const createScaleMarksSpy = jest.spyOn(view['scale'], 'createScaleMarks');

    view['addListenersToThumbs']();

    window.dispatchEvent(new Event('resize'));
    expect(setRangeSliderMarginsSpy).toBeCalled();
    expect(updateRangeSliderValuesSpy).toBeCalled();
    expect(setDistanceBetweenTooltipsSpy).toBeCalled();

    return createScaleMarksSpy;
  }

  it('should NOT recreate scale marks on window resize on vertical slider', () => {
    viewSettings.vertical = true;
    const createScaleMarksSpy = testAddListenerToThumbs();

    expect(createScaleMarksSpy).not.toBeCalled();
  });

  it('should recreate scale marks on window resize on horizontal slider', () => {
    viewSettings.vertical = false;
    const createScaleMarksSpy = testAddListenerToThumbs();

    expect(createScaleMarksSpy).toBeCalled();
  });
});

describe('private changeCurrentPos', () => {
  test('', () => {
    const view = new View('range-slider', modelSettings, viewSettings);

    const curPosEvent = new PointerEvent(
      'pointerdown',
      {
        bubbles: true,
        cancelable: true,
        clientX: 150,
        clientY: 150,
      },
    );

    const value = 200;
    const result = view['changeCurrentPos'](curPosEvent, value);
    expect(result).toBe(value);
  });
});

describe('private setThumbsPosition', () => {
  it('should return style values in form "param" + "mu" (mu === "px" | "%")', () => {
    const view = new View('range-slider', modelSettings, viewSettings);
    const mu: MeasureUnit = 'px';
    const fromTop = '1';
    const fromLeft = '2';
    const toTop = '3';
    const toLeft = '4';
    const result = view['setThumbsPosition'](mu, fromTop, fromLeft, toTop, toLeft);

    const resFromTop = result['from'].tooltip.element.style.top;
    const resFromLeft = result['from'].tooltip.element.style.left;
    const resToTop = result['to'].tooltip.element.style.top;
    const resToLeft = result['to'].tooltip.element.style.left;

    expect(fromTop + mu).toBe(resFromTop);
    expect(fromLeft + mu).toBe(resFromLeft);
    expect(toTop + mu).toBe(resToTop);
    expect(toLeft + mu).toBe(resToLeft);
  });
});

describe('private handleChangeSettingsObserverNotify', () => {
  it('should be called with this.settings', () => {
    const view = new View('range-slider', modelSettings, viewSettings);
    const spyChangeSettingsObserverNotify = jest
      .spyOn(view.changeSettingsObserver, 'notifyObservers');

    view['handleChangeSettingsObserverNotify']();

    expect(spyChangeSettingsObserverNotify).toBeCalledWith(modelSettings);
  });
});

describe('private handleMoveClosestThumb', () => {
  test('should call "changeCurrentPos" if (element.classList.contains(\'scale__mark-value\'))', () => {
    const view = new View('range-slider', modelSettings, viewSettings);

    const hanldeMoveClosestThumbEvent = new PointerEvent(
      'pointerdown',
      {
        bubbles: true,
        cancelable: true,
        clientX: 200,
        clientY: 200,
      },
    );

    view['scale'].createScaleMarks(modelSettings, viewSettings);

    const scaleMarkVal = view['scale'].element.querySelector('.scale__mark-value');

    const currentPosValueSpy = jest.spyOn(view as unknown as ViewHint, 'changeCurrentPos');
    scaleMarkVal?.dispatchEvent(hanldeMoveClosestThumbEvent);
    view['handleMoveClosestThumb'](hanldeMoveClosestThumbEvent);

    expect(currentPosValueSpy).toBeCalled();
  });

  test('should call "changeCurrentPos" if (element.classList.contains(\'scale__mark-value\'))', () => {
    const view = new View('range-slider', modelSettings, viewSettings);

    const hanldeMoveClosestThumbEvent = new PointerEvent(
      'pointerdown',
      {
        bubbles: true,
        cancelable: true,
        clientX: 200,
        clientY: 200,
      },
    );

    const currentPosValueSpy = jest.spyOn(view as unknown as ViewHint, 'changeCurrentPos');
    view['slider'].element.dispatchEvent(hanldeMoveClosestThumbEvent);
    view['handleMoveClosestThumb'](hanldeMoveClosestThumbEvent);

    expect(currentPosValueSpy).toBeCalled();
  });
});

describe('private setMargins', () => {
  test('should return settings.from === settings.curPosInPoints', () => {
    const curPosInPoints = 30;
    modelSettings.curPosInPoints = curPosInPoints;
    const view = new View('range-slider', modelSettings, viewSettings);

    const randomNumb = 20;
    const result = view['setMargins']('from', randomNumb);
    expect(result.settings.from).toBe(curPosInPoints);
  });

  test('should return settings.to === settings.curPosInPoints', () => {
    const curPosInPoints = 30;
    modelSettings.curPosInPoints = curPosInPoints;
    const view = new View('range-slider', modelSettings, viewSettings);

    const randomNumb = 20;
    const result = view['setMargins']('to', randomNumb);
    expect(result.settings.to).toBe(curPosInPoints);
  });
});
