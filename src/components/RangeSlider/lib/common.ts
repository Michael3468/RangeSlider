/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ISettings, ISliderElement } from '../RangeSlider/types';

// TODO add IMinMax interface / del settings guard
export function getMinMaxElementEdgesInPx(settings: ISettings, el: ISliderElement) {
  if (!settings) {
    throw new Error('\'settings\' is undefined !');
  }

  const elementRect = el.element.getBoundingClientRect();

  if (settings.isVertical) {
    return {
      min: elementRect!.top,
      max: elementRect!.bottom,
    };
  }
  return {
    min: elementRect!.left,
    max: elementRect!.right,
  };
}

export function getElementLengthInPx(settings: ISettings, el: HTMLElement): number {
  return settings.isVertical
    ? el.getBoundingClientRect().height
    : el.getBoundingClientRect().width;
}
