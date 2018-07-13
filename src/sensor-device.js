/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import {
    PolymerElement
} from "@polymer/polymer/polymer-element.js";

import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-icon/iron-icon.js";
import "./battery-level.js";
import "./temperature-level.js";
import "./luminance-level.js";
import "./last-seen.js";
import "./motion-level.js";
import "./my-icons.js";
import "./shared-styles.js";
import {
    html
} from "@polymer/polymer/lib/utils/html-tag.js";
class SensorDevice extends PolymerElement {
    static get template() {
        return html `
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                padding-left: 15px;
                padding-top: 10px;
            }
        </style>
        <div class="layout horizontal start">
            <iron-icon icon="my-icons:sensor"></iron-icon>
            <battery-level data="[[data]]"></battery-level>
            <temperature-level data="[[data]]"></temperature-level>
            <last-seen lastseen="[[lastseen]]"></last-seen>
            <luminance-level data="[[data]]"></luminance-level>
            <motion-level data="[[data]]"></motion-level>
        </div>
`;
    }

    static get is() {
        return "sensor-device";
    }

    static get properties() {
        return {
            data: Object,
            lastseen: Number,
            node_id: String,
        };
    }
}

window.customElements.define(SensorDevice.is, SensorDevice);