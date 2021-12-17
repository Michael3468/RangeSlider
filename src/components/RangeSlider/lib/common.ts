/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
  ISettings, ISliderElement, INodeName, IMinMax,
} from '../RangeSlider/types';

function getMinMaxElementEdgesInPx(settings: ISettings, el: ISliderElement): IMinMax {
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

function getElementLengthInPx(settings: ISettings, el: HTMLElement): number {
  return settings.isVertical
    ? el.getBoundingClientRect().height
    : el.getBoundingClientRect().width;
}

function createElement(
  tag: INodeName,
  tagClassName: string,
  el?: HTMLElement,
): HTMLElement {
  const element = document.createElement(tag);
  element.className = tagClassName;

  if (el) {
    element.appendChild(el);
  }
  return element;
}

// TODO если делать метки через 10пх нужен ли этот метод?
function getOnePointInPx(settings: ISettings, element: HTMLElement) {
  const elementLengthInPx: number = getElementLengthInPx(settings, element);
  const elementLengthInPoints: number = settings.max - settings.min;
  // TODO если elementLengthInPoints меньше единицы и больше нуля,
  // тогда умножить его на 1 + количество цифр после запятой
  /* а если меньше нуля и больше -1? */
  return elementLengthInPx / elementLengthInPoints;
}

function getDigitsAfterPoint(settings: ISettings): number {
  const n = settings.step;
  let digitsAfterPoint = 0;

  if (n > 0 && n < 1) {
    if (n.toString().includes('.')) {
      digitsAfterPoint = n.toString().split('.').pop()!.length;
      return digitsAfterPoint;
    }
  }
  return digitsAfterPoint;
}

export {
  getMinMaxElementEdgesInPx,
  getElementLengthInPx,
  createElement,
  getOnePointInPx,
  getDigitsAfterPoint,
};
