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
class LuminanceLevel extends PolymerElement {
    static get template() {
        return html `
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                width: 45px;
            }
        </style>
        <div class="layout horizontal justified">
            <iron-icon icon="my-icons:luminance"></iron-icon>
            <span>[[getLevel(data)]]</span>
        </div>
`;
    }

    static get is() {
        return "luminance-level";
    }

    static get properties() {
        return {
            data: Object,
        };
    }
    getLevel(data) {
        const item = data.filter(x => x.addr === "LUMINANCE")[0];
        return item.val;
    }
}

window.customElements.define(LuminanceLevel.is, LuminanceLevel);