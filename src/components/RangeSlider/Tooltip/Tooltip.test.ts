/**
 * @jest-environment jsdom
 */

/* eslint-disable dot-notation */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
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

  /* settings.max = 10; */
  test('should return 10 (settings.max) as string', () => {
    value = 124;
    const tName: ThumbName = 'from';
    const tooltip = new Tooltip(tName);
    const result = tooltip['setTooltipText'](value, settings);
    expect(result.element.innerText).toBe((settings.max).toString());
  });
});
