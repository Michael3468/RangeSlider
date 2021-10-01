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

// export interface PointerEvent<T = Element> extends MouseEvent<T, NativePointerEvent> {
//   pointerId: number;
//   pressure: number;
//   tangentialPressure: number;
//   tiltX: number;
//   tiltY: number;
//   twist: number;
//   width: number;
//   height: number;
//   pointerType: 'mouse' | 'pen' | 'touch';
//   isPrimary: boolean;
// }

// if (!global.PointerEvent) {
export class PointerEvent extends MouseEvent {
  public height?: number;
  public isPrimary?: boolean;
  public pointerId?: number;
  public pointerType?: string;
  public pressure?: number;
  public tangentialPressure?: number;
  public tiltX?: number;
  public tiltY?: number;
  public twist?: number;
  public width?: number;

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params);
    this.pointerId = params.pointerId;
    this.width = params.width;
    this.height = params.height;
    this.pressure = params.pressure;
    this.tangentialPressure = params.tangentialPressure;
    this.tiltX = params.tiltX;
    this.tiltY = params.tiltY;
    this.pointerType = params.pointerType;
    this.isPrimary = params.isPrimary;
  }
  public ReleasePointerCapture(value);
}
global.PointerEvent = PointerEvent as any;
// }
