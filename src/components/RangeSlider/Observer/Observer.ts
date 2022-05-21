import {
  AbstractObserver,
  IModelSettings,
  IUpdateFn,
  IViewSettings,
} from '../RangeSlider/types';

class Observer extends AbstractObserver {
  protected observers: IUpdateFn[];

  constructor() {
    super();
    this.observers = [];
  }

  public addObserver(fn: IUpdateFn): void {
    this.observers.forEach((observer) => {
      if (String(observer) === String(fn)) {
        throw new Error('Observer is already in the list');
      }
    });
    this.observers.push(fn);
  }

  public removeObserver(fn: IUpdateFn): void {
    let isObserverRemoved = false;

    this.observers.forEach((observer, index) => {
      if (String(observer) === String(fn)) {
        this.observers.splice(index, 1);
        isObserverRemoved = true;
      }
    });

    if (!isObserverRemoved) {
      throw new Error('Could not find observer in the list of observers');
    }
  }

  public notifyObservers(settings: IViewSettings | IModelSettings): void {
    this.observers.forEach((observer) => {
      observer(settings);
    });
  }
}

export default Observer;
