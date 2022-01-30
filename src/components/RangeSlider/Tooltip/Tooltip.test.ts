/**
 * @jest-environment jsdom
 */

/* eslint-disable dot-notation */

import { ISettings, ThumbName } from '../RangeSlider/types';
import Tooltip from './Tooltip';

let settings: ISettings;
beforeEach(() => {
  settings = {
    min: 0,
    max: 10,
    step: 0.1,
    valueFrom: 1.51,
    valueTo: 3.82,
    isVertical: true,
    isTwoRunners: true,
    isScaleVisible: true,
    isBarVisible: true,
    isTooltipsVisible: true,
    isConfPanel: true,

  };
});

describe('constructor', () => {
  const tName: ThumbName = 'from';
  test(`should create "div" element with class "range-slider__tooltip_${tName}"`, () => {
    const tooltip = new Tooltip(tName);
    expect(tooltip['name']).toBe(tName);

    expect(tooltip.element.nodeName).toBe('DIV');

    const isHasClass = tooltip.element.classList.contains(`range-slider__tooltip_${tName}`);
    expect(isHasClass).toBeTruthy();
  });
});

describe('setTooltipText', () => {
  let value = 3.8000000000000003;
  test(`should return rounded value of ${value}`, () => {
    const tName: ThumbName = 'from';
    const tooltip = new Tooltip(tName);

    const result = tooltip['setTooltipText'](value, settings);
    expect(result.element.innerText).toBe('3.8');
  });

  test('should return 10.0 as string', () => {
    value = 124; // bigger than settings.max, should return settings.max
    settings.max = 10;
    settings.step = 0.1;
    /**
     * shouldReturn = '10.0';
     * because settings.max = 10
     * and settings.step = 0.1 - has one digit after point
     * then 10 + one zero after point = 10.0
     */
    const shouldReturn = '10.0';
    const tName: ThumbName = 'from';
    const tooltip = new Tooltip(tName);
    const result = tooltip['setTooltipText'](value, settings);
    expect(result.element.innerText).toBe(shouldReturn);
  });
});
