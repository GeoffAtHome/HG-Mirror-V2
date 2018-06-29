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
import '@polymer/iron-icon/iron-icon.js';
import './radiator-device.js';
import './switch-device.js';
import './sensor-device.js';
import './shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class DeviceCard extends PolymerElement {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                width: 100%;
            }
        </style>
        <template is="dom-if" if="{{onoff}}">
            <switch-device node_id="[[node.addr]]" data="[[data]]"></switch-device>
        </template>
        <template is="dom-if" if="{{radiator}}">
            <radiator-device on="[[on]]" node_id="[[node.addr]]" data="[[data]]" lastseen="[[node.childValues.lastComms.val]]"></radiator-device>
        </template>
        <template is="dom-if" if="{{sensor}}">
            <sensor-device node_id="[[node.addr]]" data="[[data]]" lastseen="[[node.childValues.lastComms.val]]"></sensor-device>
        </template>
`;
  }

  static get is() {
      return 'device-card';
  }

  static get properties() {
      return {
          on: Boolean,
          node: {
              type: Object,
              observer: 'dataChanged'
          },
          radiator: {
              type: Boolean,
              value: false
          },
          sensor: {
              type: Boolean,
              value: false
          },
          onoff: {
              type: Boolean,
              value: false
          },
          data: Object
      }
  }

  dataChanged(newData, oldData) {
      // HEATING_1 -> Radiator valve
      // SwitchBinary -> Switch
      // LUMINANCE -> Sensor
      if (newData.childValues['HEATING_1'] !== undefined) {
          this.radiator = true;
      }

      if (newData.childValues['SwitchBinary'] !== undefined) {
          this.onoff = true;
      }
      if (newData.childValues['LUMINANCE'] !== undefined) {
          this.sensor = true;
      }
  }
}

window.customElements.define(DeviceCard.is, DeviceCard);
