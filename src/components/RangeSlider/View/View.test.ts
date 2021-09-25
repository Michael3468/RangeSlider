/**
 * @jest-environment jsdom
 */

/* eslint-disable no-shadow */
/* eslint-disable dot-notation */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import { ISettings } from '../RangeSlider/types';
import View from './View';

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
    valueTo: 1490,
    step: 10,
  };
});

function createRS(settings: ISettings) {
  const view = new View('range-slider', settings);
  return view.createRangeSlider(settings);
}

describe('constructor', () => {
  function testConstructor(settings: ISettings) {
    expect(createRS(settings).slider.element.nodeName).toBe('DIV');

    const isHasId = createRS(settings).slider.element.id;
    expect(isHasId).toBe('range-slider');

    const isHasClass = createRS(settings).slider.element.classList.contains('range-slider');
    expect(isHasClass).toBeTruthy();

    const isHasClassVertical = createRS(settings).slider.element.classList.contains('range-slider_vertical');

    return isHasClassVertical;
  }

  test('should return "div" element with id="range-slider" and class="range-slider"', () => {
    settings.isVertical = false;
    const isHasClassVertical = testConstructor(settings);

    expect(isHasClassVertical).toBeFalsy();
  });

  test('should return "div" with id="range-slider" and class="range-slider range-slider_vertical"', () => {
    settings.isVertical = true;
    const isHasClassVertical = testConstructor(settings);

    expect(isHasClassVertical).toBeTruthy();
  });
});

