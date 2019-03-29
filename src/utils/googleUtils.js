export function getGoogleApiKey() {
  console.log("Google API key: " + process.env.REACT_APP_GOOGLE_API_KEY);
  return process.env.REACT_APP_GOOGLE_API_KEY;
}

export function getGoogleClientId() {
  console.log("Google Client ID: " + process.env.REACT_APP_GOOGLE_CLIENT_ID);
  return process.env.REACT_APP_GOOGLE_CLIENT_ID;
}
