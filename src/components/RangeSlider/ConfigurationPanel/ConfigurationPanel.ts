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
  cpTip: HTMLInputElement | undefined;

  changeConfPanelSettings: Observer;

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
    this.cpTip = undefined;
    this.assignElements();

    this.updateState(this.settings);

    this.addListeners();

    this.changeConfPanelSettings = new Observer();
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
            <input type="number" name="step" min="1" max="1">
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
    this.cpTip = this.element.querySelector('input[name="tip"]') as HTMLInputElement;
  }

  private addListeners(): void {
    this.cpMin?.addEventListener('change', () => {
      this.settings.min = Number(this.cpMin?.value);
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });
    this.cpMax?.addEventListener('change', () => {
      this.settings.max = Number(this.cpMax?.value);
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });
    this.cpStep?.addEventListener('change', () => {
      this.settings.step = Number(this.cpStep?.value);
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });
    this.cpFrom?.addEventListener('change', () => {
      this.settings.valueFrom = Number(this.cpFrom?.value);
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });
    this.cpTo?.addEventListener('change', () => {
      this.settings.valueTo = Number(this.cpTo?.value);
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });

    this.cpVertical?.addEventListener('change', () => {
      this.settings.isVertical = this.cpVertical?.checked as boolean; // true; // TODO
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });
    this.cpRange?.addEventListener('change', () => {
      this.settings.isTwoRunners = this.cpRange?.checked as boolean;
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });
    this.cpScale?.addEventListener('change', () => {
      this.settings.isScaleVisible = this.cpScale?.checked as boolean;
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });
    this.cpBar?.addEventListener('change', () => {
      this.settings.isBarVisible = this.cpBar?.checked as boolean;
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });
    this.cpTip?.addEventListener('change', () => {
      this.settings.isTooltipsVisible = this.cpTip?.checked as boolean;
      this.changeConfPanelSettings.notifyObservers(this.settings);
    });
  }

  public updateState(settings: ISettings): void {
    // console.log(settings);
    this.cpMin!.value = String(settings.min);
    this.cpMin!.max = String(settings.valueFrom);

    this.cpMax!.value = String(settings.max);
    this.cpMax!.min = String(settings.valueTo);

    this.cpStep!.value = String(settings.step);
    this.cpStep!.max = String(settings.max - settings.min);

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
    this.cpTip!.checked = settings.isTooltipsVisible;
  }
}
