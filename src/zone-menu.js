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

import './shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class ZoneMenu extends PolymerElement {
  static get template() {
    return html`
        <style include="shared-styles">
            :host {
                display: inline-block;
            }
        </style>
        <a class="menuitem" name\$="[[zone.strName]]" href="/timer/[[zone.iID]]">[[zone.strName]]</a>
`;
  }

  static get is() {
      return 'zone-menu';
  }

  static get properties() {
      return {
          zone: Object,
          name: String
      };
  }
}

window.customElements.define(ZoneMenu.is, ZoneMenu);
