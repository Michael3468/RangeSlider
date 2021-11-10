/**
 * @jest-environment jsdom
 */

/* eslint-disable dot-notation */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import { IMinMax, INodeName, ISettings } from '../RangeSlider/types';
import {
  createElement,
  getElementLengthInPx,
  getMinMaxElementEdgesInPx,
  getOnePointInPx,
} from './common';
import Tooltip from '../Tooltip/Tooltip';
import Scale from '../Scale/Scale';

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
    isVertical: false,
    isTooltipsVisible: true,
    isConfPanel: true,
    isBarVisible: true,
    valueFrom: 1000,
    valueTo: 1490,
    step: 10,
  };
});

describe('function createElement', () => {
  const tag: INodeName = 'div';
  const className: string = 'element-class-name';
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
    settings.isVertical = false;

    const elementMinMaxHorizontal: IMinMax = {
      min: 100,
      max: 400,
    };

    const scale = new Scale();
    expect(getMinMaxElementEdgesInPx(settings, scale)).toStrictEqual(elementMinMaxHorizontal);
  });

  test('test rect values of the vertical element', () => {
    settings.isVertical = true;

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
    settings.isVertical = false;
    const result = getElementLengthInPx(settings, scale.element);

    expect(result).toBe(300);
  });

  test('size for vertical element', () => {
    const scale = new Scale();
    settings.isVertical = true;
    const result = getElementLengthInPx(settings, scale.element);

    expect(result).toBe(10);
  });
});

describe('function getOnePointInPx', () => {
  test('should return one point length in px (number)', () => {
    const scale = new Scale();
    settings.min = 0;
    settings.max = 100;
    settings.isVertical = false;
    // Element.prototype.getBoundingClientRect = width: 300
    const result = getOnePointInPx(settings, scale.element); // width / (max - min) = 3

    expect(result).toBe(3);
  });
});
