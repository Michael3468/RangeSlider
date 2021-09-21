/**
 * @jest-environment jsdom
 */

/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import Range from './Range';

describe('setMarginFromBegin', () => {
  test('should return "div" element with class "range-slider__range" and marigin-top = value', () => {
    const range = new Range();
    const isVertical = true;
    const value = 50;
    const result = range.setMarginFromBegin(value, isVertical);

    expect(result.element.nodeName).toBe('DIV');

    const isClassListContains = result.element.classList.contains('range-slider__range');
    expect(isClassListContains).toBeTruthy();

    const isStylesConstains = result.element.style.marginTop;
    expect(isStylesConstains).toBe(`${value}px`);
  });

  test('should return "div" element with class "range-slider__range" and marigin-left = value', () => {
    const range = new Range();
    const isVertical = false;
    const value = 50;
    const result = range.setMarginFromBegin(value, isVertical);

    expect(result.element.nodeName).toBe('DIV');

    const isClassListContains = result.element.classList.contains('range-slider__range');
    expect(isClassListContains).toBeTruthy();

    const isStylesConstains = result.element.style.marginLeft;
    expect(isStylesConstains).toBe(`${value}px`);
  });
});

describe('setMarginFromEnd', () => {
  test('should return "div" element with class "range-slider__range" and marigin-bottom = value', () => {
    const range = new Range();
    const isVertical = true;
    const value = 250;
    const result = range.setMarginFromEnd(value, isVertical);

    expect(result.element.nodeName).toBe('DIV');

    const isClassListContains = result.element.classList.contains('range-slider__range');
    expect(isClassListContains).toBeTruthy();

    const isStylesConstains = result.element.style.marginBottom;
    expect(isStylesConstains).toBe(`${value}px`);
  });

  test('should return "div" element with class "range-slider__range" and marigin-right = value', () => {
    const range = new Range();
    const isVertical = false;
    const value = 250;
    const result = range.setMarginFromEnd(value, isVertical);

    expect(result.element.nodeName).toBe('DIV');

    const isClassListContains = result.element.classList.contains('range-slider__range');
    expect(isClassListContains).toBeTruthy();

    const isStylesConstains = result.element.style.marginRight;
    expect(isStylesConstains).toBe(`${value}px`);
  });
});
