import {
  ISliderElement,
  INodeName,
  IMinMax,
  IModelSettings,
  IUserSettings,
  IViewSettings,
} from '../RangeSlider/types';

function getMinMaxElementEdgesInPx(viewSettings: IViewSettings, el: ISliderElement): IMinMax {
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

function getElementLengthInPx(viewSettings: IViewSettings, el: HTMLElement): number {
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

function getOnePointInPx(
  settings: IModelSettings,
  viewSettings: IViewSettings,
  element: HTMLElement,
) {
  const elementLengthInPx: number = getElementLengthInPx(viewSettings, element);

  let elementLengthInPoints: number;
  if (settings.step >= 1) {
    elementLengthInPoints = settings.max - settings.min;
  } else {
    elementLengthInPoints = (settings.max - settings.min) / settings.step;
  }

  return Number((elementLengthInPx / elementLengthInPoints).toFixed(3));
}

function getDigitsAfterPoint(settings: IModelSettings): number {
  return settings.step < 1
    ? (settings.step).toString().length - 2
    : 0;
}

function getMinStep(settings: IModelSettings):number {
  const num = settings.step;

  return num < 1
    ? 1 / 10 ** (num.toString().length - 2)
    : 1;
}

type IDefSettings = IViewSettings | IModelSettings;

function updateObjectValues(
  defaultSettings: IDefSettings,
  userSettings: IUserSettings,
): IViewSettings | IModelSettings {
  const c: IViewSettings | IModelSettings = {};

  const keys: string[] = Object.getOwnPropertyNames(defaultSettings);

  keys.forEach((key) => {
    c[key] = key in userSettings
      ? userSettings[key as keyof IUserSettings]
      : defaultSettings[key as keyof IDefSettings];
  });

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
