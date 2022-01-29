/* istanbul ignore file */

/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

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

type CPInputElement = 'cpMin'
  | 'cpMax'
  | 'cpStep'
  | 'cpFrom'
  | 'cpTo'
  | 'cpVertical'
  | 'cpRange'
  | 'cpScale'
  | 'cpBar'
  | 'cpTips';

abstract class AbstractObserver {
  protected abstract observers: Function[];

  public abstract addObserver(fn: Function): void;

  public abstract removeObserver(fn: Function): void;

  public abstract notifyObservers(data?: ISettings): void;
}

abstract class AbstractSlider {
  abstract element: HTMLElement;

  protected abstract createSlider(id: string): HTMLElement;
}

abstract class AbstractRange {
  abstract element: HTMLElement;

  public abstract setMarginFromBegin(margin: number, isVertical: boolean): AbstractRange;

  public abstract setMarginFromEnd(margin: number, isVertical: boolean): AbstractRange;
}

abstract class AbstractScale {
  abstract element: HTMLElement;

  public abstract createScaleMarks(settings: ISettings): AbstractScale;
}

abstract class AbstractTooltip {
  abstract element: HTMLElement;

  public abstract setTooltipText(value: number, settings: ISettings): AbstractTooltip;
}

abstract class AbstractThumb {
  abstract element: HTMLElement;

  abstract tooltip: AbstractTooltip;

  public abstract setMargin(margin: number, settings: ISettings): AbstractThumb;
}

abstract class AbstractConfigurationPanel {
  abstract element: HTMLElement;

  abstract changeConfPanelSettingsObserver: AbstractObserver;

  public abstract updateState(settings: ISettings): void;
}

export {
  ISettings,
  IUserSettings,
  ISliderElement,
  IMinMax,
  ThumbName,
  INodeName,
  MeasureUnit,
  CPInputElement,
  AbstractThumb,
  AbstractTooltip,
  AbstractRange,
  AbstractSlider,
  AbstractScale,
  AbstractObserver,
  AbstractConfigurationPanel,
};
