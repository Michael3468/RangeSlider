/**
 * @jest-environment jsdom
 */

import ConfigurationPanel from './ConfigurationPanel';

import { ISettings } from '../RangeSlider/types';

let settings: ISettings;

beforeEach(() => {
  settings = {
    min: 0,
    max: 1500,
    step: 10,
    from: 1000,
    to: 1490,
    vertical: true,
    range: true,
    scale: true,
    bar: true,
    tooltips: true,
    confpanel: true,
  };
});

describe('private addListeners', () => {
  it('should change values and add listeners', () => {
    const confPanel = new ConfigurationPanel(settings);
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
      result['cpMin'].dispatchEvent(new Event('change'));
      expect(String(result['settings'].min)).toBe(result['cpMin'].value);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpMin listener end

    // cpMax listener
    if (result['cpMax']) {
      result['cpMax'].dispatchEvent(new Event('change'));

      if (result['cpMax'].value <= result['cpMax'].min) {
        expect(String(result['settings'].max)).toBe(result['cpMax'].min);
      } else {
        expect(String(result['settings'].max)).toBe(result['cpMax'].value);
      }
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpMax listener end

    // cpStep listener
    if (result['cpStep']) {
      result['cpStep'].dispatchEvent(new Event('change'));
      expect(String(result['settings'].step)).toBe(result['cpStep'].value);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpStep listener end

    // cpFrom listener
    if (result['cpFrom']) {
      result['cpFrom'].dispatchEvent(new Event('change'));
      expect(String(result['settings'].from)).toBe(result['cpFrom'].value);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpFrom listener end

    // cpTo listener
    if (result['cpTo']) {
      result['cpTo'].dispatchEvent(new Event('change'));
      expect(String(result['settings'].to)).toBe(result['cpTo'].value);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpTo listener end

    /* checkbox inputs */
    // cpVertical listener
    if (result['cpVertical']) {
      result['cpVertical'].dispatchEvent(new Event('change'));
      expect(result['settings'].vertical).toBe(result['cpVertical'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpVertical listener end

    // cpRange listener
    if (result['cpRange']) {
      result['cpRange'].dispatchEvent(new Event('change'));
      expect(result['settings'].range).toBe(result['cpRange'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpRange listener end

    // cpScale listener
    if (result['cpScale']) {
      result['cpScale'].dispatchEvent(new Event('change'));
      expect(result['settings'].scale).toBe(result['cpScale'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpScale listener end

    // cpBar listener
    if (result['cpBar']) {
      result['cpBar'].dispatchEvent(new Event('change'));
      expect(result['settings'].bar).toBe(result['cpBar'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpBar listener end

    // cpTooltips listener
    if (result['cpTooltips']) {
      result['cpTooltips'].dispatchEvent(new Event('change'));
      expect(result['settings'].tooltips).toBe(result['cpTooltips'].checked);
    }
    expect(nObsSpy).toBeCalledWith(settings);
    // cpTooltips listener end
  });
});

describe('private getThumbFromDisabledStatus', () => {
  it('should return false if cpRange.checked === true', () => {
    settings.range = true;
    const confPanel = new ConfigurationPanel(settings);
    const result = confPanel['getThumbFromDisabledStatus']();
    expect(result).toBeFalsy();
  });

  it('should return true if cpRange.checked === false', () => {
    settings.range = false;
    const confPanel = new ConfigurationPanel(settings);
    const result = confPanel['getThumbFromDisabledStatus']();
    expect(result).toBeTruthy();
  });
});

describe('public updateState', () => {
  beforeEach(() => {
    settings = {
      min: 0,
      max: 1,
      step: 0.001,
      from: 0.001,
      to: 0.003,
      vertical: false,
      range: true,
      scale: true,
      bar: true,
      tooltips: true,
      confpanel: true,
    };
  });

  test('', () => {
    const confPanel = new ConfigurationPanel(settings);

    const updatedSettings: ISettings = {
      min: 0.001,
      max: 0.009,
      step: 0.002,
      from: 0.003,
      to: 0.005,
      vertical: true,
      range: false,
      scale: false,
      bar: false,
      tooltips: false,
      confpanel: false,
    };

    const result = confPanel['updateState'](updatedSettings);

    expect(result['cpMin'].value).toBe(String(updatedSettings.min));
    expect(result['cpMin'].max).toBe(String(updatedSettings.from));

    expect(result['cpMax'].value).toBe(String(updatedSettings.max));
    expect(result['cpMax'].min).toBe(String(updatedSettings.to));

    expect(result['cpStep'].value).toBe(String(updatedSettings.step));

    expect(result['cpFrom'].value).toBe(String(updatedSettings.from));
    expect(result['cpFrom'].min).toBe(String(updatedSettings.min));
    expect(result['cpFrom'].step).toBe(String(updatedSettings.step));
    expect(result['cpFrom'].max).toBe(String(updatedSettings.to));

    expect(result['cpTo'].value).toBe(String(updatedSettings.to));
    expect(result['cpTo'].min).toBe(String(updatedSettings.from));
    expect(result['cpTo'].step).toBe(String(updatedSettings.step));
    expect(result['cpTo'].max).toBe(String(updatedSettings.max));

    expect(result['cpVertical'].checked).toBe(updatedSettings.vertical);
    expect(result['cpRange'].checked).toBe(updatedSettings.range);
    expect(result['cpScale'].checked).toBe(updatedSettings.scale);
    expect(result['cpBar'].checked).toBe(updatedSettings.bar);
    expect(result['cpTooltips'].checked).toBe(updatedSettings.tooltips);
  });
});
