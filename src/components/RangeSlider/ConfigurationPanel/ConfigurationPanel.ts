/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import { ISettings } from '../RangeSlider/types';
import { createElement } from '../lib/common';
import Observer from '../Observer/Observer';

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
    this.element = this.createElement();

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
    this.thumbFromDisabledStatus();

    this.changeConfPanelSettingsObserver = new Observer();
  }

  private createElement(): HTMLElement {
    const element = createElement('div', 'settings-panel');

    element.innerHTML = `
    <span class="settings-panel__caption">Configuration Panel</span>

    <div class="settings-panel__options">

      <div class="settings-panel__options_inputs-block">
        <div class="settings-panel__options_input">
          <div class="settings-panel__options_input-text">min</div>
          <div class="settings-panel__options_input-value">
            <input type="number" name="min" max="0">
          </div>
        </div>
        <div class="settings-panel__options_input">
          <div class="settings-panel__options_input-text">max</div>
          <div class="settings-panel__options_input-value">
            <input type="number" name="max" min="0">
          </div>
        </div>
        <div class="settings-panel__options_input">
          <div class="settings-panel__options_input-text">step</div>
          <div class="settings-panel__options_input-value">
            <input type="number" name="step" min="1">
          </div>
        </div>
        <div class="settings-panel__options_input">
          <div class="settings-panel__options_input-text">from</div>
          <div class="settings-panel__options_input-value">
            <input type="number" name="from" min="0" max="0" step="0">
          </div>
        </div>
        <div class="settings-panel__options_input">
          <div class="settings-panel__options_input-text">to</div>
          <div class="settings-panel__options_input-value">
            <input type="number" name="to" max="0" step="0">
          </div>
        </div>
      </div>
      
      <div class="settings-panel__options_toggles-block">
        <div class="settings-panel__options_toggle">
          <input type="checkbox" name="vertical">
          <label for="vertical">vertical</label>
        </div>
        <div class="settings-panel__options_toggle">
          <input type="checkbox" name="range">
          <label for="range">range</label>
        </div>
        <div class="settings-panel__options_toggle">
          <input type="checkbox" name="scale">
          <label for="scale">scale</label>
        </div>
        <div class="settings-panel__options_toggle">
          <input type="checkbox" name="bar">
          <label for="bar">bar</label>
        </div>
        <div class="settings-panel__options_toggle">
          <input type="checkbox" name="tip">
          <label for="tip">tip</label>
        </div>
      </div>

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
  private handleInputCPMinClick = () => {
    this.settings.min = Number(this.cpMin?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  };

  private handleInputCPMaxClick = () => {
    this.settings.max = Number(this.cpMax?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  };

  private handleInputCPStepClick = () => {
    this.settings.step = Number(this.cpStep?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  };

  private handleInputCPFromClick = () => {
    this.settings.valueFrom = Number(this.cpFrom?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  };

  private handleInputCPToClick = () => {
    this.settings.valueTo = Number(this.cpTo?.value);
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  };
  // Configuration panel input handlers end

  // Configuration panel checkbox handlers
  private handleCheckboxCPVerticalClick = () => {
    this.settings.isVertical = this.cpVertical?.checked as boolean;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  }

  private handleCheckboxCPRangeClick = () => {
    this.settings.isTwoRunners = this.cpRange?.checked as boolean;
    this.thumbFromDisabledStatus();
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  }

  private handleCheckboxCPScaleClick = () => {
    this.settings.isScaleVisible = this.cpScale?.checked as boolean;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  }

  private handleCheckboxCPBarClick = () => {
    this.settings.isBarVisible = this.cpBar?.checked as boolean;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  }

  private handleCheckboxCPTipClick = () => {
    this.settings.isTooltipsVisible = this.cpTips?.checked as boolean;
    this.changeConfPanelSettingsObserver.notifyObservers(this.settings);
  }
  // Configuration panel checkbox handlers end

  private addListeners(): ConfigurationPanel {
    this.cpMin?.addEventListener('click', this.handleInputCPMinClick);
    this.cpMax?.addEventListener('click', this.handleInputCPMaxClick);
    this.cpStep?.addEventListener('click', this.handleInputCPStepClick);
    this.cpFrom?.addEventListener('click', this.handleInputCPFromClick);
    this.cpTo?.addEventListener('click', this.handleInputCPToClick);

    this.cpVertical?.addEventListener('click', this.handleCheckboxCPVerticalClick);
    this.cpRange?.addEventListener('click', this.handleCheckboxCPRangeClick);
    this.cpScale?.addEventListener('click', this.handleCheckboxCPScaleClick);
    this.cpBar?.addEventListener('click', this.handleCheckboxCPBarClick);
    this.cpTips?.addEventListener('click', this.handleCheckboxCPTipClick);

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

  private thumbFromDisabledStatus = (): boolean => {
    if (this.cpRange?.checked) {
      this.cpFrom!.disabled = false;
      return false;
    }
    this.cpFrom!.disabled = true;
    return true;
  }
}