describe('public createRangeSlider', () => {
  const spyFunc = jest.fn((sliderId: string) => {
    const sliderElement = document.createElement('div');
    sliderElement.id = sliderId;
    return sliderElement;
  });

  Object.defineProperty(global.document, 'querySelector', { value: spyFunc });

  function testChild(settings: ISettings, childNum: number, childClass: string) {
    const firstChildThumb = createRS(settings).slider.element.children[childNum];
    const isHasClass = firstChildThumb?.classList.contains(childClass);
    expect(isHasClass).toBeTruthy();
  }

  test('should return slider with one runner', () => {
    settings.isTwoRunners = false;
    testChild(settings, 0, 'range-slider__thumb_to');
    testChild(settings, 1, 'range-slider__range');
  });

  test('should return slider with two runners', () => {
    settings.isTwoRunners = true;
    testChild(settings, 0, 'range-slider__thumb_from');
    testChild(settings, 1, 'range-slider__thumb_to');
    testChild(settings, 2, 'range-slider__range');
  });

  function isSliderHasClassVertical(settings: ISettings) {
    return createRS(settings).slider.element.classList.contains('range-slider_vertical');
  }

  function isScaleHasClassVertical(settings: ISettings) {
    return createRS(settings).scale.element.classList.contains('range-slider__scale_vertical');
  }

  // if (settings.isVertical) and if (settings.isTooltipsVisible)
  function isTooltipFromHaveClassVertical(settings: ISettings) {
    return createRS(settings).from.tooltip.element.classList.contains('range-slider__tooltip_vertical');
  }
  function isTooltipToHaveClassVertical(settings: ISettings) {
    return createRS(settings).to.tooltip.element.classList.contains('range-slider__tooltip_vertical');
  }

  // if (settings.isVertical) and if (settings.isTwoRunners)
  function isThumbFromHaveClassVertical(settings: ISettings) {
    return createRS(settings).from.element.classList.contains('range-slider__thumb_vertical');
  }
  function isThumbToHaveClassVertical(settings: ISettings) {
    return createRS(settings).to.element.classList.contains('range-slider__thumb_vertical');
  }

  test('if settings.isVertical == true, should add vertical classes, ', () => {
    // if (settings.isVertical)
    settings.isVertical = true;
    expect(isSliderHasClassVertical(settings)).toBeTruthy();

    settings.isVertical = false;
    expect(isSliderHasClassVertical(settings)).toBeFalsy();

    settings.isVertical = true;
    expect(isScaleHasClassVertical(settings)).toBeTruthy();

    settings.isVertical = false;
    expect(isScaleHasClassVertical(settings)).toBeFalsy();

    // if (settings.isVertical) and if (settings.isTooltipsVisible)
    settings.isVertical = true;
    settings.isTooltipsVisible = true;
    expect(isTooltipFromHaveClassVertical(settings)).toBeTruthy();
    expect(isTooltipToHaveClassVertical(settings)).toBeTruthy();

    settings.isVertical = true;
    settings.isTooltipsVisible = false;
    expect(isTooltipFromHaveClassVertical(settings)).toBeFalsy();
    expect(isTooltipToHaveClassVertical(settings)).toBeFalsy();

    settings.isVertical = false;
    settings.isTooltipsVisible = true;
    expect(isTooltipFromHaveClassVertical(settings)).toBeFalsy();
    expect(isTooltipToHaveClassVertical(settings)).toBeFalsy();

    // if (settings.isVertical) and if (settings.isTwoRunners)
    settings.isVertical = true;
    settings.isTwoRunners = true;
    expect(isThumbFromHaveClassVertical(settings)).toBeTruthy();
    expect(isThumbToHaveClassVertical(settings)).toBeTruthy();

    settings.isVertical = true;
    settings.isTwoRunners = false;
    expect(isThumbFromHaveClassVertical(settings)).toBeFalsy();
    expect(isThumbToHaveClassVertical(settings)).toBeTruthy();
  });

  // if (!settings.isTooltipsVisible)
  function isTooltipFromHaveClassHidden(settings: ISettings) {
    return createRS(settings).from.tooltip.element.classList.contains('range-slider__tooltip_hidden');
  }

  function isTooltipToHaveClassHidden(settings: ISettings) {
    return createRS(settings).to.tooltip.element.classList.contains('range-slider__tooltip_hidden');
  }

  // if (!settings.isTooltipsVisible)
  test('should return tooltips with class="range-slider__tooltip_hidden"', () => {
    settings.isTooltipsVisible = true;
    expect(isTooltipFromHaveClassHidden(settings)).toBeFalsy();
    expect(isTooltipToHaveClassHidden(settings)).toBeFalsy();

    settings.isTooltipsVisible = false;
    expect(isTooltipFromHaveClassHidden(settings)).toBeTruthy();
    expect(isTooltipToHaveClassHidden(settings)).toBeTruthy();
  });

  // if (settings.isScaleVisible)
  function isHasScale(settings: ISettings) {
    if (settings.isTwoRunners) {
      return createRS(settings).slider.element.children[3]?.classList.contains('range-slider__scale');
    }
    return createRS(settings).slider.element.children[2]?.classList.contains('range-slider__scale');
  }

  test('should return slider with scale element', () => {
    // has child
    settings.isScaleVisible = true;
    settings.isTwoRunners = true;
    expect(isHasScale(settings)).toBeTruthy();

    settings.isScaleVisible = true;
    settings.isTwoRunners = false;
    expect(isHasScale(settings)).toBeTruthy();

    // has no child
    settings.isScaleVisible = false;
    settings.isTwoRunners = true;
    expect(isHasScale(settings)).toBeFalsy();

    settings.isScaleVisible = false;
    settings.isTwoRunners = false;
    expect(isHasScale(settings)).toBeFalsy();
  });

  test('if (settings.isScaleVisible) "createScaleMarks" should have been called ', () => {
    settings.isScaleVisible = true;
    let view = new View('range-slider', settings);
    let createScaleMarksSpy = jest.spyOn(view.scale, 'createScaleMarks');
    view.createRangeSlider(settings);
    expect(createScaleMarksSpy).toHaveBeenCalled();

    settings.isScaleVisible = false;
    view = new View('range-slider', settings);
    createScaleMarksSpy = jest.spyOn(view.scale, 'createScaleMarks');
    view.createRangeSlider(settings);
    expect(createScaleMarksSpy).not.toHaveBeenCalled();
  });
});

