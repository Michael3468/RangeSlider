export interface ISettings {
  min: number;
  max: number;
  isTwoRunners: boolean;
  isScaleVisible: boolean;
  isVertical: boolean;
  isTooltipsVisible: boolean;
  valueFrom: number;
  valueTo: number;
  step: number;
}

export interface ISliderElement {
  element: HTMLElement
}

export type ThumbName = 'from' | 'to';

export type INodeName = 'div' | 'span';
