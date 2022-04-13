/* istanbul ignore file */

/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import JQuery from './global.d';

interface ISettings {
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
  range: boolean;
  scale: boolean;
  vertical: boolean;
  tooltips: boolean;
  confpanel: boolean;
  bar: boolean;
}

interface IUserSettings {
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
  range?: boolean;
  scale?: boolean;
  vertical?: boolean;
  tooltips?: boolean;
  confpanel?: boolean;
  bar?: boolean;
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
  | 'cpTooltips';

type IMethod = 'init' | 'destroy' | 'update';

interface IMethods {
  init(settings: IUserSettings): JQuery<HTMLElement>;
  destroy(): JQuery<HTMLElement>;
  update(userSettings: IUserSettings): JQuery<HTMLElement>;
}

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

  public abstract setMarginFromBegin(margin: number, vertical: boolean): AbstractRange;

  public abstract setMarginFromEnd(margin: number, vertical: boolean): AbstractRange;
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
  IMethod,
  IMethods,
  AbstractThumb,
  AbstractTooltip,
  AbstractRange,
  AbstractSlider,
  AbstractScale,
  AbstractObserver,
  AbstractConfigurationPanel,
};
