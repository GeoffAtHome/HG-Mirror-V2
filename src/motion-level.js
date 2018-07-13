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
class MotionLevel extends PolymerElement {
    static get template() {
        return html `
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                width: 33px;
            }
        </style>
        <div class="layout horizontal end-justified">
            <span>
                <iron-icon id="icon"></iron-icon>[[setMotion(data)]]</span>
        </div>
`;
    }

    static get is() {
        return "motion-level";
    }

    static get properties() {
        return {
            data: Object,
        };
    }

    setMotion(data) {
        const item = data.filter(x => x.addr === "Motion")[0];
        const value = item.val;

        var icon = "unoccuppied";

        if (value > 0) {
            icon = "occuppied";
        }
        this.$.icon.setAttribute("icon", "my-icons:" + icon);
    }
}

window.customElements.define(MotionLevel.is, MotionLevel);