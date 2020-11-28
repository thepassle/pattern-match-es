import { expect, html, fixture } from '@open-wc/testing';
import { spy } from 'hanbi';
import { initialState, todoApp } from './test-reducer.js';
import match from '../index.js';
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

  describe('objects', () => {
    it('matches objects', () => {
      const callbackSpy = spy();

      match({a: 'a'})(
        [{a: 'a'}, callbackSpy.handler],
        [{b: 'b'}, () => {}],
      );
      expect(callbackSpy.called).to.equal(true);
    });

    it('returns correctly', () => {
      const result = match({a: 'a'})(
        [{a: 'a'}, () => true],
        [{b: 'b'}, () => false],
      );
      expect(result).to.equal(true);
    });

    it('handles default case correctly', () => {
      const defaultSpy = spy();

      match({c: 'c'})(
        [{a: 'a'}, () => {}],
        [{b: 'b'}, () => {}],
        [, defaultSpy.handler],
      );
      expect(defaultSpy.called).to.equal(true);
    });

    it('handles nested objects', () => {
      const defaultSpy = spy();
      const obj = {
        a: {
          b: 'b'
        }
      };

      match(obj)(
        [{a: 'a'}, () => {}],
        [{ a: { b: 'b'}}, defaultSpy.handler],
        [, () => {}],
      );
      expect(defaultSpy.called).to.equal(true);
    });
  });

  describe('arrays', () => {
    it('matches arrays', () => {
      const callbackSpy = spy();

      match([1, 2])(
        [[1, 2], callbackSpy.handler],
        [[1], () => {}],
      );
      expect(callbackSpy.called).to.equal(true);
    });

    it('returns correctly', () => {
      const result = match([1, 2])(
        [[1, 2], () => true],
        [[1], () => false],
      );
      expect(result).to.equal(true);
    });

    it('handles default case correctly', () => {
      const defaultSpy = spy();

      match([1, 2])(
        [[1], () => {}],
        [[2], () => {}],
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

  describe('reducer', () => {
    const addTodoAction = { type: 'add-todo', text: 'write unit tests' };
    const toggleAction = { type: 'toggle-todo', index: 0 };
    const filterAction = { type: 'set-visibility-filter', filter: 'done' };
    const unknownAction = { type: 'foo' };

    it('adds a todo', () => {
      expect(todoApp(initialState, addTodoAction)).to.deep.equal({
        filter: 'all',
        todos: [
          { 
            text: 'Finish demos', 
            done: false
          },
          { 
            text: 'write unit tests', 
            done: false
          },
        ]
      })
    });

    it('toggles a todo', () => {
      expect(todoApp(initialState, toggleAction)).to.deep.equal({
        filter: 'all',
        todos: [
          { 
            text: 'Finish demos', 
            done: true
          }
        ]
      })
    });

    it('sets visibility filter', () => {
      expect(todoApp(initialState, filterAction)).to.deep.equal({
        filter: 'done',
        todos: [
          { 
            text: 'Finish demos', 
            done: false
          }
        ]
      })
    });

    it('returns the same state on default case', () => {
      expect(todoApp(initialState, unknownAction)).to.deep.equal({
        filter: 'all',
        todos: [
          { 
            text: 'Finish demos', 
            done: false
          }
        ]
      })
    });
  });
});