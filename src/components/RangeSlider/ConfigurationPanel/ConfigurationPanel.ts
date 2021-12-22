/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable lines-between-class-members */
import { AbstractConfigurationPanel, AbstractObserver, ISettings } from '../RangeSlider/types';
import Observer from '../Observer/Observer';
import { createElement, getDigitsAfterPoint } from '../lib/common';

export default class ConfigurationPanel extends AbstractConfigurationPanel {
  private settings: ISettings;
  element: HTMLElement;

  private cpMin: HTMLInputElement | undefined;
  private cpMax: HTMLInputElement | undefined;
  private cpStep: HTMLInputElement | undefined;
  private cpFrom: HTMLInputElement | undefined;
  private cpTo: HTMLInputElement | undefined;

  private cpVertical: HTMLInputElement | undefined;
  private cpRange: HTMLInputElement | undefined;
  private cpScale: HTMLInputElement | undefined;
  private cpBar: HTMLInputElement | undefined;
  private cpTips: HTMLInputElement | undefined;

  changeConfPanelSettingsObserver: AbstractObserver;

  constructor(settings: ISettings) {
    super();
    this.settings = settings;
    // this.settings = {};
    // this.settings = { ...settings };
    this.element = ConfigurationPanel.createElement();

    this.cpMin = undefined;
    this.cpMax = undefined;
    this.cpStep = undefined;
    this.cpFrom = undefined;
    this.cpTo = undefined;

    this.cpVertical = undefined;
    this.cpRange = undefined;
    this.cpScale = undefined;
    this.cpBar = undefined;
    this.cpTips = undefined;
    this.assignElements();

    this.updateState(this.settings);

    this.addListeners();
    this.getThumbFromDisabledStatus();

    this.changeConfPanelSettingsObserver = new Observer();
  }

  public updateState(settings: ISettings): void {
    const valueFrom = settings.valueFrom.toFixed(getDigitsAfterPoint(settings));
    const valueTo = settings.valueTo.toFixed(getDigitsAfterPoint(settings));

    if (this.cpMin) {
      this.cpMin.value = String(settings.min);
      this.cpMin.max = String(valueFrom);
    }

    if (this.cpMax) {
      this.cpMax.value = String(settings.max);
      this.cpMax.min = String(valueTo);
    }

    if (this.cpStep) {
      this.cpStep.value = String(settings.step);
    }

    if (this.cpFrom) {
      this.cpFrom.value = String(valueFrom);
      this.cpFrom.min = String(settings.min);
      this.cpFrom.step = String(settings.step);
      this.cpFrom.max = String(valueTo);
    }

    if (this.cpTo) {
      this.cpTo.value = String(valueTo);
      this.cpTo.min = String(valueFrom);
      this.cpTo.step = String(settings.step);
      this.cpTo.max = String(settings.max);
    }

    if (this.cpVertical) {
      this.cpVertical.checked = settings.isVertical;
    }
    if (this.cpRange) {
      this.cpRange.checked = settings.isTwoRunners;
    }
    if (this.cpScale) {
      this.cpScale.checked = settings.isScaleVisible;
    }
    if (this.cpBar) {
      this.cpBar.checked = settings.isBarVisible;
    }
    if (this.cpTips) {
      this.cpTips.checked = settings.isTooltipsVisible;
    }
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

  private assignElements(): void {
    this.cpMin = <HTMLInputElement> this.element.querySelector('input[name="min"]');
    this.cpMax = <HTMLInputElement> this.element.querySelector('input[name="max"]');
    this.cpStep = <HTMLInputElement> this.element.querySelector('input[name="step"]');
    this.cpFrom = <HTMLInputElement> this.element.querySelector('input[name="from"]');
    this.cpTo = <HTMLInputElement> this.element.querySelector('input[name="to"]');

    this.cpVertical = <HTMLInputElement> this.element.querySelector('input[name="vertical"]');
    this.cpRange = <HTMLInputElement> this.element.querySelector('input[name="range"]');
    this.cpScale = <HTMLInputElement> this.element.querySelector('input[name="scale"]');
    this.cpBar = <HTMLInputElement> this.element.querySelector('input[name="bar"]');
    this.cpTips = <HTMLInputElement> this.element.querySelector('input[name="tip"]');
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

  private getThumbFromDisabledStatus = (): boolean => {
    if (this.cpRange?.checked) {
      if (this.cpFrom) {
        this.cpFrom.disabled = false;
      }
      return false;
    }
    if (this.cpFrom) {
      this.cpFrom.disabled = true;
    }
    return true;
  }
}
