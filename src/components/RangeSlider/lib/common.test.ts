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
} from './common';

import { IMinMax, INodeName, ISettings } from '../RangeSlider/types';

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

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    range: true,
    scale: true,
    vertical: false,
    tooltips: true,
    confpanel: true,
    bar: true,
    from: 1000,
    to: 1490,
    step: 10,
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
    settings.vertical = false;

    const elementMinMaxHorizontal: IMinMax = {
      min: 100,
      max: 400,
    };

    const scale = new Scale();
    expect(getMinMaxElementEdgesInPx(settings, scale)).toStrictEqual(elementMinMaxHorizontal);
  });

  test('test rect values of the vertical element', () => {
    settings.vertical = true;

    const elementMinMaxVertical: IMinMax = {
      min: 100,
      max: 110,
    };

    const scale = new Scale();
    expect(getMinMaxElementEdgesInPx(settings, scale)).toStrictEqual(elementMinMaxVertical);
  });
});

describe('function getElementLengthInPx', () => {
  test('size for horizontal element', () => {
    const scale = new Scale();
    settings.vertical = false;
    const result = getElementLengthInPx(settings, scale.element);

    expect(result).toBe(300);
  });

  test('size for vertical element', () => {
    const scale = new Scale();
    settings.vertical = true;
    const result = getElementLengthInPx(settings, scale.element);

    expect(result).toBe(10);
  });
});

describe('function getOnePointInPx', () => {
  test('should return 3 if step > 1', () => {
    const scale = new Scale();
    settings.min = 0;
    settings.max = 98;
    settings.step = 10;
    settings.vertical = false;
    /* Element.prototype.getBoundingClientRect = width: 300 */
    const result = getOnePointInPx(settings, scale.element); /* width / (max - min) = 100 */
    expect(result).toBe(3.061);
  });

  test('should first', () => {
    const scale = new Scale();
    settings.min = 0;
    settings.max = 98;
    settings.step = 0.34;
    settings.vertical = false;
    const result = getOnePointInPx(settings, scale.element); /* width / (max - min) = 100 */
    expect(result).toBe(1.041);
  });
});

describe('function getDigitsAfterPoint', () => {
  test('should return 3 (numbers after point)', () => {
    settings.step = 0.001;
    const result = getDigitsAfterPoint(settings);

    expect(result).toBe(3);
  });
});

describe('function getMinStep', () => {
  test('if settings.step = 0.5 should return 0.1', () => {
    settings.step = 0.5;

    const result = getMinStep(settings);
    expect(result).toBe(0.1);
  });

  test('if settings.step = 5 should return 5', () => {
    settings.step = 5;

    const result = getMinStep(settings);
    expect(result).toBe(1);
  });
});
