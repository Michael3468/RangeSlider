import { ISettings } from '../RangeSlider/types';
import Observer from './Observer';

const testFn = jest.fn();
const testFn2 = jest.fn();

describe('addObserver', () => {
  it('should throw Error "Observer already in the list"', () => {
    const observer = new Observer();

    expect(() => {
      observer.addObserver(() => testFn);
    }).not.toThrow();

    expect(() => {
      observer.addObserver(() => testFn);
    }).toThrow();
  });
});

describe('removeObserver', () => {
  it('should remove observer from observers list', () => {
    const observer = new Observer();

    observer.addObserver(testFn);
    expect(observer['observers'].length).toBe(1); // must be one element in array

    observer.removeObserver(testFn);
    expect(observer['observers'].length).toBe(0); // must be an empty array
  });

  it('should throw error', () => {
    const observer = new Observer();

    observer.addObserver(testFn); // add observer to array
    expect(observer['observers'].length).toBe(1);

    expect(() => {
      // try to remove observer which was not added in the array
      observer.removeObserver(() => testFn2);
    }).toThrow();
  });
});

describe('notifyObservers', () => {
  const settings: ISettings = {
    min: 0,
    max: 100,
    range: true,
    scale: true,
    vertical: false,
    tooltips: true,
    confpanel: true,
    bar: true,
    from: 10,
    to: 80,
    step: 10,
  };

  it('should notify observers', () => {
    const observer = new Observer();

    let updMin = 0;

    observer.addObserver(() => { updMin = settings.min + 1; });
    observer.notifyObservers(settings);

    expect(updMin).toBe(1);
  });
});
