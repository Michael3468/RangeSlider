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

  currentPos?: number;
  posWithStepInPercents?: number;
  curPosInPoints?: number;
  thumbMarginFrom?: number;
  thumbMarginTo?: number;
  stepInPrecents?: number;
}

interface IModelSettings {
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
  stepInPrecents: number;
  currentPos: number;
  curPosInPoints: number | undefined;
  posWithStepInPercents: number;
}

interface IViewSettings {
  range: boolean;
  scale: boolean;
  tooltips: boolean;
  vertical: boolean;
  confpanel: boolean;
  bar: boolean;

  thumbMarginFrom: number;
  thumbMarginTo: number;
  rangeMarginFrom: number;
  rangeMarginTo: number;
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
  (settings: IViewSettings | IModelSettings): void;
}

abstract class AbstractObserver {
  protected abstract observers: IUpdateFn[];

  public abstract addObserver(fn: IUpdateFn): void;

  public abstract removeObserver(fn: IUpdateFn): void;

  public abstract notifyObservers(settings: IViewSettings | IModelSettings): void;
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

  public abstract createScaleMarks(
    settings: IModelSettings,
    viewSettings: IViewSettings
  ): AbstractScale;
}

abstract class AbstractTooltip {
  abstract element: HTMLElement;

  public abstract setTooltipText(value: number, settings: IModelSettings): AbstractTooltip;
}

abstract class AbstractThumb {
  abstract element: HTMLElement;

  abstract tooltip: AbstractTooltip;

  public abstract setMargin(margin: number, settings: IViewSettings): AbstractThumb;
}

abstract class AbstractConfigurationPanel {
  abstract element: HTMLElement;

  abstract changeConfPanelSettingsObserver: AbstractObserver;

  abstract changeConfPanelViewSettingsObserver: AbstractObserver;

  abstract getStepInPercentsObserver: AbstractObserver;

  public abstract updateState(settings: IModelSettings, viewSettings: IViewSettings): void;
}

export {
  ISettings,
  IModelSettings,
  IViewSettings,
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
