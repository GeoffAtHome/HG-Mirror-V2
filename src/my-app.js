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
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-header-layout/app-header-layout.js";
import "@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-selector/iron-selector.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-toast/paper-toast.js";
import "./my-icons.js";
import "./title-card.js";
import "./zone-menu.js";
import "./shared-styles.js";
import "./all-timers.js";
import {
    html,
} from "@polymer/polymer/lib/utils/html-tag.js";
class MyApp extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
            :host {
                --app-primary-color: #4285f4;
                --app-secondary-color: black;

                display: block;
            }

            :host([hidden]) {
                display: none !important;
            }

            app-drawer-layout:not([narrow]) [drawer-toggle] {
                display: none;
            }

            app-header {
                color: #fff;
                background-color: var(--app-primary-color);
            }

            app-header paper-icon-button {
                --paper-icon-button-ink-color: white;
            }

            .drawer-list {
                margin: 0 20px;
            }

            .drawer-list a {
                display: block;
                padding: 0 16px;
                text-decoration: none;
                color: var(--app-secondary-color);
                line-height: 40px;
            }

            .drawer-list a.iron-selected {
                color: black;
                font-weight: bold;
            }
        </style>
        <iron-ajax id="main" auto="" url="[[serverName]]" headers="[[headers]]" handle-as="json"
        on-response="handleResponse" on-error="handleError"></iron-ajax>
        <iron-ajax id="update" headers="[[headers]]" method="PATCH" handle-as="json"
         on-response="handleUpdate"></iron-ajax>

        <app-location route="{{route}}" url-space-regex="^[[rootPath]]"></app-location>
        <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
        <app-drawer-layout fullbleed="" narrow="{{narrow}}">
            <!-- Drawer content -->
            <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
                <app-toolbar>Menu</app-toolbar>
                <iron-selector selected="[[pagezone]]" attr-for-selected="name" class="drawer-list" role="navigation">
                    <a class="menuitem" name="home" href="[[rootPath]]home">Home</a>
                    <template is="dom-repeat" items="[[persistedData]]" as="zone">

                        <zone-menu name="[[zone.strName]]" zone="[[zone]]"></zone-menu>
                        <br>
                    </template>
                    <a class="menuitem" name="timers" href="[[rootPath]]timers">All timers</a>
                    <div class="menuitem" name="logout" on-click="_logout">Logout</div>
                </iron-selector>
            </app-drawer>

            <!-- Main content -->
            <app-header-layout id="header" has-scrolling-region="">

                <app-header slot="header" condenses="" reveals="" effects="waterfall">
                    <app-toolbar>
                        <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
                        <title-card data="[[persistedWholeHouse]]"></title-card>
                    </app-toolbar>
                </app-header>
                <div id="mainpage">
                    <iron-pages selected="[[page]]" attr-for-selected="name" fallback-selection="main" role="main">
                        <popup-zone name="timer" id="timer" data="[]"></popup-zone>
                        <boost-dialog name="boost" id="boost" data="[]"></boost-dialog>
                        <geniusmirror-app name="home" data="[[persistedData]]"></geniusmirror-app>
                        <all-timers id="timers" name="timers"></all-timers>
                    </iron-pages>
                </div>

            </app-header-layout>
        </app-drawer-layout>
        <paper-toast id="toast" duration="5000" text="Unable to contact hub.
         Stale data is being displayed"></paper-toast>
