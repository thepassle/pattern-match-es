import { expect } from '@open-wc/testing';
import { match } from '../index.js';
import { spy } from 'hanbi';

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
});