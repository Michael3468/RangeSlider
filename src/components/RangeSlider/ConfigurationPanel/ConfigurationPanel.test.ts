/**
 * @jest-environment jsdom
 */

import ConfigurationPanel from './ConfigurationPanel';

import { IModelSettings, IViewSettings } from '../RangeSlider/types';

let modelSettings: IModelSettings;
let viewSettings: IViewSettings;

beforeEach(() => {
  modelSettings = {
    min: 0,
    max: 100,
    from: 30,
    to: 70,
    step: 1,

    stepInPercents: 1,
    currentPos: 0,
    posWithStepInPercents: 0,
    curPosInPoints: undefined,
  };

  viewSettings = {
    range: true,
    scale: false,
    tooltips: true,
    vertical: false,
    confpanel: false,
    bar: true,

    thumbMarginFrom: 0,
    thumbMarginTo: 0,
    rangeMarginFrom: 0,
    rangeMarginTo: 0,
  };
});

describe('private addListeners', () => {
  it('should change values and add listeners', () => {
    const confPanel = new ConfigurationPanel(modelSettings, viewSettings);
    const nObsSpy = jest
      .spyOn(confPanel.changeConfPanelSettingsObserver, 'notifyObservers');

    if (confPanel['cpMin']) {
      confPanel['cpMin'].value = String(100);
    }
    if (confPanel['cpMax']) {
      confPanel['cpMax'].value = String(100);
    }
    if (confPanel['cpStep']) {
      confPanel['cpStep'].value = String(100);
    }
    if (confPanel['cpFrom']) {
      confPanel['cpFrom'].value = String(100);
    }
    if (confPanel['cpTo']) {
      confPanel['cpTo'].value = String(100);
    }

    if (confPanel['cpVertical']) {
      confPanel['cpVertical'].checked = false;
    }
    if (confPanel['cpRange']) {
      confPanel['cpRange'].checked = false;
    }
    if (confPanel['cpScale']) {
      confPanel['cpScale'].checked = false;
    }
    if (confPanel['cpBar']) {
      confPanel['cpBar'].checked = false;
    }
    if (confPanel['cpTooltips']) {
      confPanel['cpTooltips'].checked = false;
    }

    const result = confPanel['addListeners']();
    /* number inputs */
    // cpMin listener
    if (result['cpMin']) {
      // 'min' could not be bigger than 'from'
      const from = 30;
      modelSettings.from = from;
      result['cpMin'].dispatchEvent(new Event('change'));
      expect(String(result['modelSettings'].min)).toBe(String(from));

      // modelSettings.min === cpMin.value if cpMin.value < modelSettings.from
      modelSettings.from = 50;
      const confPanel2 = new ConfigurationPanel(modelSettings, viewSettings);
      confPanel2['cpMin'].value = String(40);
      const result2 = confPanel2['addListeners']();
      result2['cpMin'].dispatchEvent(new Event('change'));

      expect(String(result2['modelSettings'].min)).toBe(result2['cpMin'].value);
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpMin listener end

    // cpMax listener
    if (result['cpMax']) {
      result['cpMax'].dispatchEvent(new Event('change'));

      if (Number(result['cpMax'].value) <= Number(result['cpMax'].min)) {
        expect(String(result['modelSettings'].max)).toBe(result['cpMax'].min);
      } else {
        expect(String(result['modelSettings'].max)).toBe(result['cpMax'].value);
      }
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpMax listener end

    // cpStep listener
    if (result['cpStep']) {
      result['cpStep'].dispatchEvent(new Event('change'));
      expect(String(result['modelSettings'].step)).toBe(result['cpStep'].value);
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpStep listener end

    // cpFrom listener
    if (result['cpFrom']) {
      result['cpFrom'].dispatchEvent(new Event('change'));
      expect(String(result['modelSettings'].from)).toBe(result['cpFrom'].value);
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpFrom listener end

    // cpTo listener
    if (result['cpTo']) {
      result['cpTo'].dispatchEvent(new Event('change'));
      expect(String(result['modelSettings'].to)).toBe(result['cpTo'].value);
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpTo listener end

    /* checkbox inputs */
    // cpVertical listener
    if (result['cpVertical']) {
      result['cpVertical'].dispatchEvent(new Event('change'));
      expect(result['viewSettings'].vertical).toBe(result['cpVertical'].checked);
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpVertical listener end

    // cpRange listener
    if (result['cpRange']) {
      result['cpRange'].dispatchEvent(new Event('change'));
      expect(result['viewSettings'].range).toBe(result['cpRange'].checked);
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpRange listener end

    // cpScale listener
    if (result['cpScale']) {
      result['cpScale'].dispatchEvent(new Event('change'));
      expect(result['viewSettings'].scale).toBe(result['cpScale'].checked);
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpScale listener end

    // cpBar listener
    if (result['cpBar']) {
      result['cpBar'].dispatchEvent(new Event('change'));
      expect(result['viewSettings'].bar).toBe(result['cpBar'].checked);
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpBar listener end

    // cpTooltips listener
    if (result['cpTooltips']) {
      result['cpTooltips'].dispatchEvent(new Event('change'));
      expect(result['viewSettings'].tooltips).toBe(result['cpTooltips'].checked);
    }
    expect(nObsSpy).toBeCalledWith(modelSettings);
    // cpTooltips listener end
  });
});

describe('private getThumbFromDisabledStatus', () => {
  it('should return false if cpRange.checked === true', () => {
    viewSettings.range = true;
    const confPanel = new ConfigurationPanel(modelSettings, viewSettings);
    const result = confPanel['getThumbFromDisabledStatus']();
    expect(result).toBeFalsy();
  });

  it('should return true if cpRange.checked === false', () => {
    viewSettings.range = false;
    const confPanel = new ConfigurationPanel(modelSettings, viewSettings);
    const result = confPanel['getThumbFromDisabledStatus']();
    expect(result).toBeTruthy();
  });
});

describe('public updateState', () => {
  beforeEach(() => {
    modelSettings = {
      min: 0,
      max: 1,
      step: 0.001,
      from: 0.001,
      to: 0.003,
      stepInPercents: 1,
      currentPos: 100,
      curPosInPoints: 1,
      posWithStepInPercents: 1,
    };

    viewSettings = {
      vertical: false,
      range: true,
      scale: true,
      bar: true,
      tooltips: true,
      confpanel: true,

      thumbMarginFrom: 1,
      thumbMarginTo: 2,
      rangeMarginFrom: 1,
      rangeMarginTo: 2,
    };
  });

  test('should update confPanel with new settings', () => {
    const confPanel = new ConfigurationPanel(modelSettings, viewSettings);

    const updatedModelSettings: IModelSettings = {
      min: 0.001,
      max: 0.009,
      step: 0.002,
      from: 0.003,
      to: 0.005,
      stepInPercents: 1,
      currentPos: 100,
      curPosInPoints: 1,
      posWithStepInPercents: 1,
    };

    const updatedViewSettings: IViewSettings = {
      vertical: true,
      range: false,
      scale: false,
      bar: false,
      tooltips: false,
      confpanel: false,

      thumbMarginFrom: 1,
      thumbMarginTo: 2,
      rangeMarginFrom: 1,
      rangeMarginTo: 2,
    };

    const result = confPanel['updateState'](updatedModelSettings, updatedViewSettings);

    expect(result['cpMin'].value).toBe(String(updatedModelSettings.min));
    expect(result['cpMin'].max).toBe(String(updatedModelSettings.from));

    expect(result['cpMax'].value).toBe(String(updatedModelSettings.max));
    expect(result['cpMax'].min).toBe(String(updatedModelSettings.to));

    expect(result['cpStep'].value).toBe(String(updatedModelSettings.step));

    expect(result['cpFrom'].value).toBe(String(updatedModelSettings.from));
    expect(result['cpFrom'].min).toBe(String(updatedModelSettings.min));
    expect(result['cpFrom'].step).toBe(String(updatedModelSettings.step));
    expect(result['cpFrom'].max).toBe(String(updatedModelSettings.to));

    expect(result['cpTo'].value).toBe(String(updatedModelSettings.to));
    expect(result['cpTo'].min).toBe(String(updatedModelSettings.from));
    expect(result['cpTo'].step).toBe(String(updatedModelSettings.step));
    expect(result['cpTo'].max).toBe(String(updatedModelSettings.max));

    expect(result['cpVertical'].checked).toBe(updatedViewSettings.vertical);
    expect(result['cpRange'].checked).toBe(updatedViewSettings.range);
    expect(result['cpScale'].checked).toBe(updatedViewSettings.scale);
    expect(result['cpBar'].checked).toBe(updatedViewSettings.bar);
    expect(result['cpTooltips'].checked).toBe(updatedViewSettings.tooltips);
  });
});
