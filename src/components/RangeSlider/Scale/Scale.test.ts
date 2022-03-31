/**
 * @jest-environment jsdom
 */

/* eslint-disable dot-notation */

import { ISettings } from '../RangeSlider/types';
import Scale from './Scale';

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

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    isTwoRunners: true,
    isScaleVisible: true,
    isVertical: true,
    isTooltipsVisible: true,
    isConfPanel: true,
    isBarVisible: true,
    valueFrom: 1000,
    valueTo: 1490,
    step: 10,
  };
});

describe('private createMark', () => {
  test('should return html span with margin-left and NO class "scale_mark_vertical"', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].isVertical = false;
    const marginFromBegin = 100;

    const result = scale['createMark'](marginFromBegin);

    expect(result).not.toBeNull();
    expect(result.nodeName).toBe('SPAN');

    const isHasClass = result.classList.contains('scale_mark');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.classList.contains('scale_mark_vertical');
    expect(isHasClassVertical).toBeFalsy();

    const isElementHasMarginLeft = result.style.marginLeft;
    expect(isElementHasMarginLeft).toBe(`${marginFromBegin}px`);
  });

  test('should return html span with margin-top and class "scale_mark_vertical"', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].isVertical = true;
    const marginFromBegin = 100;

    const result = scale['createMark'](marginFromBegin);

    expect(result).not.toBeNull();
    expect(result.nodeName).toBe('SPAN');

    const isHasClass = result.classList.contains('scale_mark');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.classList.contains('scale_mark_vertical');
    expect(isHasClassVertical).toBeTruthy();

    const isElementHasMarginTop = result.style.marginTop;
    expect(isElementHasMarginTop).toBe(`${marginFromBegin}px`);
  });
});

describe('private createMarkValue', () => {
  test('should return div element with class "scale_mark_value" and inner text = value', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].isVertical = false;

    const value = 200;
    const marginFromBegin = 100;

    const result = scale['createMarkValue'](value, marginFromBegin);

    expect(result).not.toBeNull();
    expect(result.nodeName).toBe('DIV');

    const isHasClass = result.classList.contains('scale_mark_value');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.classList.contains('scale_mark_value_vertical');
    expect(isHasClassVertical).toBeFalsy();

    const isHasMarginLeft = result.style.marginLeft;
    expect(isHasMarginLeft).toBe(`${marginFromBegin}px`);

    const isHasInnerText = result.innerText;
    expect(isHasInnerText).toBe(value.toString());
  });

  test('should return div element with class "scale_mark_value_vertical" and inner text = value', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].isVertical = true;

    const value = 200;
    const marginFromBegin = 100;

    const result = scale['createMarkValue'](value, marginFromBegin);

    expect(result).not.toBeNull();
    expect(result.nodeName).toBe('DIV');

    const isHasClass = result.classList.contains('scale_mark_value');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.classList.contains('scale_mark_value_vertical');
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
    settings.min = 0;
    settings.max = 100;
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
    const stepBetweenMarksInPx = 30;

    settings.isVertical = false;

    const result = scale.createScaleMarks(settings);
    expect(result.element.nodeName).toBe('DIV');

    const isHasClass = result.element.classList.contains('scale');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.element.classList.contains('scale_vertical');
    expect(isHasClassVertical).toBeFalsy();

    // check NO vertical classes in childs classLists
    const childrenListLength = result.element.children.length;
    /* for settings.isVertical = false; */
    const horizontalLength = result.element.getBoundingClientRect().width;
    const elementsPerStep = 2; // mark and value
    const totalSteps = (horizontalLength / stepBetweenMarksInPx)
      * elementsPerStep
      + elementsPerStep; // first step group of elements
    expect(totalSteps).toBe(childrenListLength);

    for (let i = 0; i < childrenListLength; i += 1) {
      const childNodeName = result.element.children[i]?.nodeName;

      if (childNodeName === 'SPAN') {
        // console.log('span');
        const isClassListContains = result.element.children[i]?.classList.contains('scale_mark');
        expect(isClassListContains).toBeTruthy();

        const isClassListContainsVertical = result.element.children[i]?.classList.contains('scale_mark_vertical');
        expect(isClassListContainsVertical).toBeFalsy();
      } else if (childNodeName === 'DIV') {
        // console.log('div');
        const isClassListContains = result.element.children[i]?.classList.contains('scale_mark_value');
        expect(isClassListContains).toBeTruthy();

        const isClassListContainsVertical = result.element.children[i]?.classList.contains('scale_mark_value_vertical');
        expect(isClassListContainsVertical).toBeFalsy();
      }
    }
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
    const stepBetweenMarksInPx = 30;

    settings.isVertical = true;

    const result = scale.createScaleMarks(settings);
    expect(result.element.nodeName).toBe('DIV');

    const isHasClass = result.element.classList.contains('scale');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = result.element.classList.contains('scale_vertical');
    expect(isHasClassVertical).toBeFalsy();

    // check vertical classes in childs classLists
    const childrenListLength = result.element.children.length;
    /* for settings.isVertical = true; */
    const horizontalLength = result.element.getBoundingClientRect().height;
    const elementsPerStep = 2; // mark and value
    const totalSteps = (horizontalLength / stepBetweenMarksInPx)
      * elementsPerStep
      + elementsPerStep; // first step group of elements
    expect(totalSteps).toBe(childrenListLength);

    for (let i = 0; i < childrenListLength; i += 1) {
      const childNodeName = result.element.children[i]?.nodeName;

      if (childNodeName === 'SPAN') {
        // console.log('span');
        const isClassListContains = result.element.children[i]?.classList.contains('scale_mark');
        expect(isClassListContains).toBeTruthy();

        const isClassListContainsVertical = result.element.children[i]?.classList.contains('scale_mark_vertical');
        expect(isClassListContainsVertical).toBeTruthy();
      } else if (childNodeName === 'DIV') {
        // console.log('div');
        const isClassListContains = result.element.children[i]?.classList.contains('scale_mark_value');
        expect(isClassListContains).toBeTruthy();

        const isClassListContainsVertical = result.element.children[i]?.classList.contains('scale_mark_value_vertical');
        expect(isClassListContainsVertical).toBeTruthy();
      }
    }
  });
});

