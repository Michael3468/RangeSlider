/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable lines-between-class-members */
import { ISettings } from '../RangeSlider/types';
import Observer from '../Observer/Observer';
import { createElement } from '../lib/common';

export default class ConfigurationPanel extends Observer {
  settings: ISettings;
  element: HTMLElement;

  cpMin: HTMLInputElement | undefined;
  cpMax: HTMLInputElement | undefined;
  cpStep: HTMLInputElement | undefined;
  cpFrom: HTMLInputElement | undefined;
  cpTo: HTMLInputElement | undefined;

  cpVertical: HTMLInputElement | undefined;
  cpRange: HTMLInputElement | undefined;
  cpScale: HTMLInputElement | undefined;
  cpBar: HTMLInputElement | undefined;
  cpTips: HTMLInputElement | undefined;

  changeConfPanelSettingsObserver: Observer;

  constructor(settings: ISettings) {
    super();

    this.settings = settings;
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

  private static createElement(): HTMLElement {
    const element = createElement('div', 'settings-panel');

    element.innerHTML = `
    <span class="settings-panel__caption">Configuration Panel</span>

    <div class="settings-panel__options">
      <form>
        <div class="settings-panel__options_inputs-block">
          <div class="settings-panel__options_input">
            <label for="min" class="settings-panel__options_input-text">min</label>
            <input class="settings-panel__options_input-value" type="number" name="min" max="0">
          </div>
          <div class="settings-panel__options_input">
            <label for="max" class="settings-panel__options_input-text">max</label>
            <input class="settings-panel__options_input-value" type="number" name="max" min="0">
          </div>
          <div class="settings-panel__options_input">
            <label for="step" class="settings-panel__options_input-text">step</label>
            <input class="settings-panel__options_input-value" type="number" name="step" min="1">
          </div>
          <div class="settings-panel__options_input">
            <label for="from" class="settings-panel__options_input-text">from</label>
            <input class="settings-panel__options_input-value" type="number" name="from" min="0" max="0" step="0">
          </div>
          <div class="settings-panel__options_input">
            <label for="to" class="settings-panel__options_input-text">to</label>
            <input class="settings-panel__options_input-value" type="number" name="to" max="0" step="0">
          </div>
        </div>

        <div class="settings-panel__options_toggles-block">
          <div class="settings-panel__options_toggle">
            <label class="settings-panel__options-toggle-label">
              <input class="settings-panel__options-toggle-input" type="checkbox" name="vertical">
              vertical
            </label>
          </div>
          <div class="settings-panel__options_toggle">
            <label class="settings-panel__options-toggle-label">
              <input class="settings-panel__options-toggle-input" type="checkbox" name="range">
              range
            </label>
          </div>
          <div class="settings-panel__options_toggle">
            <label class="settings-panel__options-toggle-label">
              <input class="settings-panel__options-toggle-input" type="checkbox" name="scale">
              scale
            </label>
          </div>
          <div class="settings-panel__options_toggle">
            <label class="settings-panel__options-toggle-label">
              <input class="settings-panel__options-toggle-input" type="checkbox" name="bar">
              bar
            </label>
          </div>
          <div class="settings-panel__options_toggle">
            <label class="settings-panel__options-toggle-label">
              <input class="settings-panel__options-toggle-input" type="checkbox" name="tip">
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
    this.cpMin = this.element.querySelector('input[name="min"]') as HTMLInputElement;
    this.cpMax = this.element.querySelector('input[name="max"]') as HTMLInputElement;
    this.cpStep = this.element.querySelector('input[name="step"]') as HTMLInputElement;
    this.cpFrom = this.element.querySelector('input[name="from"]') as HTMLInputElement;
    this.cpTo = this.element.querySelector('input[name="to"]') as HTMLInputElement;

    this.cpVertical = this.element.querySelector('input[name="vertical"]') as HTMLInputElement;
    this.cpRange = this.element.querySelector('input[name="range"]') as HTMLInputElement;
    this.cpScale = this.element.querySelector('input[name="scale"]') as HTMLInputElement;
    this.cpBar = this.element.querySelector('input[name="bar"]') as HTMLInputElement;
    this.cpTips = this.element.querySelector('input[name="tip"]') as HTMLInputElement;
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
    this.settings.isVertical = this.cpVertical?.checked as boolean;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpVertical?.focus();
  }

  private handleCheckboxCPRangeChange = () => {
    this.settings.isTwoRunners = this.cpRange?.checked as boolean;
    this.getThumbFromDisabledStatus();
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpRange?.focus();
  }

  private handleCheckboxCPScaleChange = () => {
    this.settings.isScaleVisible = this.cpScale?.checked as boolean;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpScale?.focus();
  }

  private handleCheckboxCPBarChange = () => {
    this.settings.isBarVisible = this.cpBar?.checked as boolean;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
    this.cpBar?.focus();
  }

  private handleCheckboxCPTipChange = () => {
    this.settings.isTooltipsVisible = this.cpTips?.checked as boolean;
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

  public updateState(settings: ISettings): void {
    this.cpMin!.value = String(settings.min);
    this.cpMin!.max = String(Math.round(settings.valueFrom));

    this.cpMax!.value = String(settings.max);
    this.cpMax!.min = String(Math.round(settings.valueTo));

    this.cpStep!.value = String(settings.step);

    this.cpFrom!.value = String(settings.valueFrom.toFixed(0));
    this.cpFrom!.min = String(settings.min);
    this.cpFrom!.step = String(settings.step);
    this.cpFrom!.max = String(settings.valueTo.toFixed(0));

    this.cpTo!.value = String(settings.valueTo.toFixed(0));
    this.cpTo!.min = String(settings.valueFrom.toFixed(0));
    this.cpTo!.step = String(settings.step);
    this.cpTo!.max = String(settings.max);

    this.cpVertical!.checked = settings.isVertical;
    this.cpRange!.checked = settings.isTwoRunners;
    this.cpScale!.checked = settings.isScaleVisible;
    this.cpBar!.checked = settings.isBarVisible;
    this.cpTips!.checked = settings.isTooltipsVisible;
  }

  private getThumbFromDisabledStatus = (): boolean => {
    if (this.cpRange?.checked) {
      this.cpFrom!.disabled = false;
      return false;
    }
    this.cpFrom!.disabled = true;
    return true;
  }
}
