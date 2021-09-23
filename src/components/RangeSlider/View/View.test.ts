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
});
