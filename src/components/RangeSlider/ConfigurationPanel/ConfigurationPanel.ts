import {
  createElement,
  getDigitsAfterPoint,
  getMinStep,
} from '../lib/common';

import Observer from '../Observer/Observer';

import {
  AbstractConfigurationPanel,
  AbstractObserver,
  CPInputElement,
  ISettings,
} from '../RangeSlider/types';

class ConfigurationPanel extends AbstractConfigurationPanel {
  private settings: ISettings;

  element: HTMLElement;

  private cpMin: HTMLInputElement;

  private cpMax: HTMLInputElement;

  private cpStep: HTMLInputElement;

  private cpFrom: HTMLInputElement;

  private cpTo: HTMLInputElement;

  private cpVertical: HTMLInputElement;

  private cpRange: HTMLInputElement;

  private cpScale: HTMLInputElement;

  private cpBar: HTMLInputElement;

  private cpTooltips: HTMLInputElement;

  private roundTo: number;

  changeConfPanelSettingsObserver: AbstractObserver;

  getStepInPercentsObserver: AbstractObserver;

  constructor(settings: ISettings) {
    super();
    this.settings = settings;
    this.element = ConfigurationPanel.createElement();
    this.roundTo = getDigitsAfterPoint(this.settings);

    this.cpMin = this.assignElements('cpMin');
    this.cpMin.step = String(getMinStep(settings).toFixed(this.roundTo));
    this.cpMax = this.assignElements('cpMax');
    this.cpMax.step = String(getMinStep(settings).toFixed(this.roundTo));
    this.cpStep = this.assignElements('cpStep');
    this.cpStep.min = String(getMinStep(settings).toFixed(this.roundTo));
    this.cpStep.step = String(getMinStep(settings).toFixed(this.roundTo));
    this.cpFrom = this.assignElements('cpFrom');
    this.cpTo = this.assignElements('cpTo');

    this.cpVertical = this.assignElements('cpVertical');
    this.cpRange = this.assignElements('cpRange');
    this.cpScale = this.assignElements('cpScale');
    this.cpBar = this.assignElements('cpBar');
    this.cpTooltips = this.assignElements('cpTooltips');

    this.updateState(this.settings);

    this.addListeners();
    this.getThumbFromDisabledStatus();

    this.changeConfPanelSettingsObserver = new Observer();
    this.getStepInPercentsObserver = new Observer();
  }

  public updateState(settings: ISettings): ConfigurationPanel {
    const from = settings.from.toFixed(this.roundTo);
    const to = settings.to.toFixed(this.roundTo);

    this.cpMin.value = String(settings.min.toFixed(this.roundTo));
    this.cpMin.max = String(from);
    this.cpMin.step = String(getMinStep(settings).toFixed(this.roundTo));

    this.cpMax.value = String(settings.max.toFixed(this.roundTo));
    this.cpMax.min = String(to);
    this.cpMax.step = String(getMinStep(settings).toFixed(this.roundTo));

    this.cpStep.value = String(settings.step.toFixed(this.roundTo));

    this.cpFrom.value = String(from);
    this.cpFrom.min = String(settings.min.toFixed(this.roundTo));
    this.cpFrom.step = String(settings.step.toFixed(this.roundTo));
    this.cpFrom.max = String(to);

    this.cpTo.value = String(to);
    this.cpTo.min = String(from);
    this.cpTo.step = String(settings.step.toFixed(this.roundTo));
    this.cpTo.max = String(settings.max.toFixed(this.roundTo));

    this.cpVertical.checked = settings.vertical;
    this.cpRange.checked = settings.range;
    this.cpScale.checked = settings.scale;
    this.cpBar.checked = settings.bar;
    this.cpTooltips.checked = settings.tooltips;

    return this;
  }

  private static createElement(): HTMLElement {
    const element = createElement('div', 'configuration-panel');

    element.innerHTML = `
    <span class="configuration-panel__caption">Configuration Panel</span>

    <div class="configuration-panel__options">
      <form>
        <div class="configuration-panel__options-inputs">
          <div class="configuration-panel__options-input">
            <label for="min" class="configuration-panel__options-input-text">min</label>
            <input class="configuration-panel__options-input-value" type="number" name="min" max="0">
          </div>
          <div class="configuration-panel__options-input">
            <label for="max" class="configuration-panel__options-input-text">max</label>
            <input class="configuration-panel__options-input-value" type="number" name="max" min="0">
          </div>
          <div class="configuration-panel__options-input">
            <label for="step" class="configuration-panel__options-input-text">step</label>
            <input class="configuration-panel__options-input-value" type="number" name="step" min="1" step="1">
          </div>
          <div class="configuration-panel__options-input">
            <label for="from" class="configuration-panel__options-input-text">from</label>
            <input class="configuration-panel__options-input-value" type="number" name="from" min="0" max="0" step="0">
          </div>
          <div class="configuration-panel__options-input">
            <label for="to" class="configuration-panel__options-input-text">to</label>
            <input class="configuration-panel__options-input-value" type="number" name="to" max="0" step="0">
          </div>
        </div>

        <div class="configuration-panel__options-checkboxes">
          <div class="configuration-panel__options-checkbox">
            <label class="configuration-panel__options-checkbox-label">
              <input class="configuration-panel__options-checkbox-input" type="checkbox" name="vertical">
              vertical
            </label>
          </div>
          <div class="configuration-panel__options-checkbox">
            <label class="configuration-panel__options-checkbox-label">
              <input class="configuration-panel__options-checkbox-input" type="checkbox" name="range">
              range
            </label>
          </div>
          <div class="configuration-panel__options-checkbox">
            <label class="configuration-panel__options-checkbox-label">
              <input class="configuration-panel__options-checkbox-input" type="checkbox" name="scale">
              scale
            </label>
          </div>
          <div class="configuration-panel__options-checkbox">
            <label class="configuration-panel__options-checkbox-label">
              <input class="configuration-panel__options-checkbox-input" type="checkbox" name="bar">
              bar
            </label>
          </div>
          <div class="configuration-panel__options-checkbox">
            <label class="configuration-panel__options-checkbox-label">
              <input class="configuration-panel__options-checkbox-input" type="checkbox" name="tooltips">
              tooltips
            </label>
          </div>
        </div>
      </form>
    </div>
    `;

    return element;
  }

