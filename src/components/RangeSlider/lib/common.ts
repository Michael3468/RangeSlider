import {
  ISettings, ISliderElement, INodeName, IMinMax,
} from '../RangeSlider/types';

function getMinMaxElementEdgesInPx(viewSettings: ISettings, el: ISliderElement): IMinMax {
  const elementRect = el.element.getBoundingClientRect();

  if (viewSettings.vertical) {
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

function getElementLengthInPx(viewSettings: ISettings, el: HTMLElement): number {
  return viewSettings.vertical
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

function getOnePointInPx(settings: ISettings, viewSettings: ISettings, element: HTMLElement) {
  const elementLengthInPx: number = getElementLengthInPx(viewSettings, element);

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

// TODO
function updateObjectValues(defaultSettings: ISettings, userSettings: IUserSettings) {
  const c = {};
  let key: any;

  for (key in defaultSettings) {
    if (defaultSettings.hasOwnProperty(key)) {
      c[key] = key in userSettings ? userSettings[key] : defaultSettings[key];
    }
  }

  return c;
}

export {
  getMinMaxElementEdgesInPx,
  getElementLengthInPx,
  createElement,
  getOnePointInPx,
  getDigitsAfterPoint,
  getMinStep,
  updateObjectValues,
};
