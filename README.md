# cacti-mobile

PWA app for cacti monitoring system with support for web push notifications.

## Settings
Copy inventory.example to inventory and edit server's hostname and credentials.

Copy .env.example to .env and edit app's options.

    cd deploy/
    cp inventory.example inventory
    cp .env.example .env

## Install dependencies
    npm install

## Build and deploy
    npm run build
    npm run deploy

## Dev commands
    npm run serve
    npm run tests
    npm run lint
    npm run stylelint

## Dev server
    
http://localhost:3000/