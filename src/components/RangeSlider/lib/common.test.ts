/**
 * @jest-environment jsdom
 */

import {
  createElement,
  getElementLengthInPx,
  getMinMaxElementEdgesInPx,
  getOnePointInPx,
  getDigitsAfterPoint,
  getMinStep,
  updateObjectValues,
} from './common';

import {
  IMinMax,
  IModelSettings,
  INodeName,
  IViewSettings,
  IUserSettings,
} from '../RangeSlider/types';

import Scale from '../Scale/Scale';
import Tooltip from '../Tooltip/Tooltip';

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
let userSettings: IUserSettings;

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
    vertical: false,
    tooltips: true,
    confpanel: true,
    bar: true,

    thumbMarginFrom: 1,
    thumbMarginTo: 1,
    rangeMarginFrom: 1,
    rangeMarginTo: 1,
  };
});

describe('function createElement', () => {
  const tag: INodeName = 'div';
  const className = 'element-class-name';
  const result: HTMLElement = createElement(tag, className);

  test('should return html element', () => {
    expect(result).not.toBeNull();
  });

  test(`class name of the element should be ${className}`, () => {
    expect(result.className).toBe(className);
  });

  describe('function width third param', () => {
    const tooltip = new Tooltip('from');
    const resultWithChild: HTMLElement = createElement(tag, className, tooltip.element);
    const isChild: boolean = resultWithChild.hasChildNodes();

    test('should has child element', () => {
      expect(isChild).toBeTruthy();
    });
  });
});

describe('function getMinMaxElementEdgesInPx', () => {
  test('test rect values of the horizontal element', () => {
    viewSettings.vertical = false;

    const elementMinMaxHorizontal: IMinMax = {
      min: 100,
      max: 400,
    };

    const scale = new Scale();
    expect(getMinMaxElementEdgesInPx(viewSettings, scale)).toStrictEqual(elementMinMaxHorizontal);
  });

  test('test rect values of the vertical element', () => {
    viewSettings.vertical = true;

    const elementMinMaxVertical: IMinMax = {
      min: 100,
      max: 110,
    };

    const scale = new Scale();
    expect(getMinMaxElementEdgesInPx(viewSettings, scale)).toStrictEqual(elementMinMaxVertical);
  });
});

describe('function getElementLengthInPx', () => {
  test('size for horizontal element', () => {
    const scale = new Scale();
    viewSettings.vertical = false;
    const result = getElementLengthInPx(viewSettings, scale.element);

    expect(result).toBe(300);
  });

  test('size for vertical element', () => {
    const scale = new Scale();
    viewSettings.vertical = true;
    const result = getElementLengthInPx(viewSettings, scale.element);

    expect(result).toBe(10);
  });
});

describe('function getOnePointInPx', () => {
  test('should return 3 if step > 1', () => {
    const scale = new Scale();
    modelSettings.min = 0;
    modelSettings.max = 98;
    modelSettings.step = 10;
    viewSettings.vertical = false;
    /* Element.prototype.getBoundingClientRect = width: 300 */
    /* width / (max - min) = 100 */
    const result = getOnePointInPx(modelSettings, viewSettings, scale.element);
    expect(result).toBe(3.061);
  });

  test('should first', () => {
    const scale = new Scale();
    modelSettings.min = 0;
    modelSettings.max = 98;
    modelSettings.step = 0.34;
    viewSettings.vertical = false;
    /* width / (max - min) = 100 */
    const result = getOnePointInPx(modelSettings, viewSettings, scale.element);
    expect(result).toBe(1.041);
  });
});

describe('function getDigitsAfterPoint', () => {
  test('should return 3 (numbers after point)', () => {
    modelSettings.step = 0.001;
    const result = getDigitsAfterPoint(modelSettings);

    expect(result).toBe(3);
  });
});

describe('function getMinStep', () => {
  test('if settings.step = 0.5 should return 0.1', () => {
    modelSettings.step = 0.5;

    const result = getMinStep(modelSettings);
    expect(result).toBe(0.1);
  });

  test('if settings.step = 5 should return 5', () => {
    modelSettings.step = 5;

    const result = getMinStep(modelSettings);
    expect(result).toBe(1);
  });
});

describe('function updateObjectValues', () => {
  beforeEach(() => {
    modelSettings = {
      min: 0,
      max: 100,
      from: 10,
      to: 90,
      step: 2,

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

    userSettings = {
      min: 10,
      max: 90,
      from: 20,
      to: 80,
      step: 5,
      range: false,
      scale: false,
      vertical: false,
      tooltips: false,
      confpanel: false,
      bar: false,
    };
  });

  test('should merge viewSettings and userSettings', () => {
    const result = updateObjectValues(viewSettings, userSettings);

    if (userSettings.min !== undefined) {
      expect(result.min).not.toBe(userSettings.min);
    }

    if (userSettings.max !== undefined) {
      expect(result.max).not.toBe(userSettings.max);
    }

    if (userSettings.from !== undefined) {
      expect(result.from).not.toBe(userSettings.from);
    }

    if (userSettings.to !== undefined) {
      expect(result.to).not.toBe(userSettings.to);
    }

    if (userSettings.step !== undefined) {
      expect(result.step).not.toBe(userSettings.step);
    }

    if (userSettings.range !== undefined) {
      expect(result.range).toBe(userSettings.range);
    }

    if (userSettings.scale !== undefined) {
      expect(result.scale).toBe(userSettings.scale);
    }

    if (userSettings.vertical !== undefined) {
      expect(result.vertical).toBe(userSettings.vertical);
    }

    if (userSettings.tooltips !== undefined) {
      expect(result.tooltips).toBe(userSettings.tooltips);
    }

    if (userSettings.confpanel !== undefined) {
      expect(result.confpanel).toBe(userSettings.confpanel);
    }

    if (userSettings.bar !== undefined) {
      expect(result.bar).toBe(userSettings.bar);
    }
  });

  test('should merge modelSettings and userSettings', () => {
    const result = updateObjectValues(modelSettings, userSettings);

    if (userSettings.min !== undefined) {
      expect(result.min).toBe(userSettings.min);
    }

    if (userSettings.max !== undefined) {
      expect(result.max).toBe(userSettings.max);
    }

    if (userSettings.from !== undefined) {
      expect(result.from).toBe(userSettings.from);
    }

    if (userSettings.to !== undefined) {
      expect(result.to).toBe(userSettings.to);
    }

    if (userSettings.step !== undefined) {
      expect(result.step).toBe(userSettings.step);
    }

    if (userSettings.range !== undefined) {
      expect(result.range).not.toBe(userSettings.range);
    }

    if (userSettings.scale !== undefined) {
      expect(result.scale).not.toBe(userSettings.scale);
    }

    if (userSettings.vertical !== undefined) {
      expect(result.vertical).not.toBe(userSettings.vertical);
    }

    if (userSettings.tooltips !== undefined) {
      expect(result.tooltips).not.toBe(userSettings.tooltips);
    }

    if (userSettings.confpanel !== undefined) {
      expect(result.confpanel).not.toBe(userSettings.confpanel);
    }

    if (userSettings.bar !== undefined) {
      expect(result.bar).not.toBe(userSettings.bar);
    }
  });
});
