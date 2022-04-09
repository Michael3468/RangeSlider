/**
 * @jest-environment jsdom
 */

import Range from './Range';

describe('setMarginFromBegin', () => {
  test('should return "div" element with class "range-slider__range" and margin-top = value', () => {
    const range = new Range();
    const vertical = true;
    const value = 50;
    const result = range.setMarginFromBegin(value, vertical);

    expect(result.element.nodeName).toBe('DIV');

    const isClassListContains = result.element.classList.contains('range-slider__range');
    expect(isClassListContains).toBeTruthy();

    const isStylesContains = result.element.style.marginTop;
    expect(isStylesContains).toBe(`${value}px`);
  });

  test('should return "div" element with class "range-slider__range" and margin-left = value', () => {
    const range = new Range();
    const vertical = false;
    const value = 50;
    const result = range.setMarginFromBegin(value, vertical);

    expect(result.element.nodeName).toBe('DIV');

    const isClassListContains = result.element.classList.contains('range-slider__range');
    expect(isClassListContains).toBeTruthy();

    const isStylesContains = result.element.style.marginLeft;
    expect(isStylesContains).toBe(`${value}px`);
  });
});

describe('setMarginFromEnd', () => {
  test('should return "div" element with class "range-slider__range" and margin-bottom = value', () => {
    const range = new Range();
    const vertical = true;
    const value = 250;
    const result = range.setMarginFromEnd(value, vertical);

    expect(result.element.nodeName).toBe('DIV');

    const isClassListContains = result.element.classList.contains('range-slider__range');
    expect(isClassListContains).toBeTruthy();

    const isStylesContains = result.element.style.marginBottom;
    expect(isStylesContains).toBe(`${value}px`);
  });

  test('should return "div" element with class "range-slider__range" and margin-right = value', () => {
    const range = new Range();
    const vertical = false;
    const value = 250;
    const result = range.setMarginFromEnd(value, vertical);

    expect(result.element.nodeName).toBe('DIV');

    const isClassListContains = result.element.classList.contains('range-slider__range');
    expect(isClassListContains).toBeTruthy();

    const isStylesContains = result.element.style.marginRight;
    expect(isStylesContains).toBe(`${value}px`);
  });
});
