import { expect, html, fixture } from '@open-wc/testing';
import { spy } from 'hanbi';
import match from '../lite/index.js';
import './test-element.js';

describe('match', () => {
  describe('primitives', () => {
    it('matches booleans', () => {
      const boolean = false;
      const binary = match(boolean)(
        [false, () => 0],
        [true, () => 1]
      );
      expect(binary).to.equal(0);
    });

    it('matches nothing', () => {
      const boolean = 5;
      match(boolean)(
        [false, () => 0],
        [true, () => 1]
      );
      expect(true).to.equal(true);
    });

    it('matches numbers', () => {
      const result = match(1)(
        [1, () => 1],
        [2, () => 2],
      );
      expect(result).to.equal(1);
    });

    it('can match out of multiple numbers', () => {
      const result = match(2)(
        [1, 2, 3, () => 'less than three'],
        [4, () => 'more than three'],
      );
      expect(result).to.equal('less than three');
    });

    it('handles default case', () => {
      const defaultSpy = spy();

      match(2)(
        [1, () => 1],
        [, defaultSpy.handler],
      );
      expect(defaultSpy.called).to.equal(true);
    });
  });

  describe('predicates', () => {
    it('handles predicates', () => {
      const defaultSpy = spy();

      match(8)(
        [1, () => { console.log('lower than 5') }],
        [num => num > 6, defaultSpy.handler],
      );
      expect(defaultSpy.called).to.equal(true);
    });
  });

  describe('lit-element', () => {
    it('renders the correct template', async () => {
      const el = await fixture(html`<test-element></test-element>`);
      expect(el.shadowRoot.textContent).to.equal("count is 0");

      el.dec();
      await el.updateComplete;
      expect(el.shadowRoot.textContent).to.equal("count is negative");
      
      el.inc();
      el.inc();
      el.inc();
      await el.updateComplete;
      expect(el.shadowRoot.textContent).to.equal("count is less than three");
      
      el.inc();
      el.inc();
      await el.updateComplete;
      expect(el.shadowRoot.textContent).to.equal("count is more than three");
    });
  });
});