describe('private isTooltipsCollision', () => {
  test('check settings.isVertical - true', () => {
    settings.isVertical = true;
    const view = new View('range-slider', settings);

    view.from.element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100, // value to check
      left: 100,
      bottom: 120,
      right: 120,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    view.to.element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100, // value to check
      left: 120,
      bottom: 120,
      right: 140,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    view.to.tooltip.element.getBoundingClientRect = jest.fn(() => ({
      width: 40,
      height: 20, // value to check
      top: 100,
      left: 120,
      bottom: 120,
      right: 160,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    let result = view['isTooltipsCollision']();
    expect(result).toBeTruthy();

    view.to.element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 150, // value 150 to return false
      left: 120,
      bottom: 120,
      right: 140,
      x: 150,
      y: 100,
      toJSON: () => {},
    }));

    result = view['isTooltipsCollision']();
    expect(result).toBeFalsy();
  });

  test('check settings.isVertical - false', () => {
    settings.isVertical = false;
    const view = new View('range-slider', settings);

    view.from.element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100,
      left: 100,
      bottom: 120,
      right: 120, // value to check
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    view.to.element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100,
      left: 100,
      bottom: 120,
      right: 140, // value to check
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    view.to.tooltip.element.getBoundingClientRect = jest.fn(() => ({
      width: 40, // value to check
      height: 20,
      top: 100,
      left: 150,
      bottom: 120,
      right: 160,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));

    let result = view['isTooltipsCollision']();
    expect(result).toBeTruthy();

    view.to.element.getBoundingClientRect = jest.fn(() => ({
      width: 20,
      height: 20,
      top: 100,
      left: 120,
      bottom: 120,
      right: 170, // value 170 to return false
      x: 150,
      y: 100,
      toJSON: () => {},
    }));

    result = view['isTooltipsCollision']();
    expect(result).toBeFalsy();
  });
});

describe('private setDistanceBetweenTooltips', () => {
  test('should move tooltips in different directions (vertical)', () => {
    settings.isVertical = true;
    const view = new View('range-slider', settings);
    jest.spyOn(view, 'isTooltipsCollision').mockReturnValue(true);

    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result.from.tooltip.element.style.top;
    const toTop = result.to.tooltip.element.style.top;

    expect(fromTop).toBe('-55%');
    expect(toTop).toBe('55%');
  });

  test('should move tooltips close to each other (vertical)', () => {
    settings.isVertical = true;
    const view = new View('range-slider', settings);
    jest.spyOn(view, 'isTooltipsCollision').mockReturnValue(false);

    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result.from.tooltip.element.style.top;
    const toTop = result.to.tooltip.element.style.top;

    expect(fromTop).toBe('0%');
    expect(toTop).toBe('0%');
  });

  test('should move tooltips in different directions (horizontal)', () => {
    settings.isVertical = false;
    const view = new View('range-slider', settings);
    jest.spyOn(view, 'isTooltipsCollision').mockReturnValue(true);

    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result.from.tooltip.element.style.left;
    const toTop = result.to.tooltip.element.style.left;

    expect(fromTop).toBe('-105%');
    expect(toTop).toBe('5%');
  });

  test('should move tooltips close to each other (horizontal)', () => {
    settings.isVertical = false;
    const view = new View('range-slider', settings);
    jest.spyOn(view, 'isTooltipsCollision').mockReturnValue(false);

    const result = view['setDistanceBetweenTooltips']();

    const fromTop = result.from.tooltip.element.style.left;
    const toTop = result.to.tooltip.element.style.left;

    expect(fromTop).toBe('-50%');
    expect(toTop).toBe('-50%');
  });
});

describe('private setZindexTop', () => {
  const zIndexClass = 'range-slider__tooltip_z-index-top';
  const view = new View('range-slider', settings);

  test('should add zIndexClass to "from" element and del from "to" element', () => {
    const result = view['setZindexTop']('from');
    const fromContainsClass = result.from.element.classList.contains(zIndexClass);
    const toContainsClass = result.to.element.classList.contains(zIndexClass);
    expect(fromContainsClass).toBeTruthy();
    expect(toContainsClass).toBeFalsy();
  });

  test('should del zIndexClass from "from" element and add to "to" element', () => {
    const result = view['setZindexTop']('to');
    const fromContainsClass = result.from.element.classList.contains(zIndexClass);
    const toContainsClass = result.to.element.classList.contains(zIndexClass);
    expect(fromContainsClass).toBeFalsy();
    expect(toContainsClass).toBeTruthy();
  });
});
