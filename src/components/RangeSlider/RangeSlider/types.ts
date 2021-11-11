/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-unused-vars */
interface ISettings {
  min: number;
  max: number;
  valueFrom: number;
  valueTo: number;
  step: number;
  isTwoRunners: boolean;
  isScaleVisible: boolean;
  isVertical: boolean;
  isTooltipsVisible: boolean;
  isConfPanel: boolean;
  isBarVisible: boolean;
}

interface IUserSettings {
  min?: number;
  max?: number;
  valueFrom?: number;
  valueTo?: number;
  step?: number;
  isTwoRunners?: boolean;
  isScaleVisible?: boolean;
  isVertical?: boolean;
  isTooltipsVisible?: boolean;
  isConfPanel?: boolean;
  isBarVisible?: boolean;
}

interface ISliderElement {
  element: HTMLElement
}

interface IMinMax {
  min: number,
  max: number,
}

type ThumbName = 'from' | 'to';

type INodeName = 'div' | 'span';

type MeasureUnit = 'px' | '%';

class PointerEvent extends MouseEvent {
  public height: number;
  public isPrimary: boolean;
  public pointerId: number;
  public pointerType: string;
  public pressure: number;
  public tangentialPressure: number;
  public tiltX: number;
  public tiltY: number;
  public twist: number;
  public width: number;

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params);
    this.pointerId = params.pointerId!;
    this.width = params.width!;
    this.height = params.height!;
    this.pressure = params.pressure!;
    this.tangentialPressure = params.tangentialPressure!;
    this.tiltX = params.tiltX!;
    this.tiltY = params.tiltY!;
    this.twist = params.twist!;
    this.pointerType = params.pointerType!;
    this.isPrimary = params.isPrimary!;
  }

  public ReleasePointerCapture(value: any) {}
  public getCoalescedEvents(): any {}
  public getPredictedEvents(): any {}
}
global.PointerEvent = PointerEvent as any;

export {
  ISettings,
  IUserSettings,
  ISliderElement,
  IMinMax,
  ThumbName,
  INodeName,
  MeasureUnit,
  PointerEvent,
};
