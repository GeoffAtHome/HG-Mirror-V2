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
import './zone-header.js';
import './device-card.js';
import './shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class ZoneCard extends PolymerElement {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                padding: 10px;
                cursor: pointer;
                height: 100%;
            }

            .devices {
                height: 100%;
            }
        </style>
        <a href="/timer/[[zone.iID]]">
            <div class="card">
                <zone-header zone="[[zone]]" on\$="[[getZoneState(zone.bOutRequestHeat)]]"></zone-header>
                <div class="layout vertical start">
                    <template is="dom-repeat" items="[[zone.nodes]]" as="node" sort="_sort">
                        <device-card node="[[node]]" on="[[zone.bIsActive]]" data="[[getDeviceData(node)]]"></device-card>
                    </template>
                </div>
            </div>
        </a>
`;
  }

  static get is() {
      return 'zone-card';
  }

  static get properties() {
      return {
          zone: Object
      };
  }
  getZoneState(value) {
      if (value !== undefined && value) {
          return "on";
      }
  }

  getDeviceData(node) {
      const path = node.childValues.location.path;
      const data = this.zone.datapoints.filter(x => x.path === path);
      return data;
  }

  _sort(a, b) {
      // We want sensors displayed before other sensors
      const aType = a.childValues['LUMINANCE'];
      const bType = b.childValues['LUMINANCE'];

      if (aType !== undefined) {
          return -1;
      }

      if (bType !== undefined) {
          return 1;
      }

      return 0;
  }
}

window.customElements.define(ZoneCard.is, ZoneCard);
