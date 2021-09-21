/**
 * @jest-environment jsdom
 */

/* eslint-disable dot-notation */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import Slider from './Slider';

describe('private createSlider', () => {
  test('should return "div" element with class "range-slider"', () => {
    const spyFunc = jest.fn((sliderId: string) => {
      const sliderElement = document.createElement('div');
      sliderElement.id = sliderId;
      return sliderElement;
    });

    Object.defineProperty(global.document, 'querySelector', { value: spyFunc });

    const sliderId = 'range-slider';
    const slider = new Slider(sliderId);

    const result = slider['createSlider'](sliderId);

    expect(spyFunc).toHaveBeenCalled();
    expect(result.nodeName).toBe('DIV');
    expect(result.id).toBe(sliderId);
    expect(result.classList.contains('range-slider')).toBeTruthy();
  });
});
