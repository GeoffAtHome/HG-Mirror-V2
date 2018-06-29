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
class LastSeen extends PolymerElement {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                width: 50px;
            }
        </style>
        <span>&nbsp;[[value]]</span>
`;
  }

  static get is() {
      return 'last-seen';
  }

  static get properties() {
      return {
          lastseen: {
              type: Number,
              observer: 'dataChanged'
          },
          down: {
              type: Boolean,
              value: false
          },
          value: String,
          baseTime: Number,
          timer: Number
      }
  }

  dataChanged(newData, oldData) {
      if (newData) {
          if (newData === -1) {
              if (this.timer) {
                  clearInterval(this.timer);
                  this.timer = undefined;
              }
              this.value = "";
          } else {
              if (this.timer == undefined) {
                  this.timer = setInterval(() => this.update(), 1000);
              }
              if (this.down) {
                  this.baseTime = new Date().getTime() + (this.lastseen * 1000);
              } else {
                  this.baseTime = this.lastseen * 1000;
              }
          }
      }
  }

  update() {
      let now = new Date().getTime();
      let delta = {}
      if (this.down) {
          delta = new Date(this.baseTime - now);
      } else {
          delta = new Date(now - this.baseTime);
      }
      let minutes = delta.getUTCMinutes();
      let seconds = delta.getUTCSeconds();
      let lmz = minutes < 10 ? '0' : '';
      let lsz = seconds < 10 ? '0' : '';
      this.value = lmz + minutes + ":" + lsz + seconds;
  }
}

window.customElements.define(LastSeen.is, LastSeen);
