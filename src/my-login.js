import {
    PolymerElement,
    html,
} from "@polymer/polymer/polymer-element.js";
import {
    setPassiveTouchGestures,
    setRootPath,
} from '@polymer/polymer/lib/utils/settings.js';
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-progress/paper-progress.js";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "./shared-styles.js";
import "./my-icons.js";
import "../node_modules/js-sha256/src/sha256.js";
// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);
class MyLogin extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
            :host {
                display: block;
            }

            .spx {
                display: none;
            }

            .spx[loading] {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #FFF;
            }

            .msg {
                text-align: center;
                font-size: 12px;
                font-weight: 500;
                line-height: 24px;
                margin: 0;
                padding: 0;
            }

            .msg--error {
                color: #e84a5f;
            }

            paper-icon-button {
                color: grey;
            }
        </style>

        <iron-ajax id="checkIn" url="https://hub.geniushub.co.uk/checkin" headers="[[headers]]"
            handle-as="json" reject-with-request=""></iron-ajax>
        <div hidden\$="[[!offline]]">
            <h1>Sorry you are currently off line and cannot login</h1>
        </div>
        <div hidden\$="[[offline]]">
            <div class="spx" loading\$="[[!signedIn]]">
                <h1>Welcome to the Alternative Genius Hub App</h1>

                <div class="msg msg--error">
                    <span>[[_lastError]]</span>
                </div>
                <paper-input id="usernameInput" type="text" label="User name" value="{{username}}"
                    error-message="User name required" on-keydown="_submitOnEnter" required="">
                </paper-input>

                <paper-input id="passwordInput" type="password" label="Password" value="{{password}}"
                     error-message="Password required" on-keydown="_submitOnEnter" required="">
                    <paper-icon-button id="passwordIconButton" slot="suffix" on-down="_revealPW"
                        on-up="_hidePW" icon="my-icons:visibility" title="Hold to view password text">
                    </paper-icon-button>
                </paper-input>

                <paper-button raised="" type="submit" on-click="_signIn" class="btn--signin"
                    disabled\$="[[inProgress]]">
                    <span>Sign In</span>
                    <paper-progress class="btn-progress" hidden\$="[[!inProgress]]"
                        disabled\$="[[!inProgress]]" indeterminate=""></paper-progress>
                </paper-button>

                <paper-checkbox value="{{remember}}">Remember details</paper-checkbox>

            </div>
        </div>
        <my-app id="mainApp" hidden\$="[[!signedIn]]" headers="[[headers]]"
            server-name="[[serverName]]" offline="[[offline]]" signed-in="[[signedIn]]"></my-app>
`;
    }

    static get is() {
        return "my-login";
    }
    static get properties() {
        return {
            _lastError: {
                type: String,
                value: "   ",
            },
            headers: Object,
            inProgress: {
                type: Boolean,
                value: false,
            },
            offline: {
                type: Boolean,
                value: !1,
            },
            password: {
                type: String,
                value: "",
            },
            passwordInput: {
                type: String,
                value: "",
            },
            remember: {
                type: String,
                value: "on",
            },
            serverName: String,
            signedIn: {
                type: Boolean,
                value: !1,
            },
            username: String,
        };
    }
    ready() {
        super.ready();
        window.addEventListener("log-out",
            () => this._logout());
        // this.offline = navigator.onLine === !1;
        window.addEventListener("online", () => this._online());
        window.addEventListener("offline", () => this._offline());
        window.addEventListener("switch", () => this._switchToApp());
        this.remember = localStorage.getItem("remember");
        if (localStorage.getItem("signedIn")) {
            this._switchToApp();
        }
    }

    _switchToApp() {
        const credentialsText = localStorage.getItem("credentials");
        if (credentialsText !== null && credentialsText !== "") {
            const credentials = JSON.parse(atob(credentialsText));
            this.signIn(credentials.username, credentials.password);
        }
    }
    signIn(username, password) {
        this.inProgress = true;
        const authString = "Basic " + btoa(username + ":" + sha256(username + password));
        this.headers = {
            "Authorization": authString,
        };

        // Test the username and password
        let request = this.$.checkIn.generateRequest();
        request.completes.then(req => {
            // successful request, argument is iron-request element
            import ("./my-app.js"); //.then(null, this._showPage404.bind(this));

            // Save the credentials for next login
            let credentials = {};
            if (this.remember) {
                credentials = {
                    "password": password,
                    "username": username,
                };
                localStorage.setItem("remember", "on");
            } else {
                credentials = {
                    "password": "",
                    "username": "",
                };
                localStorage.setItem("remember", "off");
            }
            localStorage.setItem("credentials", btoa(JSON.stringify(credentials)));
            localStorage.setItem("signedIn", "true");
            // Remember the serve name as this tends to change.
            this.serverName = "https://" + req.response.data.tunnel.server_name + "/v3/zones";
            this.inProgress = false;
            this.signedIn = !this.signedIn;
            // We went from hidden to visible, so app-layout needs to recompute its size.
            this.$.mainApp.resizeHeader();
        }, rejected => {
            // failed request, argument is an object
            this.inProgress = false;
            let req = rejected.request;
            let error = rejected.error;
            this.set("_lastError", "Incorrect username, password or hub not responding");
        });
    }

    _online() {
        this.offline = !1;
    }
    _offline() {
        this.offline = !0;
    }
    _logout() {
        this.signedIn = !this.signedIn;
        localStorage.setItem("credentials", "");
        localStorage.setItem("signedIn", "false");
        localStorage.setItem("remember", "false");
    }

    /**
     * Cleans message and error sections.
     */
    _cleanMessages() {
        this.set("_lastError", "   ");
    }

    /**
     * Cleans email and password inputs.
     */
    _cleanInputs() {
        this.$.usernameInput.value = "";
        this._cleanPasswordInput();
    }

    /**
     * Cleans password input
     */
    _cleanPasswordInput() {
            this.passwordInput.value = "";
        }
        /**
         * Tries to sign in a user using the form values.
         */
    _signIn() {
            this._cleanMessages();
            let e = this.$.usernameInput.validate();
            let p = this.$.passwordInput.validate();
            if (e && p) {
                this.signIn(this.username, this.password);
            }
        }
        /**
         *  Checks for enter being pressed and submits the appropriate form action
         */
    _submitOnEnter(e) {
            if (e.keyCode === 13) {
                this._signIn();
            }
        }
        /**
         *  Reveals the password in the parent by switching the type to text
         */
    _revealPW(e) {
        this.$.passwordIconButton.icon = "my-icons:visibility-off";
        this.$.passwordInput.type = "text";
    }

    /**
     * Hides the password in the parent by switching the type to password
     */
    _hidePW(e) {
        setTimeout(function () {
            this.$.passwordIconButton.icon = "my-icons:visibility";
            this.$.passwordInput.type = "password";
        }.bind(this), 1000)
    }
}
window.customElements.define(MyLogin.is, MyLogin);