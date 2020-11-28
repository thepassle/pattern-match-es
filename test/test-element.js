import { LitElement, html } from 'lit-element';
import match from '../index.js';

class TestElement extends LitElement {
  static get properties() {
    return {
      count: { type: Number }
    }
  }

  constructor() {
    super();
    this.count = 0;
  }

  inc() {
    this.count++;
  }

  dec() {
    this.count--;
  }

  render() {
    return match(this.count)(
      [0, () => html`count is 0`],
      [1, 2, 3, () => html`count is less than three`],
      [count => count < 0, () => html`count is negative`],
      [, () => html`count is more than three`],
    )
  }
}

customElements.define('test-element', TestElement);