# pattern-match-es

[Rust inspired](https://doc.rust-lang.org/book/ch18-03-pattern-syntax.html) pattern matching for JavaScript.

## Usage

Install:

```bash
npm i pattern-match-es --save
```

And then use like so:

```js
import match from 'pattern-match-es';
```

Or use via a CDN like [unpkg](https://unpkg.com/pattern-match-es?module):

```js
import match from 'https://unpkg.com/pattern-match-es?module';
```

## Examples

### Basic example

```js
const boolean = false;
const binary = match(boolean)(
  [false, () => 0],
  [true, () => 1]
);

binary; // 0
```

### Multiple values

```js
const num = 1;
match(num)(
  [1, 2, 3, 4, 5, () => { console.log('lower than 5') }],
  [6, () => { console.log('num is 6') }]
);

// "lower than 5"
```

### Default case

```js
const num = 5;
match(num)(
  [1, () => { console.log('num is 1') }],
  [2, () => { console.log('num is 2') }],
  [, () => { console.log('neither') }],
);

// "neither"
```

### Predicates

```js
const num = 9;
match(num)(
  [1, 2, 3, 4, 5, () => { console.log('lower than 5') }],
  [num => num > 6, () => { console.log('higher than 6') }],
);

// "higher than 6"
```

### Objects

```js
const user = { name: 'Steve' };
match(user)(
  [{ name: 'Steve' }, () => { console.log('Steve') }],
  [{ name: 'John' }, () => { console.log('Steve') }]
);

// "Steve"
```

### Arrays

```js
const array = [1, 2, 3];
match(user)(
  [[1, 2], () => { console.log('two items') }],
  [[1, 2, 3], () => { console.log('three items') }]
);

// "three items"
```
