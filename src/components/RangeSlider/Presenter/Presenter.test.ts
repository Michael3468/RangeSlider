/**
 * @jest-environment jsdom
 */

/* eslint-disable operator-linebreak */
/* eslint-disable dot-notation */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Presenter from './Presenter';
import { Model } from '../Model/Model';
import { ISettings } from '../RangeSlider/types';
import View from '../View/View';

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 100,
    max: 500,
    isTwoRunners: true,
    isScaleVisible: true,
    isTooltipsVisible: true,
    isVertical: true,
    valueFrom: 150,
    valueTo: 400,
    step: 10,
  };
});

describe('private initRangeSlider', () => {
  it('should call functions', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(settings);
    const view = new View('#range-slider', settings);
    const presenter = new Presenter(model, view);

    const createRangeSliderSpy = jest.spyOn(presenter.view, 'createRangeSlider');
    const addObserverSpy = jest.spyOn(presenter.view.changeSettingsObserver, 'addObserver');

    /**
     * обнуляем массив обзерверов для теста метода 'initRangeSlider'
     * т.к. туда добавляется обзервер при создании экземляра Presenter
     */
    presenter.view.changeSettingsObserver.observers = [];

    presenter['initRangeSlider']();
    expect(createRangeSliderSpy).toBeCalled();
    expect(addObserverSpy).toBeCalled();

    /**
     * после выполнения presenter['initRangeSlider']();
     * в массиве обзерверов должен быть обзервер
     * т.е. длинна массива обзерверов должна быть больше 0
     */
    const { observers } = presenter.view.changeSettingsObserver;
    expect(observers.length).toBeGreaterThan(0);
  });
});
