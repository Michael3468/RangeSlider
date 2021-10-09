/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import { ISettings } from '../RangeSlider/types';
import { createElement } from '../lib/common';

export default class ConfigurationPanel {
  settings: ISettings;
  element: HTMLElement;

  cpMin: HTMLElement | undefined;
  cpMax: HTMLElement | undefined;
  cpStep: HTMLElement | undefined;
  cpFrom: HTMLElement | undefined;
  cpTo: HTMLElement | undefined;

  cpVertical: HTMLElement | undefined;
  cpRange: HTMLElement | undefined;
  cpScale: HTMLElement | undefined;
  cpBar: HTMLElement | undefined;
  cpTip: HTMLElement | undefined;

  constructor(settings: ISettings) {
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
            <input type="number" name="min" value="0">
          </div>
        </div>
        <div class="settings-panel__options_input">
          <div class="settings-panel__options_input-text">max</div>
          <div class="settings-panel__options_input-value">
            <input type="number" name="max" value="0">
          </div>
        </div>
        <div class="settings-panel__options_input">
          <div class="settings-panel__options_input-text">step</div>
          <div class="settings-panel__options_input-value">
            <input type="number" name="step" value="0">
          </div>
        </div>
        <div class="settings-panel__options_input">
          <div class="settings-panel__options_input-text">from</div>
          <div class="settings-panel__options_input-value">
            <input type="number" name="from" value="0">
          </div>
        </div>
        <div class="settings-panel__options_input">
          <div class="settings-panel__options_input-text">to</div>
          <div class="settings-panel__options_input-value">
            <input type="number" name="to" value="0">
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
    this.cpMin = this.element.querySelector('input[name="min"]') as HTMLElement;
    this.cpMax = this.element.querySelector('input[name="max"]') as HTMLElement;
    this.cpStep = this.element.querySelector('input[name="step"]') as HTMLElement;
    this.cpFrom = this.element.querySelector('input[name="from"]') as HTMLElement;
    this.cpTo = this.element.querySelector('input[name="to"]') as HTMLElement;

    this.cpVertical = this.element.querySelector('input[name="vertical"]') as HTMLElement;
    this.cpRange = this.element.querySelector('input[name="range"]') as HTMLElement;
    this.cpScale = this.element.querySelector('input[name="scale"]') as HTMLElement;
    this.cpBar = this.element.querySelector('input[name="bar"]') as HTMLElement;
    this.cpTip = this.element.querySelector('input[name="tip"]') as HTMLElement;
  }
}
