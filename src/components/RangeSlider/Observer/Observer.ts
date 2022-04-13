import { AbstractObserver, ISettings } from '../RangeSlider/types';

class Observer extends AbstractObserver {
  protected observers: Function[];

  constructor() {
    super();
    this.observers = [];
  }

  public addObserver(fn: Function): void {
    this.observers.forEach((observer) => {
      if (String(observer) === String(fn)) {
        throw new Error('Observer is already in the list');
      }
    });
    this.observers.push(fn);
  }

  public removeObserver(fn: Function): void {
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

  public notifyObservers(data?: ISettings): void {
    this.observers.forEach((observer) => {
      observer(data);
    });
  }
}

export default Observer;
