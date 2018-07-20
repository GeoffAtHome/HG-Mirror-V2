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
    PolymerElement,
} from "@polymer/polymer/polymer-element.js";

import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-icon/iron-icon.js";
import "./my-icons.js";
import "./shared-styles.js";
import {
    html,
} from "@polymer/polymer/lib/utils/html-tag.js";
class BatteryLevel extends PolymerElement {
    static get template() {
        return html `
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                width: 63px;
            }

            #icon {
                position: relative;
                left: 5px;
            }
        </style>
        <div class="layout horizontal justified">
            <iron-icon id="icon"></iron-icon>
            <span>[[getLevel(data)]]</span>
        </div>
`;
    }

    static get is() {
        return "battery-level";
    }

    static get properties() {
        return {
            data: Object,
        };
    }

    getLevel(data) {
        const item = data.filter(x => x.addr === "Battery")[0];
        let level = item.val;
        var value = "";

        if (level === 255) {
            level = 0;
        }

        if (level > 90) {
            value = "battery-full";
        } else if (level > 80) {
            value = "battery-90";
        } else if (level > 60) {
            value = "battery-80";
        } else if (level > 50) {
            value = "battery-60";
        } else if (level > 30) {
            value = "battery-50";
        } else if (level > 20) {
            value = "battery-30";
        } else if (level > 10) {
            value = "battery-20";
        } else {
            value = "battery-alert";
        }
        if (value !== "") {
            this.$.icon.setAttribute("icon", "my-icons:" + value);
        }
        return level + "%";
    }
}

window.customElements.define(BatteryLevel.is, BatteryLevel);