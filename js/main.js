import './components/click-counter.js';
import './components/total-coutner.js';

import { store } from './store.js';

document.addEventListener('DOMContentLoaded', () => {
  const add = document.querySelector('#add');
  const subtract = document.querySelector('#subtract');

  add.addEventListener('click', () => {
    store.increment();
  });
  subtract.addEventListener('click', () => {
    store.decrement();
  });
});
