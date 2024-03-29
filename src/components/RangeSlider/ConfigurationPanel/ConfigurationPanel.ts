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
  IModelSettings,
  IViewSettings,
} from '../RangeSlider/types';

class ConfigurationPanel extends AbstractConfigurationPanel {
  private modelSettings: IModelSettings;

  private viewSettings: IViewSettings;

  element: HTMLElement = ConfigurationPanel.createElement();

  private cpMin: HTMLInputElement = this.assignElements('cpMin');

  private cpMax: HTMLInputElement = this.assignElements('cpMax');

  private cpStep: HTMLInputElement = this.assignElements('cpStep');

  private cpFrom: HTMLInputElement = this.assignElements('cpFrom');

  private cpTo: HTMLInputElement = this.assignElements('cpTo');

  private cpVertical: HTMLInputElement = this.assignElements('cpVertical');

  private cpRange: HTMLInputElement = this.assignElements('cpRange');

  private cpScale: HTMLInputElement = this.assignElements('cpScale');

  private cpBar: HTMLInputElement = this.assignElements('cpBar');

  private cpTooltips: HTMLInputElement = this.assignElements('cpTooltips');

  private roundTo: number;

  changeConfPanelSettingsObserver: AbstractObserver = new Observer();

  changeConfPanelViewSettingsObserver: AbstractObserver = new Observer();

  getStepInPercentsObserver: AbstractObserver = new Observer();

  constructor(modelSettings: IModelSettings, viewSettings: IViewSettings) {
    super();
    this.modelSettings = modelSettings;
    this.viewSettings = viewSettings;
    this.roundTo = getDigitsAfterPoint(this.modelSettings);

    this.setValues();

    this.updateState(this.modelSettings, this.viewSettings);

    this.addListeners();
    this.getThumbFromDisabledStatus();
  }

  public updateState(
    modelSettings: IModelSettings,
    viewSettings: IViewSettings,
  ): ConfigurationPanel {
    const from = modelSettings.from.toFixed(this.roundTo);
    const to = modelSettings.to.toFixed(this.roundTo);

    this.cpMin.value = String(modelSettings.min.toFixed(this.roundTo));
    this.cpMin.max = String(from);
    this.cpMin.step = String(getMinStep(modelSettings).toFixed(this.roundTo));

    this.cpMax.value = String(modelSettings.max.toFixed(this.roundTo));
    this.cpMax.min = String(to);
    this.cpMax.step = String(getMinStep(modelSettings).toFixed(this.roundTo));

    this.cpStep.value = String(modelSettings.step.toFixed(this.roundTo));

    this.cpFrom.value = String(from);
    this.cpFrom.min = String(modelSettings.min.toFixed(this.roundTo));
    this.cpFrom.step = String(modelSettings.step.toFixed(this.roundTo));
    this.cpFrom.max = String(to);

    this.cpTo.value = String(to);
    this.cpTo.min = String(from);
    this.cpTo.step = String(modelSettings.step.toFixed(this.roundTo));
    this.cpTo.max = String(modelSettings.max.toFixed(this.roundTo));

    this.cpVertical.checked = viewSettings.vertical;
    this.cpRange.checked = viewSettings.range;
    this.cpScale.checked = viewSettings.scale;
    this.cpBar.checked = viewSettings.bar;
    this.cpTooltips.checked = viewSettings.tooltips;

    return this;
  }

  private setValues(): ConfigurationPanel {
    this.cpMin.step = String(getMinStep(this.modelSettings).toFixed(this.roundTo));
    this.cpMax.step = String(getMinStep(this.modelSettings).toFixed(this.roundTo));
    this.cpStep.min = String(getMinStep(this.modelSettings).toFixed(this.roundTo));
    this.cpStep.step = String(getMinStep(this.modelSettings).toFixed(this.roundTo));

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
    this.modelSettings.min = Number(this.cpMin?.value) >= Number(this.cpMin.max)
      ? Number(this.cpMin.max)
      : Number(this.cpMin?.value);

    this.changeConfPanelSettingsObserver.notifyObservers(this.modelSettings);
    this.getStepInPercentsObserver.notifyObservers(this.modelSettings);
    this.cpMin?.focus();
  };

  private handleInputCPMaxChange = () => {
    this.modelSettings.max = Number(this.cpMax?.value) <= Number(this.cpMax.min)
      ? Number(this.cpMax.min)
      : Number(this.cpMax?.value);

    this.changeConfPanelSettingsObserver.notifyObservers(this.modelSettings);
    this.getStepInPercentsObserver.notifyObservers(this.modelSettings);
    this.cpMax?.focus();
  };

  private handleInputCPStepChange = () => {
    this.modelSettings.step = Number(this.cpStep?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.modelSettings);
    this.getStepInPercentsObserver.notifyObservers(this.modelSettings);
    this.cpStep?.focus();
  };

  private handleInputCPFromChange = () => {
    this.modelSettings.from = Number(this.cpFrom?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.modelSettings);
    this.cpFrom?.focus();
  };

  private handleInputCPToChange = () => {
    this.modelSettings.to = Number(this.cpTo?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.modelSettings);
    this.cpTo?.focus();
  };
  // Configuration panel input handlers end

  // Configuration panel checkbox handlers
  private handleCheckboxCPVerticalChange = () => {
    this.viewSettings.vertical = this.cpVertical?.checked;
    this.changeConfPanelViewSettingsObserver.notifyObservers(this.viewSettings);
    this.cpVertical?.focus();
  };

  private handleCheckboxCPRangeChange = () => {
    this.viewSettings.range = this.cpRange?.checked;
    this.getThumbFromDisabledStatus();
    this.changeConfPanelViewSettingsObserver.notifyObservers(this.viewSettings);
    this.cpRange?.focus();
  };

  private handleCheckboxCPScaleChange = () => {
    this.viewSettings.scale = this.cpScale?.checked;
    this.changeConfPanelViewSettingsObserver.notifyObservers(this.viewSettings);
    this.cpScale?.focus();
  };

  private handleCheckboxCPBarChange = () => {
    this.viewSettings.bar = this.cpBar?.checked;
    this.changeConfPanelViewSettingsObserver.notifyObservers(this.viewSettings);
    this.cpBar?.focus();
  };

  private handleCheckboxCPTipChange = () => {
    this.viewSettings.tooltips = this.cpTooltips?.checked;
    this.changeConfPanelViewSettingsObserver.notifyObservers(this.viewSettings);
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
