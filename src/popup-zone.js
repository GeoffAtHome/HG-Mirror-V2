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
import "./my-icons.js";
import "./shared-styles.js";
import {
    html
} from "@polymer/polymer/lib/utils/html-tag.js";
class PopupZone extends PolymerElement {
    static get template() {
        return html `
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                padding: 10px;
                width: 95%;
            }
        </style>
        <h2>[[zone.strName]]</h2>
        <time-zone zone="[[zone]]"></time-zone>

        <paper-fab class="save" title="Save" icon="my-icons:save" on-tap="_save"></paper-fab>
        <paper-fab class="clear" title="Clear" icon="my-icons:clear" on-tap="_clear"></paper-fab>
        <paper-fab class="restore" title="Restore" icon="my-icons:restore" on-tap="_restore"></paper-fab>
        <a id="hiddenSaver" href\$="[[_file]]" download="{{_filename}}" hidden=""></a>
        <input id="filerestore" on-change="_restoreFile" accept="application/json" type="file" hidden="">
`;
    }

    static get is() {
        return "popup-zone";
    }

    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            zone: Object,
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

        this.dispatchEvent(new CustomEvent("update-timer", {
            bubbles: true,
            composed: true,
            detail: {
                "data": payload,
                "fSP": 0,
                "name": this.zone.strName,
            },
        }));
    }

    _save() {
        var rawData = {
            "addr": this.zone.iID,
            "data": {
                "objTimer": this.zone.objTimer,
            },
            "name": this.zone.strName,
        };

        var data = new Blob([JSON.stringify(rawData)], {
            type: "application/json"
        });

        this._filename = this.zone.strName + ".json";
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
        this.$.filerestore.click();
    }


    _restoreFile() {
        const length = this.$.filerestore.files.length;
        const file = this.$.filerestore.files[0];

        let reader = new FileReader();
        reader.onloadstart = (event) => {
            this.dispatchEvent(new CustomEvent("load-start", {
                bubbles: true,
                composed: true,
                detail: event.target.result,
            }));
        };
        reader.onloadend = (event) => {
            this.dispatchEvent(new CustomEvent("update-timer", {
                bubbles: true,
                composed: true,
                detail: JSON.parse(event.target.result),
            }));
        };
        reader.onerror = (event) => {
            composed: true,
            this.dispatchEvent(new CustomEvent("error", {
                bubbles: true,
                composed: true,
                detail: event.target.result,
            }));
            this.clearInput();
        };
        reader.abort = (event) => {
            this.dispatchEvent(new CustomEvent("abort", {
                bubbles: true,
                composed: true,
                detail: event.target.result,
            }));
            this.clearInput();
        };
        reader.onload = (event) => {
            // The file"s text will be printed here
            this.dispatchEvent(new CustomEvent("load", {
                bubbles: true,
                composed: true,
                detail: event.target.result,
            }));

            this.clearInput();
        };
        reader.readAsText(file);
    }

    clearInput() {
        this.$.filerestore.value = "";
    }
}

window.customElements.define(PopupZone.is, PopupZone);