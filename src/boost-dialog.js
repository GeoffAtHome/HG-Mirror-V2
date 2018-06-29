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
import '@polymer/paper-toggle-button/paper-toggle-button.js';
// import '../node_modules/paper-duration-input/paper-duration-input.js';
import '@polymer/paper-fab/paper-fab.js';
import './time-zone.js';
import './my-icons.js';
import './shared-styles.js';
import {
    html
} from '@polymer/polymer/lib/utils/html-tag.js';
class BoostDialog extends PolymerElement {
    static get template() {
        return html `
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: inline-block;
                padding: 10px;
                margin: 5px;
                width: 100%;
            }

            .panel {
                width: 350px;
                height: 220px;
                padding: 10px;
                color: #757575;
                border-radius: 5px;
                background-color: #fff;
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);
            }

            paper-fab.OK {
                top: 15px;
                left: 215px;
            }

            paper-fab.cancel {
                top: 15px;
                left: 230px;
            }
        </style>
        <div class="panel">
            <h2>[[zone.strName]]</h2>

            <div class="layout horizontal justified">
                <span>Override duration: </span>
                <paper-duration-input hide-label="" hour="{{hour}}" min="{{minute}}"></paper-duration-input>
            </div>
            <div class="layout horizontal justified">
                <span>Override setting: </span>
                <paper-toggle-button checked="{{setting}}"></paper-toggle-button>
            </div>
            <div class="layout end horizontal">
                <paper-fab title="OK" class="OK" icon="my-icons:tick" on-click="_OK"></paper-fab>
                <paper-fab title="Cancel" class="cancel" icon="my-icons:cancel" on-click="_cancel"></paper-fab>
            </div>
        </div>
`;
    }

    static get is() {
        return 'boost-dialog';
    }

    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            zone: {
                type: Object,
                observer: '_zoneChanged',
            },
            setting: Boolean,
            hour: Number,
            minute: Number
        };
    }

    _zoneChanged(zone) {
        this.hour = zone.iOverrideDuration / (60 * 60); // Seconds to hours
        this.minute = (zone.iOverrideDuration / 60) % 60; // Seconds to minutes
        this.setting = zone.iOverrideMode ? true : false;
    }


    _OK() {
        this.dispatchEvent(new CustomEvent('update-timer', {
            bubbles: true,
            composed: true,
            detail: {
                addr: this.zone.iID,
                data: {
                    iMode: 16,
                    iBoostTimeRemaining: (this.hour * 60 + this.minute) * 60,
                    fBoostSP: this.setting ? 1 : 0
                }
            }
        }));
        this.switchToHome();
    }


    _cancel() {
        this.switchToHome();
    }

    switchToHome() {
        this.dispatchEvent(new CustomEvent('home', {
            bubbles: true,
            composed: true
        }));
    }
}

window.customElements.define(BoostDialog.is, BoostDialog);