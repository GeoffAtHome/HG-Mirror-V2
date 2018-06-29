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
} from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
// import '../node_modules/google-charts/googleCharts.js';
import './shared-styles.js';
import {
    html
} from '@polymer/polymer/lib/utils/html-tag.js';
class TimeZone extends PolymerElement {
    static get template() {
        return html `
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                padding: 10px;
                width: 100%;
            }

            :host([hidden]) {
                display: none;
            }

            google-chart {
                width: 100%;
                height: 350px;
            }
        </style>
        <google-chart type="timeline" options="[[options]]" data="[[getData(zone)]]"></google-chart>
`;
    }

    static get is() {
        return 'time-zone';
    }

    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            zone: Object,
            _file: Object,
            options: {
                type: Object,
                value: {
                    tooltip: {
                        isHtml: false
                    }
                }
            },
            hidden: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            }
        };
    }

    getData(zone) {
        if (zone !== undefined && zone !== null) {
            const d = new Date();
            const tz = d.getTimezoneOffset() * 60 * 1000;
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let results = [];
            let data = this.zone.objTimer;

            results.push([days[0], this.getText(1), new Date(0 + tz), new Date(0 + tz)]);
            for (let day = 0; day < 7; day++) {
                let today = data.filter(item => item.iDay == day)
                let lastTime = 0;
                let setPoint = 0;
                for (let key of Object.keys(today)) {
                    let event = today[key];
                    if (lastTime !== event.iTm && event.iTm !== -1) {
                        results.push([days[day], this.getText(setPoint), new Date((lastTime * 1000) +
                            tz), new Date(
                            (event.iTm * 1000) + tz)]);
                    } else {}
                    setPoint = event.fSP;
                    lastTime = event.iTm;
                }
                results.push([days[day], this.getText(setPoint), new Date((lastTime * 1000) + tz), new Date(
                    (24 * 60 * 60 * 1000) + tz)]);
                lastTime = 0;
                this.hidden = false;
            }
            return results;
        } else {
            this.hidden = true;
        }
    }

    getText(setPoint) {
        if (this.zone.nodes[0].childValues["SwitchBinary"] !== undefined) {
            if (setPoint == 0) {
                return "Off";
            } else {
                return "On";
            }
        }
        return String(setPoint) + "℃";
    }
}

window.customElements.define(TimeZone.is, TimeZone);