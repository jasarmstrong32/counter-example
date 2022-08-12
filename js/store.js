import { database } from './database.js';

// See https://codepen.io/Snugug/pen/MWVGbRb for fully documented example
// Export the base class in case we want to create multiple stores
export class StoreSetup {
  constructor(init = {}) {
    const self = this;
    this.subscribers = [];

    // Because opening the database is asynchronous (a Promise),
    //  we need to wait for it to resolve, then we can set it up in our constructor
    database.then(async (db) => {
      // Make the database reusable from within the store
      this.db = db;
      // Check if there was a previous state
      const previous = await db.get('counts', 'state');
      if (previous) {
        // If there was, go through each key and value and re-set it
        for (const [key, val] of Object.entries(previous)) {
          this.set(key, val);
        }
      }
    });

    this.state = new Proxy(init, {
      async set(state, key, value) {
        state[key] = value;
        if (key !== 'total') {
          state.total = (state.total || 0) + 1;
        }

        // Check to see if the database exists, and if it does, put the current state into it. This will add it to our IndexedBD
        if (self.db) {
          await self.db.put('counts', state, 'state');
        }

        self.subscribers.forEach((subscriber) => subscriber(state));
        return true;
      },
    });
  }
  subscribe(cb) {
    if (typeof cb !== 'function') {
      throw new Error('You must subscribe with a function');
    }
    this.subscribers.push(cb);
    cb(this.state);
  }
  set(key, value) {
    this.state[key] = value;
  }
  get(key) {
    return this.state[key];
  }

  increment() {
    this.set('number', (this.get('number') || 0) + 1);
  }
  decrement() {
    this.set('number', (this.get('number') || 0) - 1);
  }
  reset() {
    this.set('number', 0);
    this.set('total', 0);
  }
}

// Export an initialized store for easy use across the project
export const store = new StoreSetup({ number: 0, total: 0 });