  private assignElements(inputElement: CPInputElement): HTMLInputElement {
    switch (inputElement) {
      case 'cpMin':
        return <HTMLInputElement> this.element.querySelector('input[name="min"]');
      case 'cpMax':
        return <HTMLInputElement> this.element.querySelector('input[name="max"]');
      case 'cpStep':
        return <HTMLInputElement> this.element.querySelector('input[name="step"]');
      case 'cpFrom':
        return <HTMLInputElement> this.element.querySelector('input[name="from"]');
      case 'cpTo':
        return <HTMLInputElement> this.element.querySelector('input[name="to"]');
      case 'cpVertical':
        return <HTMLInputElement> this.element.querySelector('input[name="vertical"]');
      case 'cpRange':
        return <HTMLInputElement> this.element.querySelector('input[name="range"]');
      case 'cpScale':
        return <HTMLInputElement> this.element.querySelector('input[name="scale"]');
      case 'cpBar':
        return <HTMLInputElement> this.element.querySelector('input[name="bar"]');
      case 'cpTooltips':
        return <HTMLInputElement> this.element.querySelector('input[name="tooltips"]');
      default:
        return <HTMLInputElement> this.element.querySelector('input[name="min"]');
    }
  }

  // Configuration panel input handlers
  private handleInputCPMinChange = () => {
    this.settings.min = Number(this.cpMin?.value) >= Number(this.cpMin.max)
      ? Number(this.cpMin.max)
      : Number(this.cpMin?.value);

    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.getStepInPercentsObserver.notifyObservers(this.settings);
    this.cpMin?.focus();
  };

  private handleInputCPMaxChange = () => {
    this.settings.max = Number(this.cpMax?.value) <= Number(this.cpMax.min)
      ? Number(this.cpMax.min)
      : Number(this.cpMax?.value);

    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.getStepInPercentsObserver.notifyObservers(this.settings);
    this.cpMax?.focus();
  };

  private handleInputCPStepChange = () => {
    this.settings.step = Number(this.cpStep?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.getStepInPercentsObserver.notifyObservers(this.settings);
    this.cpStep?.focus();
  };

  private handleInputCPFromChange = () => {
    this.settings.from = Number(this.cpFrom?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpFrom?.focus();
  };

  private handleInputCPToChange = () => {
    this.settings.to = Number(this.cpTo?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpTo?.focus();
  };
  // Configuration panel input handlers end

  // Configuration panel checkbox handlers
  private handleCheckboxCPVerticalChange = () => {
    this.settings.vertical = <boolean> this.cpVertical?.checked;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpVertical?.focus();
  };

  private handleCheckboxCPRangeChange = () => {
    this.settings.range = <boolean> this.cpRange?.checked;
    this.getThumbFromDisabledStatus();
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpRange?.focus();
  };

  private handleCheckboxCPScaleChange = () => {
    this.settings.scale = <boolean> this.cpScale?.checked;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpScale?.focus();
  };

  private handleCheckboxCPBarChange = () => {
    this.settings.bar = <boolean> this.cpBar?.checked;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpBar?.focus();
  };

  private handleCheckboxCPTipChange = () => {
    this.settings.tooltips = <boolean> this.cpTooltips?.checked;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpTooltips?.focus();
  };
  // Configuration panel checkbox handlers end

  private addListeners(): ConfigurationPanel {
    this.cpMin?.addEventListener('change', this.handleInputCPMinChange);
    this.cpMax?.addEventListener('change', this.handleInputCPMaxChange);
    this.cpStep?.addEventListener('change', this.handleInputCPStepChange);
    this.cpFrom?.addEventListener('change', this.handleInputCPFromChange);
    this.cpTo?.addEventListener('change', this.handleInputCPToChange);

    this.cpVertical?.addEventListener('change', this.handleCheckboxCPVerticalChange);
    this.cpRange?.addEventListener('change', this.handleCheckboxCPRangeChange);
    this.cpScale?.addEventListener('change', this.handleCheckboxCPScaleChange);
    this.cpBar?.addEventListener('change', this.handleCheckboxCPBarChange);
    this.cpTooltips?.addEventListener('change', this.handleCheckboxCPTipChange);

    return this;
  }

  private getThumbFromDisabledStatus(): boolean {
    if (this.cpRange?.checked) {
      this.cpFrom.disabled = false;
      return false;
    }

    this.cpFrom.disabled = true;
    return true;
  }
}

export default ConfigurationPanel;
