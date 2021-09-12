/* eslint-disable lines-between-class-members */
/* eslint-disable no-unused-vars */
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

export interface IMinMax {
  min: number,
  max: number,
}

export type ThumbName = 'from' | 'to';

export type INodeName = 'div' | 'span';
