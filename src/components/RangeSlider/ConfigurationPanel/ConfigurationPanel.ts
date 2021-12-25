/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable lines-between-class-members */
import {
  AbstractConfigurationPanel,
  AbstractObserver,
  CPInputElement,
  ISettings,
} from '../RangeSlider/types';
import Observer from '../Observer/Observer';
import { createElement, getDigitsAfterPoint } from '../lib/common';

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
  private cpTips: HTMLInputElement;

  changeConfPanelSettingsObserver: AbstractObserver;

  constructor(settings: ISettings) {
    super();
    this.settings = settings;
    this.element = ConfigurationPanel.createElement();

    this.cpMin = this.assignElements('cpMin');
    this.cpMax = this.assignElements('cpMax');
    this.cpStep = this.assignElements('cpStep');
    this.cpFrom = this.assignElements('cpFrom');
    this.cpTo = this.assignElements('cpTo');

    this.cpVertical = this.assignElements('cpVertical');
    this.cpRange = this.assignElements('cpRange');
    this.cpScale = this.assignElements('cpScale');
    this.cpBar = this.assignElements('cpBar');
    this.cpTips = this.assignElements('cpTips');

    this.updateState(this.settings);

    this.addListeners();
    this.getThumbFromDisabledStatus();

    this.changeConfPanelSettingsObserver = new Observer();
  }

  public updateState(settings: ISettings): ConfigurationPanel {
    const valueFrom = settings.valueFrom.toFixed(getDigitsAfterPoint(settings));
    const valueTo = settings.valueTo.toFixed(getDigitsAfterPoint(settings));

    this.cpMin.value = String(settings.min);
    this.cpMin.max = String(valueFrom);

    this.cpMax.value = String(settings.max);
    this.cpMax.min = String(valueTo);

    this.cpStep.value = String(settings.step);

    this.cpFrom.value = String(valueFrom);
    this.cpFrom.min = String(settings.min);
    this.cpFrom.step = String(settings.step);
    this.cpFrom.max = String(valueTo);

    this.cpTo.value = String(valueTo);
    this.cpTo.min = String(valueFrom);
    this.cpTo.step = String(settings.step);
    this.cpTo.max = String(settings.max);

    this.cpVertical.checked = settings.isVertical;
    this.cpRange.checked = settings.isTwoRunners;
    this.cpScale.checked = settings.isScaleVisible;
    this.cpBar.checked = settings.isBarVisible;
    this.cpTips.checked = settings.isTooltipsVisible;

    return this;
  }

  private static createElement(): HTMLElement {
    const element = createElement('div', 'range-slider__configuration-panel');

    element.innerHTML = `
    <span class="range-slider__configuration-panel__caption">Configuration Panel</span>

    <div class="range-slider__configuration-panel__options">
      <form>
        <div class="range-slider__configuration-panel__options_inputs_block">
          <div class="range-slider__configuration-panel__options_input">
            <label for="min" class="range-slider__configuration-panel__options_input-text">min</label>
            <input class="range-slider__configuration-panel__options_input-value" type="number" name="min" max="0">
          </div>
          <div class="range-slider__configuration-panel__options_input">
            <label for="max" class="range-slider__configuration-panel__options_input-text">max</label>
            <input class="range-slider__configuration-panel__options_input-value" type="number" name="max" min="0">
          </div>
          <div class="range-slider__configuration-panel__options_input">
            <label for="step" class="range-slider__configuration-panel__options_input-text">step</label>
            <input class="range-slider__configuration-panel__options_input-value" type="number" name="step" min="1">
          </div>
          <div class="range-slider__configuration-panel__options_input">
            <label for="from" class="range-slider__configuration-panel__options_input-text">from</label>
            <input class="range-slider__configuration-panel__options_input-value" type="number" name="from" min="0" max="0" step="0">
          </div>
          <div class="range-slider__configuration-panel__options_input">
            <label for="to" class="range-slider__configuration-panel__options_input-text">to</label>
            <input class="range-slider__configuration-panel__options_input-value" type="number" name="to" max="0" step="0">
          </div>
        </div>

        <div class="range-slider__configuration-panel__options_checkbox_block">
          <div class="range-slider__configuration-panel__options_checkbox">
            <label class="range-slider__configuration-panel__options_checkbox_label">
              <input class="range-slider__configuration-panel__options_checkbox_input" type="checkbox" name="vertical">
              vertical
            </label>
          </div>
          <div class="range-slider__configuration-panel__options_checkbox">
            <label class="range-slider__configuration-panel__options_checkbox_label">
              <input class="range-slider__configuration-panel__options_checkbox_input" type="checkbox" name="range">
              range
            </label>
          </div>
          <div class="range-slider__configuration-panel__options_checkbox">
            <label class="range-slider__configuration-panel__options_checkbox_label">
              <input class="range-slider__configuration-panel__options_checkbox_input" type="checkbox" name="scale">
              scale
            </label>
          </div>
          <div class="range-slider__configuration-panel__options_checkbox">
            <label class="range-slider__configuration-panel__options_checkbox_label">
              <input class="range-slider__configuration-panel__options_checkbox_input" type="checkbox" name="bar">
              bar
            </label>
          </div>
          <div class="range-slider__configuration-panel__options_checkbox">
            <label class="range-slider__configuration-panel__options_checkbox_label">
              <input class="range-slider__configuration-panel__options_checkbox_input" type="checkbox" name="tip">
              tip
            </label>
          </div>
        </div>
      </form>
    </div>
    `;

    return element;
  }

  // eslint-disable-next-line consistent-return
  private assignElements(inputElement: CPInputElement): HTMLInputElement {
    // eslint-disable-next-line default-case
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
      case 'cpTips':
        return <HTMLInputElement> this.element.querySelector('input[name="tip"]');
    }
  }

  // Configuration panel input handlers
  private handleInputCPMinChange = () => {
    this.settings.min = Number(this.cpMin?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpMin?.focus();
  }

  private handleInputCPMaxChange = () => {
    this.settings.max = Number(this.cpMax?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpMax?.focus();
  }

  private handleInputCPStepChange = () => {
    this.settings.step = Number(this.cpStep?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpStep?.focus();
  }

  private handleInputCPFromChange = () => {
    this.settings.valueFrom = Number(this.cpFrom?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpFrom?.focus();
  }

  private handleInputCPToChange = () => {
    this.settings.valueTo = Number(this.cpTo?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpTo?.focus();
  }
  // Configuration panel input handlers end

  // Configuration panel checkbox handlers
  private handleCheckboxCPVerticalChange = () => {
    this.settings.isVertical = <boolean> this.cpVertical?.checked;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpVertical?.focus();
  }

  private handleCheckboxCPRangeChange = () => {
    this.settings.isTwoRunners = <boolean> this.cpRange?.checked;
    this.getThumbFromDisabledStatus();
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpRange?.focus();
  }

  private handleCheckboxCPScaleChange = () => {
    this.settings.isScaleVisible = <boolean> this.cpScale?.checked;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpScale?.focus();
  }

  private handleCheckboxCPBarChange = () => {
    this.settings.isBarVisible = <boolean> this.cpBar?.checked;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpBar?.focus();
  }

  private handleCheckboxCPTipChange = () => {
    this.settings.isTooltipsVisible = <boolean> this.cpTips?.checked;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpTips?.focus();
  }
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
    this.cpTips?.addEventListener('change', this.handleCheckboxCPTipChange);

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
