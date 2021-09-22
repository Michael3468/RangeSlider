/**
 * @jest-environment jsdom
 */

/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { ISettings } from '../RangeSlider/types';
import Thumb from './Thumb';

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    isTwoRunners: true,
    isScaleVisible: true,
    isVertical: true,
    isTooltipsVisible: true,
    valueFrom: 1000,
    valueTo: 1400,
    step: 10,
  };
});

describe('setMargin', () => {
  test('should return "div" elemmt "Thumb" with margin-top and tooltip element', () => {
    const thumbName = 'from';
    const thumb = new Thumb(thumbName);
    const margin = 100;
    settings.isVertical = true;
    const result = thumb.setMargin(margin, settings);

    expect(result.element.nodeName).toBe('DIV');

    const isHasClass = result.element.classList.contains(`range-slider__thumb_${thumbName}`);
    expect(isHasClass).toBeTruthy();

    const { marginTop } = result.element.style;
    expect(marginTop).toBe(`${margin}px`);

    const tooltip = result.element.children[0];
    expect(tooltip).not.toBeNull();

    expect(tooltip?.nodeName).toBe('DIV');

    const isChildHasClass = tooltip?.classList.contains(`range-slider__tooltip_${thumbName}`);
    expect(isChildHasClass).toBeTruthy();
  });

  test('should return "div" elemmt "Thumb" with margin-left and tooltip element', () => {
    const thumbName = 'from';
    const thumb = new Thumb(thumbName);
    const margin = 200;
    settings.isVertical = false;
    const result = thumb.setMargin(margin, settings);

    expect(result.element.nodeName).toBe('DIV');

    const isHasClass = result.element.classList.contains(`range-slider__thumb_${thumbName}`);
    expect(isHasClass).toBeTruthy();

    const { marginLeft } = result.element.style;
    expect(marginLeft).toBe(`${margin}px`);

    const tooltip = result.element.children[0];
    expect(tooltip).not.toBeNull();

    expect(tooltip?.nodeName).toBe('DIV');

    const isChildHasClass = tooltip?.classList.contains(`range-slider__tooltip_${thumbName}`);
    expect(isChildHasClass).toBeTruthy();
  });
});