describe('private getStepBetweenMarks', () => {
  test('if settings.step < 1, should return "onePointInPx" parametr', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].step = 0.1;
    const onePointInPx = 10;

    const result = scale['getStepBetweenMarks'](onePointInPx);
    expect(result).toBe(10);
  });

  test('if settings.step >= 1, should return "onePointInPx * settings.step" parametr', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].step = 2;
    const onePointInPx = 10;

    const result = scale['getStepBetweenMarks'](onePointInPx);
    expect(result).toBe(20);
  });
});

describe('private getMinStep', () => {
  test('if settings.step = 0.5 should return 0.1', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].step = 0.5;

    const result = scale['getMinStep']();
    expect(result).toBe(0.1);
  });

  test('if settings.step = 5 should return 5', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].step = 5;

    const result = scale['getMinStep']();
    expect(result).toBe(5);
  });
});

describe('private getCurrentStep', () => {
  test('if settings.step < 0.2, should return 2', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].step = 0.2;

    const result = scale['getCurrentStep']();
    expect(result).toBe(2);
  });

  test('if settings.step < 5, should return 5', () => {
    const scale = new Scale();
    scale['settings'] = settings;
    scale['settings'].step = 5;

    const result = scale['getCurrentStep']();
    expect(result).toBe(5);
  });
});

describe('private getStep', () => {
  test('if onePointInPx = 0.9 and MIN_STEP = 10 should return 10.8', () => {
    const scale = new Scale();
    const onePointInPx: number = 0.9;
    const MIN_STEP_BETWEEN_MARKS_IN_PX: number = 10;

    jest.spyOn(scale as unknown as ScaleHint, 'getCurrentStep').mockReturnValueOnce(3);

    const result = scale['getStep'](onePointInPx, MIN_STEP_BETWEEN_MARKS_IN_PX);
    expect(result).toBe(10.8);
  });

  test('if onePointInPx >  MIN_STEP = 10 should return "value"', () => {
    const scale = new Scale();
    const onePointInPx: number = 15;
    const MIN_STEP_BETWEEN_MARKS_IN_PX: number = 10;
    const value = 5;

    jest.spyOn(scale as unknown as ScaleHint, 'getStepBetweenMarks').mockReturnValueOnce(value);

    const result = scale['getStep'](onePointInPx, MIN_STEP_BETWEEN_MARKS_IN_PX);
    expect(result).toBe(value);
  });
});
