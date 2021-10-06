/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Observer from './Observer';

describe('addObserver', () => {
  it('should throw Error "Observer already in the list"', () => {
    const observer = new Observer();

    expect(() => {
      observer.addObserver(() => { console.log('test observer'); });
    }).not.toThrow();

    expect(() => {
      observer.addObserver(() => { console.log('test observer'); });
    }).toThrow();
  });
});

describe('removeObserver', () => {
  const testFn = () => { console.log('test function'); };

  it('should remove observer from observers list', () => {
    const observer = new Observer();

    observer.addObserver(testFn);
    expect(observer.observers.length).toBe(1); // должен быть один элемент в массиве

    observer.removeObserver(testFn);
    expect(observer.observers.length).toBe(0); // должен быть пустой массив
  });

  it('should throw error', () => {
    const observer = new Observer();

    observer.addObserver(testFn); // добавляем в массив обзервер
    expect(observer.observers.length).toBe(1);

    expect(() => {
      // удаляем из массива обзервер которого там нет
      observer.removeObserver(() => { console.log('another function for test'); });
    }).toThrow();
  });
});
