# Heat Genius Mirror V2

## Overview
This project allows the timer data to be saved and restored. So for example, if you want to change your setting for when you are on holiday save the setting and restore them when you get back.

This can be run locally, with a local IP address to your Genius Hub, or remote with an external  URL to your Genuis Hub.

In `src\my-app.html` change the two occurrences as necessary.

        value: "https://hub-server-1.heatgenius.co.uk/v3/zones" // Remote 
        // value: "http://[[your.local.ip.address]]:1223/v3/zones" // Local


        ajax.url = 'https://hub-server-1.heatgenius.co.uk/v3/zone/' + event.detail.addr; // Remote
        // ajax.url = 'http://[[your.local.ip.address]]:1223/v3/zone/' + event.detail.addr; // Local

May be in a future release I'll may this a configuration option ina settings panel.

## Build the project
Download from Github. Run:

`bower install`

(this assumes you have bower and npm installed)

## To test locally
Run

`polymer serve --open`

## To build
Run

`polymer build`

## To host
Deploy the contents of the build directory required.

For more details about the Polymer-cli see [https://www.polymer-project.org/](https://www.polymer-project.org/)

Suggestions welcome for addition features to add.
