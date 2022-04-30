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

  rectFrom?: DOMRect;
  rectTo?: DOMRect;
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

interface IUpdateFn {
  (settings: ISettings): void;
}

abstract class AbstractObserver {
  protected abstract observers: IUpdateFn[];

  public abstract addObserver(fn: IUpdateFn): void;

  public abstract removeObserver(fn: IUpdateFn): void;

  public abstract notifyObservers(settings: ISettings): void;
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
  IUpdateFn,
  AbstractThumb,
  AbstractTooltip,
  AbstractRange,
  AbstractSlider,
  AbstractScale,
  AbstractObserver,
  AbstractConfigurationPanel,
};
