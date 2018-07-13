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
import "@polymer/paper-fab/paper-fab.js";
import "./time-zone.js";
import "./shared-styles.js";
import {
    html
} from "@polymer/polymer/lib/utils/html-tag.js";
class AllTimers extends PolymerElement {
    static get template() {
        return html `
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: block;
                padding: 10px;
                width: 95%;
            }
        </style>
        <template is="dom-repeat" items="[[data]]" as="zone">
            <h2>[[zone.strName]]</h2>
            <time-zone zone="[[zone]]"></time-zone>
        </template>

        <paper-fab class="save" title="Save all" icon="my-icons:save" on-tap="_save"></paper-fab>
        <paper-fab class="clear" title="Clear all" icon="my-icons:clear" on-tap="_clear"></paper-fab>
        <paper-fab class="restore" title="Restore all" icon="my-icons:restore" on-tap="_restore"></paper-fab>
        <a id="hiddenSaver" href\$="[[_file]]" download="{{_filename}}" hidden=""></a>
        <input id="fileRestore" on-change="_restoreFile" accept="application/json" type="file" hidden="">
`;
    }

    static get is() {
        return "all-timers";
    }

    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            data: Object,
        };
    }
    _clear() {
        const payload = {
            "objTimer": [{
                    "fSP": 0,
                    "iDay": 0,
                    "iTm": 0,
                },
                {
                    "fSP": 0,
                    "iDay": 1,
                    "iTm": 0,
                },
                {
                    "fSP": 0,
                    "iDay": 2,
                    "iTm": 0,
                },
                {
                    "fSP": 0,
                    "iDay": 3,
                    "iTm": 0,
                },
                {
                    "fSP": 0,
                    "iDay": 4,
                    "iTm": 0,
                },
                {
                    "fSP": 0,
                    "iDay": 5,
                    "iTm": 0,
                },
                {
                    "fSP": 0,
                    "iDay": 6,
                    "iTm": 0,
                },
            ],
        };

        for (let zone of this.data) {
            this.dispatchEvent(new CustomEvent("update-timer", {
                bubbles: true,
                detail: {
                    "addr": zone.iID,
                    "data": payload,
                    "name": zone.strName,
                },
            }));
        }
    }

    _save() {
        var rawData = [];

        for (let zone of this.data) {
            rawData.push({
                "addr": zone.iID,
                "data": {
                    "objTimer": zone.objTimer,
                },
                "name": zone.strName,
            });
        }

        var data = new Blob([JSON.stringify(rawData)], {
            type: "application/json"
        });

        this._filename = "whole house.json";
        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (this._file !== null) {
            window.URL.revokeObjectURL(this._file);
        }
        this._file = window.URL.createObjectURL(data);

        var event = new MouseEvent("click");
        this.$.hiddenSaver.dispatchEvent(event);
    }

    _restore() {
        this.$.fileRestore.click();
    }


    _restoreFile() {
        const length = this.$.fileRestore.files.length;
        const file = this.$.fileRestore.files[0];

        let reader = new FileReader();
        reader.onloadstart = (event) => {
            this.dispatchEvent(new CustomEvent("load-start", {
                bubbles: true,
                detail: event.target.result,
            }));
        };
        reader.onloadend = (event) => {
            for (let zone of JSON.parse(event.target.result)) {
                this.dispatchEvent(new CustomEvent("update-timer", {
                    bubbles: true,
                    detail: zone,
                }));
            }
        };
        reader.onerror = (event) => {
            this.dispatchEvent(new CustomEvent("error", {
                bubbles: true,
                detail: event.target.result,
            }));
            this.clearInput();
        };
        reader.abort = (event) => {
            this.dispatchEvent(new CustomEvent("abort", {
                bubbles: true,
                detail: event.target.result,
            }));
            this.clearInput();
        };
        reader.onload = (event) => {
            // The file"s text will be printed here
            this.dispatchEvent(new CustomEvent("load", {
                bubbles: true,
                detail: event.target.result,
            }));

            this.clearInput();
        };
        reader.readAsText(file);
    }

    clearInput() {
        this.$.fileRestore.value = "";
    }
}

window.customElements.define(AllTimers.is, AllTimers);