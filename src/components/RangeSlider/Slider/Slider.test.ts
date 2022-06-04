/**
 * @jest-environment jsdom
 */

import Slider from './Slider';

abstract class SliderHint {
  abstract createSlider(id: string): HTMLElement;
}

describe('private createSlider', () => {
  test('should return "div" element with class "range-slider"', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const sliderId = '#range-slider';
    const slider = new Slider(sliderId);
    const result = slider['createSlider'](sliderId);

    expect(result.nodeName).toBe('DIV');
    expect(`#${result.id}`).toBe(sliderId);
    expect(result.classList.contains('range-slider')).toBeTruthy();
  });

  test('should throw error if element dont exist', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const sliderId = '#range-slider2';
    const slider = new Slider(sliderId);

    const spyCreateSlider = jest.spyOn(slider as unknown as SliderHint, 'createSlider');
    const result = slider['createSlider'](sliderId);

    expect(spyCreateSlider).toBeCalled();
    expect(result).toBeNull();
  });
});
