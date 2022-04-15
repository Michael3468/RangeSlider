/**
 * @jest-environment jsdom
 */

import Model from '../Model/Model';
import Presenter from './Presenter';
import View from '../View/View';

import { ISettings } from '../RangeSlider/types';

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 100,
    max: 500,
    range: true,
    scale: true,
    tooltips: true,
    vertical: true,
    confpanel: true,
    bar: true,
    from: 150,
    to: 400,
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
      .spyOn(presenter['view'], 'createRangeSlider');

    const addChangeSettingsObserverSpy = jest
      .spyOn(presenter['view'].changeSettingsObserver, 'addObserver');

    let addChangeConfPanelSettingsObserverSpy;
    if (presenter['view'].configurationPanel) {
      addChangeConfPanelSettingsObserverSpy = jest
        .spyOn(presenter['view'].configurationPanel.changeConfPanelSettingsObserver, 'addObserver');
    }
    /**
     * обнуляем массивы обзёрверов для теста метода 'initRangeSlider'
     * т.к. туда добавляется обзервер при создании экземпляра Presenter
     */
    presenter['view'].changeSettingsObserver['observers'] = [];
    if (presenter['view'].configurationPanel) {
      presenter['view'].configurationPanel.changeConfPanelSettingsObserver['observers'] = [];
    }
    presenter['initRangeSlider']();
    expect(createRangeSliderSpy).toBeCalled();
    expect(addChangeSettingsObserverSpy).toBeCalled();
    expect(addChangeConfPanelSettingsObserverSpy).toBeCalled();

    /**
     * после выполнения presenter['initRangeSlider']();
     * в массиве обзерверов должен быть обзервер
     * т.е. длинна массива обзерверов должна быть больше 0
     */
    const changeSettingsObs = presenter['view'].changeSettingsObserver['observers'];
    expect(changeSettingsObs.length).toBeGreaterThan(0);

    let cpSettingsObs = [];
    if (presenter['view'].configurationPanel) {
      cpSettingsObs = presenter['view'].configurationPanel
        .changeConfPanelSettingsObserver['observers'];
    }
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
    presenter['view'].changeSettingsObserver['observers'] = [];
    if (presenter['view'].configurationPanel) {
      presenter['view'].configurationPanel.changeConfPanelSettingsObserver['observers'] = [];
    }

    const spyUpdateSettings = jest.spyOn(presenter['model'], 'updateSettings');
    let spyUpdateState;
    if (presenter['view'].configurationPanel) {
      spyUpdateState = jest.spyOn(presenter['view'].configurationPanel, 'updateState');
    }

    const result = presenter['initRangeSlider']();
    result['view'].changeSettingsObserver.notifyObservers(settings);

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
    presenter['view'].changeSettingsObserver['observers'] = [];
    if (presenter['view'].configurationPanel) {
      presenter['view'].configurationPanel.changeConfPanelSettingsObserver['observers'] = [];
    }

    const spyUpdateSettings = jest.spyOn(presenter['model'], 'updateSettings');
    const spyCreateRangeSlider = jest.spyOn(presenter['view'], 'createRangeSlider');

    const result = presenter['initRangeSlider']();
    if (result['view'].configurationPanel) {
      result['view'].configurationPanel
        .changeConfPanelSettingsObserver.notifyObservers(settings);
    }

    expect(spyUpdateSettings).toBeCalledWith(settings);
    expect(spyCreateRangeSlider).toBeCalledWith(settings);
  });
});

describe('private updateModelAndPanel', () => {
  it('should call this.model.updateSettings(settings) method', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(settings);
    const view = new View('#range-slider', settings);
    const presenter = new Presenter(model, view);

    const modelUpdateSettings = jest.spyOn(presenter['model'], 'updateSettings');
    presenter['updateModelAndPanel'](settings);

    expect(modelUpdateSettings).toBeCalled();
    expect(modelUpdateSettings).toBeCalledWith(settings);
  });
});

describe('private updateModelAndView', () => {
  it('should call this.model.updateSettings(settings)', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(settings);
    const view = new View('#range-slider', settings);
    const presenter = new Presenter(model, view);

    const updateSettings = jest.spyOn(presenter['model'], 'updateSettings');
    presenter['updateModelAndView'](settings);

    expect(updateSettings).toBeCalled();
    expect(updateSettings).toBeCalledWith(settings);
  });

  it('should call this.view.destroyView()', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(settings);
    const view = new View('#range-slider', settings);
    const presenter = new Presenter(model, view);

    const destroyView = jest.spyOn(presenter['view'], 'destroyView');
    presenter['updateModelAndView'](settings);

    expect(destroyView).toBeCalled();
  });

  it('should call this.view.createRangeSlider(this.model.getSettings()', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(settings);
    const view = new View('#range-slider', settings);
    const presenter = new Presenter(model, view);

    const createRangeSlider = jest.spyOn(presenter['view'], 'createRangeSlider');
    presenter['updateModelAndView'](settings);

    expect(createRangeSlider).toBeCalled();
    expect(createRangeSlider).toBeCalledWith(presenter['model'].getSettings());
  });
});
