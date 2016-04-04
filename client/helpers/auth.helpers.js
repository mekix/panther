import noop from 'lodash/noop';

import { fetchAccessToken } from './api.helpers';


const TOKEN_KEY = 'panther-audio-access-token';
let isFetching  = false;

export function getAccessToken(callback = noop) {
  // To make authenticated requests to Spotify (and benefit from a higher rate-
  // limit), we need to proxy a request for an access token through our server.
  // The first step is to check if we already have it, in localStorage.
  const storedToken = localStorage.getItem(TOKEN_KEY);

  // If we already have it, and it isn't expired, no need for a server request.
  // TODO: Check expiration. Decide on format.
  if ( storedToken ) {
    // Wrapping this in a setTimeout, so that this function is always async.
    // For predictability and to avoid JS weirdness.
    return window.setTimeout( () => callback(storedToken) )
  }

  // BLock concurrent requests.
  // When the app first loads, this function is invoked to fetch the token.
  // Let's imagine, though, that the server is slow, and the user starts trying
  // to use the app before the original request has resolved.
  // In that case, we don't want to create a new request for a token, since
  // we'll have one shortly. Instead, just return early.
  // This works, because the access token is _optional_. We can make
  // unauthenticated requests if we really need to.
  if ( isFetching ) return callback(null);

  isFetching = true;

  // Make a request to our back-end to generate a token.
  fetchAccessToken()
    .then( token => {
      localStorage.setItem(TOKEN_KEY, token);
      return callback(token);
    })
    .catch( err => console.error("Error fetching token from server", err) )
    .finally( () => isFetching = false );
}