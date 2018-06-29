import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import './zone-card.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 */
class GeniusmirrorApp extends PolymerElement {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment shared-styles">
            :host {
                display: block;
            }

            #dialog {
                width: 100%;
            }
        </style>
        <div class="layout center-justified horizontal wrap">
            <template is="dom-repeat" items="[[data]]" as="zone">
                <zone-card zone="[[zone]]"></zone-card>
            </template>
        </div>
`;
  }

  static get is() {
      return 'geniusmirror-app';
  }
  static get properties() {
      return {
          data: Object
      };
  }
}

window.customElements.define(GeniusmirrorApp.is, GeniusmirrorApp);
