/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

// These are the actions needed by this element.
import '@vaadin/vaadin-login';

// import { SharedStyles } from './shared-styles';

function LogError(text: string, err: any) {
  console.error(`${text}: ${err}`);
}

@customElement('user-login')
export class UserLogin extends LitElement {
  @query('#loginForm')
  private loginForm: any;

  @property({ type: String })
  private userName: string = '';

  @property({ type: String })
  private passwordPassword: string = '';

  @property({ type: Boolean })
  private loggedIn: boolean = false;

  protected render() {
    return html`
      <vaadin-login-overlay
        id="loginForm"
        title="Genius Mirror"
        description="Login to the Genius Hub"
        opened
        @login="${this.loginEvent}"
      ></vaadin-login-overlay>
    `;
  }

  updated() {
    if (!this.loggedIn) this.loginForm.opened = true;
  }

  private loginEvent(e: CustomEvent<{ username: string; password: string }>) {
    this.userName = e.detail.username;
    this.passwordPassword = e.detail.password;
    this.loginButton();
  }

  private async loginButton() {}
}
