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
import './my-icons.js';
import './shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class SwitchDevice extends PolymerElement {
  static get template() {
    return html`
        <style include="shared-styles iron-flex iron-flex-alignment ">
            :host {
                display: inline-block;
                font-size: 50px;
                width: 100%;
                text-align: center;
                vertical-align: middle;
                line-height: 122px;
            }
        </style>
        <span>[[getState(data)]]</span>
`;
  }

  static get is() {
      return 'switch-device';
  }

  static get properties() {
      return {
          node_id: String,
          state: String,
          data: Object
      }
  }

  getState(data) {
      const value = data[0].val;
      if (value != undefined) {
          if (value === 1) {
              return 'ON';
          }
          return 'OFF'
      }
  }
}

window.customElements.define(SwitchDevice.is, SwitchDevice);
