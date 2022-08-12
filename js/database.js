import { openDB } from 'idb';

export const database = openDB('counter', 1, {
  upgrade(db) {
    db.createObjectStore('counts');
  },
});
