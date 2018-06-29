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
import './device-card.js';
import './shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class TitleCard extends PolymerElement {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                width: 100%;
                height: 100%;
            }
        </style>
        <div class="title" stale\$="[[stale]]" x\$="[[getStale(data.timestamp)]]">
            <div class="flex vertical">Genius Mirror</div>
            <div>
                <div class="subtitle">Daily: [[getTimeString(data.tmBoilerDaily)]]</div>
                <div class="subtitle">Weekly: [[getTimeString(data.tmBoilerWeekly)]]</div>
            </div>
        </div>
`;
  }

  static get is() {
      return 'title-card';
  }

  static get properties() {
      return {
          data: Object,
          timer: Number,
          stale: Boolean
      };
  }

  getTimeString(value) {
      if (value != undefined) {
          let delta = new Date(value * 1000);
          let hours = delta.getUTCHours();
          let days = Math.floor(hours / 24);

          let minutes = delta.getUTCMinutes();
          let seconds = delta.getUTCSeconds();
          let lhz = hours < 10 ? '0' : '';
          let lmz = minutes < 10 ? '0' : '';
          if (days !== 0) {
              return days + " " + lhz + hours + ":" + lmz + minutes;
          }
          return lhz + hours + ":" + lmz + minutes;
      }
  }

  getStale(timestamp) {
      if (timestamp != undefined) {
          if (this.timer != undefined) {
              clearInterval(this.timer);
              this.update(false);
          }
          this.timer = setInterval(() => this.update(true), this.data.interval * 1000);
      }
  }

  update(value) {
      this.stale = value;
  }

  isPageStale(value) {
      if (value != undefined && value) {
          return "stale";
      }
  }
}

window.customElements.define(TitleCard.is, TitleCard);
