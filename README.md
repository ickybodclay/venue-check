# Venue Check

Easily check what venues from your Google Calendar are available at a glance.

## Getting Started

Before attempting to run, you'll need to set some environment variables.  One way to easily do this is to create a __.env.local__ file:

### .env.local

```conf
REACT_APP_GOOGLE_API_KEY=<YOUR_GOOGLE_API_KEY_HERE>
REACT_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID_HERE>
REACT_APP_KMSI=false
```

To get your own development API Key & OAuth client id, create a new app [here.](https://console.cloud.google.com)


Then do the following steps for your newly created app:

- Go to APIs & Services
  - Library
    - Enable `Google Calendar API`
  - Credentials
    - OAuth consent screen
      - Set Application name to `Venue Check`
      - Add the following scopes:
        - `../auth/calendar`
        - `../auth/calendar.readonly`
        - `../auth/calendar.events`
        - `../auth/calendar.events.readonly`
      - If you are attempting to run on your own heroku instance, be sure to add your app domain to this list of Authorized domains
        - (Ex. `venue-check.herokuapp.com`)
        - Note: This will require [Domain verification](https://www.google.com/webmasters/tools)
          - Replace `google-site-verification` meta tag in `public/index.html` with one you generate from the Search console
    - Create credentials
      - API Key
        - Name `API key 1`
      - OAuth client id
        - Name `Web client 1`
        - Set Authorized JavaScript origins to `http://localhost:3000`
        - Set Authorized redirect URIs to `http://localhost:3000`

## Available Scripts

In the project directory, you can run:

### `npm run clean`

Clean production build folder.

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Build production assets for release.  Publishes results to `dist/` folder.

### `npm run prodStart`

Starts an express server that serves up the production build.
