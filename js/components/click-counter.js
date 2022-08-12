import { store } from '../store.js';

// See https://codepen.io/Snugug/pen/MWVGbRb for fully documented example
class ClickCounter extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('counter').content.cloneNode(true);
    shadow.append(template);
    this.counter = this.shadowRoot.querySelector('.counter');
  }
  static get observedAttributes() {
    return ['number'];
  }
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (property === 'number' && this.counter) {
      this.counter.textContent = newValue;
    }
  }
  connectedCallback() {
    store.subscribe((current) => {
      this.setAttribute('number', current.number);
    });
  }
}

// Checks to see if the click counter element has been defined and if it hasn't, define it.
// This will let us import this multiple times and not worry about trying to define the component multiple times
if (customElements.get('click-counter') === undefined) {
  customElements.define('click-counter', ClickCounter);
}
