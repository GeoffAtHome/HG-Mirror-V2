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
import "./battery-level.js";
import "./temperature-level.js";
import "./last-seen.js";
import "./shared-styles.js";
import {
    html
} from "@polymer/polymer/lib/utils/html-tag.js";
class RadiatorDevice extends PolymerElement {
    static get template() {
        return html `
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                padding-left: 15px;
            }
        </style>
        <div class="layout horizontal start">
            <iron-icon on\$="[[getRadiatorState(on)]]" icon="my-icons:radiator"></iron-icon>
            <battery-level data="[[data]]"></battery-level>
            <temperature-level data="[[data]]"></temperature-level>&nbsp;
            <last-seen lastseen="[[lastseen]]"></last-seen>
        </div>
`;
    }

    static get is() {
        return "radiator-device";
    }

    static get properties() {
        return {
            data: Object,
            lastseen: Number,
            node_id: String,
            on: Boolean,
        };
    }

    handleResponse(e) {
        let result = e.detail.response.data;
        // Format the response
        let x = result.sort((a, b) => a.iPriority - b.iPriority);
        // Remove the whole house zone
        x.shift();
        this.data = x;
    }

    getRadiatorState(value) {
        if (value !== undefined) {
            if (value) {
                return "on";
            }
        }
    }
}

window.customElements.define(RadiatorDevice.is, RadiatorDevice);