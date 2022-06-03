/**
 * @jest-environment jsdom
 */

import Model from '../Model/Model';
import Presenter from './Presenter';
import View from '../View/View';

import { IModelSettings, IViewSettings } from '../RangeSlider/types';

let modelSettings: IModelSettings;
let viewSettings: IViewSettings;

beforeEach(() => {
  modelSettings = {
    min: 100,
    max: 500,
    from: 150,
    to: 400,
    step: 10,

    stepInPercents: 1,
    currentPos: 1,
    curPosInPoints: 1,
    posWithStepInPercents: 1,
  };

  viewSettings = {
    range: true,
    scale: true,
    tooltips: true,
    vertical: true,
    confpanel: true,
    bar: true,

    thumbMarginFrom: 1,
    thumbMarginTo: 1,
    rangeMarginFrom: 1,
    rangeMarginTo: 1,
  };
});

describe('private initRangeSlider', () => {
  it('should call functions', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(modelSettings);
    const view = new View('#range-slider', modelSettings, viewSettings);
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
    presenter['view'].getMarginObserver['observers'] = [];
    presenter['view'].changeSettingsObserver['observers'] = [];

    if (presenter['view'].configurationPanel) {
      presenter['view'].configurationPanel.changeConfPanelSettingsObserver['observers'] = [];
      presenter['view'].configurationPanel.changeConfPanelViewSettingsObserver['observers'] = [];
      presenter['view'].configurationPanel.getStepInPercentsObserver['observers'] = [];
    }
    presenter['view'].changeCurrentPosObserver['observers'] = [];

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

    const model = new Model(modelSettings);
    const view = new View('#range-slider', modelSettings, viewSettings);
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

    // const result = presenter['initRangeSlider']();
    // result['view'].changeSettingsObserver.notifyObservers(viewSettings);

    // expect(spyUpdateSettings).toBeCalledWith(modelSettings);
    // expect(spyUpdateState).toBeCalledWith(viewSettings);
  });

  it('changeConfPanelSettingsObserver should has observers', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(modelSettings);
    const view = new View('#range-slider', modelSettings, viewSettings);
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

    // const result = presenter['initRangeSlider']();
    // if (result['view'].configurationPanel) {
    //   result['view'].configurationPanel
    //     .changeConfPanelSettingsObserver.notifyObservers(modelSettings);
    // }

    // expect(spyUpdateSettings).toBeCalledWith(modelSettings);
    // expect(spyCreateRangeSlider).toBeCalledWith(modelSettings);
  });
});

describe('private updateModelAndPanel', () => {
  it('should call this.model.updateSettings(settings) method', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(modelSettings);
    const view = new View('#range-slider', modelSettings, viewSettings);
    const presenter = new Presenter(model, view);

    const modelUpdateSettings = jest.spyOn(presenter['model'], 'updateSettings');
    presenter['updateModelAndPanel'](modelSettings);

    expect(modelUpdateSettings).toBeCalled();
    expect(modelUpdateSettings).toBeCalledWith(modelSettings);
  });
});

describe('private updateModelAndView', () => {
  it('should call this.model.updateSettings(settings)', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(modelSettings);
    const view = new View('#range-slider', modelSettings, viewSettings);
    const presenter = new Presenter(model, view);

    const updateSettings = jest.spyOn(presenter['model'], 'updateSettings');
    presenter['updateModelAndView'](modelSettings);

    expect(updateSettings).toBeCalled();
    expect(updateSettings).toBeCalledWith(modelSettings);
  });

  it('should call this.view.destroyView()', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(modelSettings);
    const view = new View('#range-slider', modelSettings, viewSettings);
    const presenter = new Presenter(model, view);

    const destroyView = jest.spyOn(presenter['view'], 'destroyView');
    presenter['updateModelAndView'](modelSettings);

    expect(destroyView).toBeCalled();
  });

  it('should call this.view.createRangeSlider(this.model.getSettings()', () => {
    document.body.innerHTML = '<div id="range-slider"></div>';

    const model = new Model(modelSettings);
    const view = new View('#range-slider', modelSettings, viewSettings);
    const presenter = new Presenter(model, view);

    const createRangeSlider = jest.spyOn(presenter['view'], 'createRangeSlider');
    presenter['updateModelAndView'](modelSettings);

    expect(createRangeSlider).toBeCalled();
    expect(createRangeSlider).toBeCalledWith(presenter['model'].getSettings());
  });
});
