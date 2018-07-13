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
import "./my-icons.js";
import "./shared-styles.js";
import {
    html
} from "@polymer/polymer/lib/utils/html-tag.js";
class TemperatureLevel extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles iron-flex iron-flex-alignment">
            :host {
                display: inline-block;
                width: 61px;
            }
        </style>
        <div class="layout horizontal justified">
            <iron-icon icon="my-icons:temperature"></iron-icon>
            <span>[[getTemperature(data)]]</span>
        </div>
`;
    }

    static get is() {
        return "temperature-level";
    }

    static get properties() {
        return {
            data: Object,
        };
    }

    getTemperature(data) {
        const item = data.filter(x => (x.addr === "HEATING_1") || (x.addr === "TEMPERATURE"))[0];
        const value = item.val;

        if (value !== undefined) {
            return value.toFixed(1) + "°";
        }
    }
}

window.customElements.define(TemperatureLevel.is, TemperatureLevel);