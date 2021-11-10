/**
 * @jest-environment jsdom
 */

/* eslint-disable dot-notation */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Presenter from './Presenter';
import Model from '../Model/Model';
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
    isConfPanel: true,
    isBarVisible: true,
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
    const presenter = new Presenter(model, view); // тут заполняются обзёрвер

    const createRangeSliderSpy = jest
      .spyOn(presenter.view, 'createRangeSlider');

    const addChangeSettingsObserverSpy = jest
      .spyOn(presenter.view.changeSettingsObserver, 'addObserver');

    const addChangeConfPanelSettingsObserverSpy = jest
      .spyOn(presenter.view.configurationPanel.changeConfPanelSettingsObserver, 'addObserver');
    /**
     * обнуляем массивы обзёрверов для теста метода 'initRangeSlider'
     * т.к. туда добавляется обзервер при создании экземпляра Presenter
     */
    presenter.view.changeSettingsObserver.observers = [];
    presenter.view.configurationPanel.changeConfPanelSettingsObserver.observers = [];

    presenter['initRangeSlider']();
    expect(createRangeSliderSpy).toBeCalled();
    expect(addChangeSettingsObserverSpy).toBeCalled();
    expect(addChangeConfPanelSettingsObserverSpy).toBeCalled();

    /**
     * после выполнения presenter['initRangeSlider']();
     * в массиве обзерверов должен быть обзервер
     * т.е. длинна массива обзерверов должна быть больше 0
     */
    const changeSettingsObs = presenter.view.changeSettingsObserver.observers;
    expect(changeSettingsObs.length).toBeGreaterThan(0);

    const cpSettingsObs = presenter
      .view.configurationPanel.changeConfPanelSettingsObserver.observers;
    expect(cpSettingsObs.length).toBeGreaterThan(0);
  });

  it('changeSettingsObserver should has observers', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(settings);
    const view = new View('#range-slider', settings);
    const presenter = new Presenter(model, view); // тут заполняются обзёрверы

    /**
     * обнуляем массивы обзерверов для теста метода 'initRangeSlider'
     * т.к. туда добавляется обзервер при создании экземпляра Presenter
     */
    presenter.view.changeSettingsObserver.observers = [];
    presenter.view.configurationPanel.changeConfPanelSettingsObserver.observers = [];

    const spyUpdateSettings = jest.spyOn(presenter.model, 'updateSettings');
    const spyUpdateState = jest.spyOn(presenter.view.configurationPanel, 'updateState');

    // вызываем метод и создаём в нём обзёрверы
    const result = presenter['initRangeSlider']();
    // уведомляем обзёрверы
    result.view.changeSettingsObserver.notifyObservers(settings);

    expect(spyUpdateSettings).toBeCalledWith(settings);
    expect(spyUpdateState).toBeCalledWith(settings);
  });

  it('changeConfPanelSettingsObserver should has observers', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(settings);
    const view = new View('#range-slider', settings);
    const presenter = new Presenter(model, view); // тут заполняются обзёрверы

    /**
     * обнуляем массивы обзерверов для теста метода 'initRangeSlider'
     * т.к. туда добавляется обзёрвер при создании экземпляра Presenter
     */
    presenter.view.changeSettingsObserver.observers = [];
    presenter.view.configurationPanel.changeConfPanelSettingsObserver.observers = [];

    const spyUpdateSettings = jest.spyOn(presenter.model, 'updateSettings');
    const spyCreateRangeSlider = jest.spyOn(presenter.view, 'createRangeSlider');

    // вызываем метод и создаём в нём обзёрверы
    const result = presenter['initRangeSlider']();
    // уведомляем обзёрверы
    result.view.configurationPanel
      .changeConfPanelSettingsObserver.notifyObservers(settings);

    expect(spyUpdateSettings).toBeCalledWith(settings);
    expect(spyCreateRangeSlider).toBeCalledWith(settings);
  });
});
