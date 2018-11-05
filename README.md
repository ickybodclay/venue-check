# Venue Check

Easily check what venues from your Google Calendar are available at a glance.

## Getting Started

Before attempting to run, you'll need to set some environment variables.  One way to easily do this is to create a __.env.local__ file:

__.env.local__
```
REACT_APP_GOOGLE_API_KEY=<YOUR_GOOGLE_API_KEY_HERE>
REACT_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID_HERE>
REACT_APP_KMSI=false
```

To get your own development API Key & OAuth client id, create a new app here:
https://console.cloud.google.com

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
        - Note: This will require Domain verification (https://www.google.com/webmasters/tools)
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

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm start`

For production builds, serves up the generated build folder.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.