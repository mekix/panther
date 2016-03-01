import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import {
  SELECT_ARTIST,
  markArtistAsSelected,
  fadeAndRemoveNodes,
  positionSelectedArtistToCenter
} from '../ducks/graph.duck';


// an utility function: return a Promise that will resolve after 1 second
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


// When we click a node, a bunch of stuff needs to happen:
//   - immediately fade out the NON-clicked nodes, over N1 ms.
//   - immediately fetch the artist info from Spotify.
//   - immediately fetch the artist's related artists.
//   - after N1ms, reposition the nodes so that the clicked one is centered.
//      this action should take N2ms
//   - after N1+N2ms, IF the artist info is available, show the artist data.
//     If not, wait until it is and then perform immediately.

// Our worker saga. It does the actual orchestration
export function* selectArtist(action) {
  yield put(markArtistAsSelected(action.node));
  yield delay(350);
  yield put(positionSelectedArtistToCenter());
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchSelectArtist() {
  yield* takeEvery(SELECT_ARTIST, selectArtist)
}