import "@polymer/polymer/polymer-element.js";
const $_documentContainer = document.createElement("template");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
      .title {
        width: 100%;
        margin: 0;
        color: white;
        font-size: 30px;
        text-align: center;
        @apply --layout-horizontal;
        @apply --layout-center;
      }

      .title[stale] {
        background-color: red;
      }

      .subtitle {
        font-size: 12px;
        text-align: right;
        padding-right: 10px;
      }

      .card {
        width: 310px;
        height: 150px;
        padding: 0px;
        color: #757575;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }

      .menuitem {
        display: block;
        cursor: pointer;
        padding: 0 16px;
        line-height: 40px;
        color: var(--app-secondary-color);
        text-decoration: none
      }

      .menuitem.iron-selected {
        color: black;
        font-weight: bold;
      }

      paper-fab.save {
        position: fixed;
        right: 200px;
        bottom: 30px;
      }

      paper-fab.clear {
        position: fixed;
        right: 125px;
        bottom: 30px;
      }

      paper-fab.restore {
        position: fixed;
        right: 50px;
        bottom: 30px;
      }

      zone-menu.iron-selected {
        color: black;
        font-weight: bold;
      }

      iron-icon[on] {
        --iron-icon-fill-color: orange;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/* shared styles for all views */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
;