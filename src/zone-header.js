/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './last-seen.js';
import './shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class ZoneHeader extends PolymerElement {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                width: 100%;
                margin: 0px;
                height: 28px;
                color: white;
                background-color: var(--app-primary-color);
                font-size: 20px;
                border-radius: 5px 5px 0 0;
                box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
            }

            :host([on]) {
                background-color: orange;
            }

            paper-icon-button {
                margin: 0px;
                padding: 1px;
                width: 28px;
                height: 28px;
                bottom: 3px;
                color: white;
            }

            paper-icon-button:hover {
                background-color: var(--paper-green-500);
                color: white;
            }

            paper-icon-button.on {
                --paper-icon-button-ink-color: pink;
                color: black;
            }

            paper-icon-button.on:hover {
                background-color: var(--paper-pink-500);
                color: white;
            }
        </style>
        <div class="layout horizontal justified top">
            <div class="layout horizontal layout-start">
                <a href="/home/[[zone.iID]]/off">
                    <paper-icon-button class\$="[[isOff(zone)]]" title="Off" icon="my-icons:off"></paper-icon-button>
                </a>
                <a href="/boost/[[zone.iID]]">
                    <paper-icon-button class\$="[[isBoost(zone)]]" title="Boost" icon="my-icons:boost"></paper-icon-button>
                </a>
                <a href="/home/[[zone.iID]]/timer">
                    <paper-icon-button class\$="[[isTimer(zone)]]" title="Timer" icon="my-icons:timer"></paper-icon-button>
                </a>
                <template is="dom-if" if="[[isNotSwitch(zone)]]">
                    <a href="/home/[[zone.iID]]/footprint">
                        <paper-icon-button class\$="[[isFootprint(zone)]]" title="Footprint" icon="my-icons:footprint"></paper-icon-button>
                    </a>
                </template>
            </div>
            <span>[[zone.strName]]</span>
            <div>
                <last-seen down="" lastseen="[[getBoost(zone)]]"></last-seen>
            </div>
        </div>
`;
  }

  static get is() {
      return 'zone-header';
  }

  static get properties() {
      return {
          zone: Object
      };
  }

  isNotSwitch(zone) {
      if (zone.nodes[0].childValues['SwitchBinary'] == undefined) {
          return true;
      }
      return false;
  }

  getBoost(zone) {
      if (zone.iMode === 16) {
          return zone.iBoostTimeRemaining;
      }
      return -1;
  }

  // Mode_Off: 1,
  // Mode_Timer: 2,
  // Mode_Footprint: 4,
  // Mode_Away: 8,
  // Mode_Boost: 16,
  // Mode_Early: 32,
  // Mode_Test: 64,
  // Mode_Linked: 128,
  // Mode_Other: 256
  isOff(zone) {
      if (zone.iMode === 1 || zone.iMode === 8) {
          return 'on';
      }
      return 'off';
  }


  isTimer(zone) {
      if (zone.iMode === 2) {
          return 'on';
      }
      return 'off';
  }

  isFootprint(zone) {
      if (zone.iMode === 4) {
          return 'on';
      }
      return 'off';
  }

  isBoost(zone) {
      if (zone.iMode === 16) {
          return 'on';
      }
      return 'off';
  }

  _boost(event) {
      this.dispatchEvent(new CustomEvent('boost-dialog', {
          bubbles: true,
          composed: true,
          detail: this.zone
      }));
      event.stopPropagation();
  }

  _timer(event) {
      return this.changeMode(event, 2);
  }

  _off(event) {
      return this.changeMode(event, 1);
  }

  _footprint(event) {
      return this.changeMode(event, 4);
  }

  changeMode(event, mode) {
      this.dispatchEvent(new CustomEvent('update-timer', {
          bubbles: true,
          composed: true,
          detail: {
              addr: this.zone.iID,
              data: {
                  iMode: mode
              }
          }
      }));
      event.stopPropagation();
  }
}

window.customElements.define(ZoneHeader.is, ZoneHeader);
