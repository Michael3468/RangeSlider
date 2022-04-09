import {
  ISettings, ISliderElement, INodeName, IMinMax,
} from '../RangeSlider/types';

function getMinMaxElementEdgesInPx(settings: ISettings, el: ISliderElement): IMinMax {
  const elementRect = el.element.getBoundingClientRect();

  if (settings.vertical) {
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
  return settings.vertical
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

  let elementLengthInPoints: number;
  if (settings.step >= 1) {
    elementLengthInPoints = settings.max - settings.min;
  } else {
    elementLengthInPoints = (settings.max - settings.min) / settings.step;
  }

  return Number((elementLengthInPx / elementLengthInPoints).toFixed(3));
}

function getDigitsAfterPoint(settings: ISettings): number {
  return settings.step < 1
    ? (settings.step).toString().length - 2
    : 0;
}

function getMinStep(settings: ISettings):number {
  const num = settings.step;

  return num < 1
    ? 1 / 10 ** (num.toString().length - 2)
    : 1;
}

export {
  getMinMaxElementEdgesInPx,
  getElementLengthInPx,
  createElement,
  getOnePointInPx,
  getDigitsAfterPoint,
  getMinStep,
};
