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
import {
    GoogleCharts,
} from "google-charts";
import "./shared-styles.js";
import {
    html,
} from "@polymer/polymer/lib/utils/html-tag.js";


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

            .chart {
                width: 100%;
                height: 350px;
            }
        </style>
        <div class="chart" id="chart" data="[[getData(zone)]]"></div>
`;
    }

    static get is() {
        return "time-zone";
    }

    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            _file: Object,
            hidden: {
                reflectToAttribute: true,
                type: Boolean,
                value: false,
            },
            loaded: {
                type: Boolean,
                value: false,
            },
            loading: Object,
            options: {
                type: Object,
                value: {
                    tooltip: {
                        isHtml: false,
                    },
                },
            },
            zone: Object,
        };
    }
    ready() {
        super.ready();
        // do something that requires access to the shadow tree
        if (this.loading === undefined) {
            this.loading = GoogleCharts.load(null, "timeline");
            this.loading.then(() => {
                this.loaded = true;
                this.dispatchEvent(new CustomEvent("refresh", {
                    bubbles: true,
                    composed: true,
                }));
            });
        }
    }
    getData(zone) {
        if (zone !== undefined && zone !== null && this.loaded === true) {
            this.hidden = false;
            const chart = new GoogleCharts.api.visualization.Timeline(this.$.chart);
            const dataTable = new GoogleCharts.api.visualization.DataTable();
            const d = new Date();
            const tz = d.getTimezoneOffset() * 60 * 1000;
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const results = [];
            const data = this.zone.objTimer;

            for (let day = 0; day < 7; day++) {
                let today = data.filter(item => item.iDay === day);
                let lastTime = 0;
                let setPoint = 0;
                for (let key of Object.keys(today)) {
                    let event = today[key];
                    if (lastTime !== event.iTm && event.iTm !== -1) {
                        results.push([days[day], this.getText(setPoint), new Date((lastTime * 1000) +
                            tz), new Date(
                            (event.iTm * 1000) + tz)]);
                    }
                    setPoint = event.fSP;
                    lastTime = Math.max(0,event.iTm);
                }
                if (lastTime !== 86400) {
                    results.push([days[day], this.getText(setPoint), new Date((lastTime * 1000) + tz), new Date(
                        (24 * 60 * 60 * 1000) - 1 + tz)]);
                }
                lastTime = 0;
            }
            dataTable.addColumn({
                id: "Day",
                type: "string",
            });
            dataTable.addColumn({
                id: "State",
                type: "string",
            });
            dataTable.addColumn({
                id: "Start",
                type: "date",
            });
            dataTable.addColumn({
                id: "End",
                type: "date",
            });
            dataTable.addRows(results);

            const options = {
                tooltip: {
                    isHtml: false,
                },
            };
            chart.draw(dataTable, options);
        } else {
            this.hidden = true;
        }
    }

    getText(setPoint) {
        if (this.zone.nodes[0].childValues.SwitchBinary !== undefined) {
            if (setPoint === 0) {
                return "Off";
            } else {
                return "On";
            }
        }
        return String(setPoint) + "℃";
    }
}

window.customElements.define(TimeZone.is, TimeZone);