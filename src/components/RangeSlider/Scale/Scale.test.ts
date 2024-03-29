/**
 * @jest-environment jsdom
 */

import Scale from './Scale';

import { IModelSettings, IViewSettings } from '../RangeSlider/types';

abstract class ScaleHint {
  abstract getCurrentStep(): number;

  abstract getStepBetweenMarks(): number;
}

Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 300,
  height: 10,
  top: 100,
  left: 100,
  bottom: 110,
  right: 400,
  x: 100,
  y: 100,
  toJSON: () => {},
}));

let modelSettings: IModelSettings;
let viewSettings: IViewSettings;

beforeEach(() => {
  modelSettings = {
    min: 0,
    max: 1500,
    from: 1000,
    to: 1490,
    step: 10,

    stepInPercents: 1,
    currentPos: 1,
    curPosInPoints: 1,
    posWithStepInPercents: 1,
  };

  viewSettings = {
    range: true,
    scale: true,
    vertical: true,
    tooltips: true,
    confpanel: true,
    bar: true,

    thumbMarginFrom: 1,
    thumbMarginTo: 1,
    rangeMarginFrom: 1,
    rangeMarginTo: 1,
  };
});

describe('private createMark', () => {
  test('should return html span with margin-left and NO class "scale__mark_vertical"', () => {
    const scale = new Scale();
    scale['modelSettings'] = modelSettings;
    scale['viewSettings'] = viewSettings;
    scale['viewSettings'].vertical = false;
    const marginFromBegin = 100;

    const result = scale['createMark'](marginFromBegin);

    expect(result).not.toBeNull();
    expect(result.nodeName).toBe('SPAN');

    const isHasClass = result.classList.contains('scale__mark');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.classList.contains('scale__mark_vertical');
    expect(isHasClassVertical).toBeFalsy();

    const isElementHasMarginLeft = result.style.marginLeft;
    expect(isElementHasMarginLeft).toBe(`${marginFromBegin}px`);
  });

  test('should return html span with margin-top and class "scale__mark_vertical"', () => {
    const scale = new Scale();
    scale['modelSettings'] = modelSettings;
    scale['viewSettings'] = viewSettings;
    scale['viewSettings'].vertical = true;
    const marginFromBegin = 100;

    const result = scale['createMark'](marginFromBegin);

    expect(result).not.toBeNull();
    expect(result.nodeName).toBe('SPAN');

    const isHasClass = result.classList.contains('scale__mark');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.classList.contains('scale__mark_vertical');
    expect(isHasClassVertical).toBeTruthy();

    const isElementHasMarginTop = result.style.marginTop;
    expect(isElementHasMarginTop).toBe(`${marginFromBegin}px`);
  });
});

describe('private createMarkValue', () => {
  test('should return div element with class "scale__mark-value" and inner text = value', () => {
    const scale = new Scale();
    scale['modelSettings'] = modelSettings;
    scale['viewSettings'] = viewSettings;
    scale['viewSettings'].vertical = false;

    const value = 200;
    const marginFromBegin = 100;

    const result = scale['createMarkValue'](value, marginFromBegin);

    expect(result).not.toBeNull();
    expect(result.nodeName).toBe('DIV');

    const isHasClass = result.classList.contains('scale__mark-value');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.classList.contains('scale__mark-value_vertical');
    expect(isHasClassVertical).toBeFalsy();

    const isHasMarginLeft = result.style.marginLeft;
    expect(isHasMarginLeft).toBe(`${marginFromBegin}px`);

    const isHasInnerText = result.innerText;
    expect(isHasInnerText).toBe(value.toString());
  });

  test('should return div element with class "scale__mark-value_vertical" and inner text = value', () => {
    const scale = new Scale();
    scale['modelSettings'] = modelSettings;
    scale['viewSettings'] = viewSettings;
    scale['viewSettings'].vertical = true;

    const value = 200;
    const marginFromBegin = 100;

    const result = scale['createMarkValue'](value, marginFromBegin);

    expect(result).not.toBeNull();
    expect(result.nodeName).toBe('DIV');

    const isHasClass = result.classList.contains('scale__mark-value');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.classList.contains('scale__mark-value_vertical');
    expect(isHasClassVertical).toBeTruthy();

    const isHasMarginTop = result.style.marginTop;
    expect(isHasMarginTop).toBe(`${marginFromBegin}px`);

    const isHasInnerText = result.innerText;
    expect(isHasInnerText).toBe(value.toString());
  });
});

