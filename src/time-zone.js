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

let loaded = false;
let loading = GoogleCharts.load(null, "timeline");
loading.then(() => {
    loaded = true;
    console.log("charts are loaded");
});


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

    getData(zone) {
        if (zone !== undefined && zone !== null && loaded === true) {
            const d = new Date();
            const tz = d.getTimezoneOffset() * 60 * 1000;
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let results = [];
            let data = this.zone.objTimer;

            // results.push([days[0], this.getText(1), new Date(0 + tz), new Date(0 + tz)]);
            for (let day = 0; day < 7; day++) {
                let today = data.filter(item => item.iDay === day)
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
                    lastTime = event.iTm;
                }
                results.push([days[day], this.getText(setPoint), new Date((lastTime * 1000) + tz), new Date(
                    (24 * 60 * 60 * 1000) + tz)]);
                lastTime = 0;
                this.hidden = false;
            }
            const chart = new GoogleCharts.api.visualization.Timeline(this.$.chart);
            let dataTable = new GoogleCharts.api.visualization.DataTable();
            dataTable.addColumn({
                type: "string",
                id: "Day",
            });
            dataTable.addColumn({
                type: "string",
                id: "State",
            });
            dataTable.addColumn({
                type: "date",
                id: "Start",
            });
            dataTable.addColumn({
                type: "date",
                id: "End",
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

    drawChart(zone) {}

    getText(setPoint) {
        if (this.zone.nodes[0].childValues["SwitchBinary"] !== undefined) {
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