`;
    }

    static get is() {
        return "my-app";
    }

    static get properties() {
        return {
            headers: Object,
            offline: Boolean,
            page: {
                observer: "_pageChanged",
                reflectToAttribute: true,
                type: String,
            },
            pagezone: String,
            persistedData: Object,
            persistedWholeHouse: Object,
            routeData: Object,
            serverName: String,
            signedIn: Boolean,
            subroute: String,
            timer: Object,
        };
    }

    static get observers() {
        return [
            "_routePageChanged(routeData.page)",
        ];
    }

    ready() {
        super.ready();
        window.addEventListener("update-timer", event => this._updateTimer(event));
        window.addEventListener("home", event => this._clickHomeHandler(event));
    }

    _updateTimer(event) {
        let ajax = this.$.update;
        ajax.url = this.serverName.slice(0, -1) + "/" + event.detail.addr; // Remote
        ajax.body = JSON.stringify(event.detail.data);
        ajax.generateRequest();
    }

    handleUpdate(event) {
        // Refresh main data
        this.$.main.generateRequest();
    }

    resizeHeader() {
        this.$.header.fire("iron-resize");
    }


    handleError(e) {
        // We failed to contact the hub... lets retrive the data from the mirrored DB
        const promises = [];
        promises.push(this.$.zones.getStoredValue("zones"));
        promises.push(this.$.wholehouse.getStoredValue("wholehouse"));

        const all = Promise.all(promises);
        all.then(results => {
            this.persistedData = results[0];
            this.persistedWholeHouse = results[1];
        });
        this.$.toast.fitInto = this.$.mainpage;
        this.$.toast.open();
        this.startTimer();
    }

    handleResponse(e) {
        let result = e.detail.response.data;
        // Format the response
        let data = result.sort((a, b) => a.iPriority - b.iPriority);

        // Remove the whole house zone
        this.persistedWholeHouse = data.shift();
        this.persistedData = data;

        // When we receive new data we need to update the appropriate page with the data
        if (this.page === "timer" || this.page === "timers") {
            this._routePageChanged(this.page);
        }

        this.startTimer();
    }

    startTimer() {
        // Set up a timer to retrive data from the hub every 10 seconds
        if (this.timer === undefined) {
            this.timer = setInterval(() => this.handleUpdate(), 10 * 1000);
        }
    }

    _clickHomeHandler(event) {
        this.page = "home";
    }

    _routePageChanged(page) {
        // If no page was found in the route data, page will be an empty string.
        // Default to "view1" in that case.
        this.page = page || "home";
        this.pagezone = this.page;

        if (this.persistedData !== undefined) {

            if (this.page === "timer") {
                let zoneId = parseInt(this.subroute.path.slice(1));
                if (!isNaN(zoneId)) {
                    let zone = this.persistedData.filter(item => item.iID === zoneId)[0];
                    this.pagezone = zone.strName;
                    this.$.timer.zone = zone;
                }
            } else if (this.page === "boost") {
                let zoneId = parseInt(this.subroute.path.slice(1));
                if (!isNaN(zoneId)) {
                    let zone = this.persistedData.filter(item => item.iID === zoneId)[0];
                    this.pagezone = zone.strName;
                    this.$.boost.zone = zone;
                }
            } else if (this.page === "timers") {
                this.$.timers.data = this.persistedData;
            } else if (this.page === "home" && this.subroute.path !== undefined) {
                const subpaths = this.subroute.path.slice(1).split("/");
                const zoneId = parseInt(subpaths[0]);
                const mode = subpaths[1];

                if (mode === "off") {
                    this._setMode(1, zoneId);
                } else if (mode === "boost") {
                    this._setMode(4, zoneId);
                } else if (mode === "timer") {
                    this._setMode(2, zoneId);
                } else if (mode === "footprint") {
                    this._setMode(4, zoneId);
                }
                // stop repeat actions
                this.subroute = {};
            }
        } else {
            // No data so stay at home
            this.page = "home";
            this.pagezone = this.page;
        }

        // Close a non-persistent drawer when the page & route are changed.
        if (!this.$.drawer.persistent) {
            this.$.drawer.close();
        }
    }

    _setMode(mode, zoneId) {
        this.dispatchEvent(new CustomEvent("update-timer", {
            bubbles: true,
            detail: {
                addr: zoneId,
                data: {
                    iMode: mode,
                },
            },
        }));
    }
    _pageChanged(page) {
        switch (page) {
        case "home":
            import ("./geniusmirror-app.js");
            break;
        case "boost":
            import ("./boost-dialog.js");
            break;
        default:
            import ("./popup-zone.js");
            break;
        }
    }

    _logout() {
        this.dispatchEvent(new CustomEvent("log-out", {
            bubbles: true,
            composed: true,
        }));
    }
    _showPage404() {
        this.page = "view404";
    }
}

window.customElements.define(MyApp.is, MyApp);