/**
 * @jest-environment jsdom
 */

import Thumb from './Thumb';

import { ISettings } from '../RangeSlider/types';

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    range: true,
    scale: true,
    vertical: true,
    tooltips: true,
    confpanel: true,
    bar: true,
    from: 1000,
    to: 1400,
    step: 10,
  };
});

describe('public setMargin', () => {
  test('should return "div" element "Thumb" with margin-top and tooltip element', () => {
    const thumbName = 'from';
    const thumb = new Thumb(thumbName);
    const margin = 100;
    settings.vertical = true;
    const result = thumb.setMargin(margin, settings);

    expect(result.element.nodeName).toBe('DIV');

    const isHasClass = result.element.classList.contains(`thumb-${thumbName}`);
    expect(isHasClass).toBeTruthy();

    const { marginTop } = result.element.style;
    expect(marginTop).toBe(`${margin}px`);

    const tooltip = result.element.children[0];
    expect(tooltip).not.toBeNull();

    expect(tooltip?.nodeName).toBe('DIV');

    const isChildHasClass = tooltip?.classList.contains(`tooltip-${thumbName}`);
    expect(isChildHasClass).toBeTruthy();
  });

  test('should return "div" element "Thumb" with margin-left and tooltip element', () => {
    const thumbName = 'from';
    const thumb = new Thumb(thumbName);
    const margin = 200;
    settings.vertical = false;
    const result = thumb.setMargin(margin, settings);

    expect(result.element.nodeName).toBe('DIV');

    const isHasClass = result.element.classList.contains(`thumb-${thumbName}`);
    expect(isHasClass).toBeTruthy();

    const { marginLeft } = result.element.style;
    expect(marginLeft).toBe(`${margin}px`);

    const tooltip = result.element.children[0];
    expect(tooltip).not.toBeNull();

    expect(tooltip?.nodeName).toBe('DIV');

    const isChildHasClass = tooltip?.classList.contains(`tooltip-${thumbName}`);
    expect(isChildHasClass).toBeTruthy();
  });
});