describe('public createScaleMarks', () => {
  const getMinMaxElementEdgesInPx = jest.fn(() => ({
    min: 100,
    max: 400, // scaleMaxPos = max - min = 300
  }));

  const getOnePointInPx = jest.fn(() => 3);

  beforeEach(() => {
    modelSettings.min = 0;
    modelSettings.max = 100;
  });

  test('should return horizontal scale with marks', () => {
    // for horizontal view
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 300,
      height: 10,
      top: 100,
      left: 100,
      bottom: 110,
      right: 400,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    expect(getMinMaxElementEdgesInPx()).toStrictEqual({ min: 100, max: 400 });
    expect(getOnePointInPx()).toBe(3);

    const scale = new Scale();

    viewSettings.vertical = false;

    const result = scale.createScaleMarks(modelSettings, viewSettings);
    expect(result.element.nodeName).toBe('DIV');

    const isHasClass = result.element.classList.contains('scale');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.element.classList.contains('scale_vertical');
    expect(isHasClassVertical).toBeFalsy();
  });

  test('should return vertical scale with marks', () => {
    // for vertical view
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 10,
      height: 300,
      top: 100,
      left: 100,
      bottom: 400,
      right: 110,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    expect(getMinMaxElementEdgesInPx()).toStrictEqual({ min: 100, max: 400 });
    expect(getOnePointInPx()).toBe(3);

    const scale = new Scale();

    viewSettings.vertical = true;

    const result = scale.createScaleMarks(modelSettings, viewSettings);
    expect(result.element.nodeName).toBe('DIV');

    const isHasClass = result.element.classList.contains('scale');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.element.classList.contains('scale_vertical');
    expect(isHasClassVertical).toBeFalsy();
  });
});

describe('private getStepBetweenMarks', () => {
  test('if settings.step < 1, should return "onePointInPx" parametr', () => {
    const scale = new Scale();
    scale['modelSettings'] = modelSettings;
    scale['modelSettings'].step = 0.1;
    const onePointInPx = 10;

    const result = scale['getStepBetweenMarks'](onePointInPx);
    expect(result).toBe(10);
  });

  test('if settings.step >= 1, should return "onePointInPx * settings.step" parametr', () => {
    const scale = new Scale();
    scale['modelSettings'] = modelSettings;
    scale['modelSettings'].step = 2;
    const onePointInPx = 10;

    const result = scale['getStepBetweenMarks'](onePointInPx);
    expect(result).toBe(20);
  });
});

describe('private getCurrentStep', () => {
  test('if settings.step < 0.2, should return 2', () => {
    const scale = new Scale();
    scale['modelSettings'] = modelSettings;
    scale['modelSettings'].step = 0.2;

    const result = scale['getCurrentStep']();
    expect(result).toBe(2);
  });

  test('if settings.step < 5, should return 5', () => {
    const scale = new Scale();
    scale['modelSettings'] = modelSettings;
    scale['modelSettings'].step = 5;

    const result = scale['getCurrentStep']();
    expect(result).toBe(5);
  });
});

describe('private getStep', () => {
  test('if onePointInPx = 0.9 and MIN_STEP = 10 should return 10.8', () => {
    const scale = new Scale();
    const onePointInPx = 0.9;
    const MIN_STEP_BETWEEN_MARKS_IN_PX = 10;

    jest.spyOn(scale as unknown as ScaleHint, 'getCurrentStep').mockReturnValueOnce(3);

    const result = scale['getStep'](onePointInPx, MIN_STEP_BETWEEN_MARKS_IN_PX);
    expect(result).toBe(10.8);
  });

  test('if onePointInPx >  MIN_STEP = 10 should return "value"', () => {
    const scale = new Scale();
    const onePointInPx = 15;
    const MIN_STEP_BETWEEN_MARKS_IN_PX = 10;
    const value = 5;

    jest.spyOn(scale as unknown as ScaleHint, 'getStepBetweenMarks').mockReturnValueOnce(value);

    const result = scale['getStep'](onePointInPx, MIN_STEP_BETWEEN_MARKS_IN_PX);
    expect(result).toBe(value);
  });
});

describe('private getCurrentValueInPoints', () => {
  // this.settings.step < 1
  const value = 5;
  const markPos = 20;
  const onePointInPx = 7;

  test('should return 5.3', () => {
    const scale = new Scale();
    scale['modelSettings'].min = value;
    scale['modelSettings'].step = 0.1;

    const result = scale['getCurrentValueInPoints'](markPos, onePointInPx);
    expect(result).toBe(5.3);
    expect(result).not.toBeNaN();
  });

  // this.settings.step >= 1
  test('should return 8', () => {
    const scale = new Scale();
    scale['modelSettings'].min = 5;
    scale['modelSettings'].step = 2;

    const result = scale['getCurrentValueInPoints'](markPos, onePointInPx);
    expect(result).toBe(8);
    expect(result).not.toBeNaN();
  });
});
