import {
  ISettings, ISliderElement, INodeName, IMinMax,
} from '../RangeSlider/types';

function getMinMaxElementEdgesInPx(settings: ISettings, el: ISliderElement): IMinMax {
  const elementRect = el.element.getBoundingClientRect();

  if (settings.isVertical) {
    return {
      min: elementRect.top,
      max: elementRect.bottom,
    };
  }
  return {
    min: elementRect.left,
    max: elementRect.right,
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

function getOnePointInPx(settings: ISettings, element: HTMLElement) {
  const elementLengthInPx: number = getElementLengthInPx(settings, element);
  const elementLengthInPoints: number = settings.max - settings.min;
  return elementLengthInPx / elementLengthInPoints;
}

function getDigitsAfterPoint(settings: ISettings): number {
  const n = settings.step;
  let digitsAfterPoint = 0;

  if (n > 0 && n < 1) {
    if (n.toString().includes('.')) {
      const splitDigitArr = n.toString().split('.');

      if (splitDigitArr[1] !== undefined) {
        digitsAfterPoint = splitDigitArr[1].length;
        return digitsAfterPoint;
      }
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
