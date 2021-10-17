/**
 * @jest-environment jsdom
 */

/* eslint-disable dot-notation */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { ThumbName } from '../RangeSlider/types';
import Tooltip from './Tooltip';

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
  let value = 123.456;
  test(`should return rounded value of ${value}`, () => {
    const tName: ThumbName = 'from';
    const tooltip = new Tooltip(tName);

    let result = tooltip['setTooltipText'](value);
    expect(result.element.innerText).toBe('123');

    value = 124;
    result = tooltip['setTooltipText'](value);
    expect(result.element.innerText).toBe('124');
  });
});
