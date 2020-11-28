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

### Handling responses

```js
const res = await fetch('https://swapi.dev/api/people/');
match(res.status)(
  [200, () => console.log('ok')],
  [404, () => console.log('not found')],
  [status > status >= 400, () => console.log('uh oh')],
)
```


### With Preact

```js
import { html, render, useState } from 'https://unpkg.com/htm/preact/standalone.module.js'
import match from 'https://unpkg.com/pattern-match-es@0.0.2/index.js?module';

function MyApp() {
  const [count, setCount] = useState(0);

  return html`
    <button onClick="${() => setCount(count - 1)}">-</button>
    <span>
      ${match(count)(
        [0, () => html`0`],
        [1, 2, 3, () => html`less than three`],
        [count => count < 0, () => html`negative`],
        [, () => html`more than three`],
      )}
    </span>
    <button onClick="${() => setCount(count + 1)}">+</button>
  `;
}

render(html`<${MyApp}/>`, document.body);
```

### With LitElement

```js
import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import match from 'https://unpkg.com/pattern-match-es/index.js?module';

const loadingTemplate = () => html`Loading...`;

class MyElement extends LitElement {
  static get properties() {
    return { state: { type: String } };
  }

  async connectedCallback() {
    super.connectedCallback();
    this.state = 'loading';
    try {
      await fetch("https://swapi.dev/api/people/1");
      this.state = 'success';
    } catch {
      this.state = 'error';
    }
  }

  render() {
    return match(this.state)(
      ['loading', loadingTemplate],
      ['error', () => html`<h1>☹️ Error!</h1>`],
      ['success', () => html`<h1>🎉 Success!</h1>`],
    )
  }
}
```

### Redux reducers

```js
const initialState = { 
  filter: 'all',
  todos: [
    { 
      text: 'Finish demos', 
      done: false
    }
  ]
}

const options = { type: undefined, filter: undefined, index: undefined, text: undefined };

function todoApp(state = initialState, {type, filter, index, text}) {
  return match({type, filter, index, text})(
    [{...options, type: 'set-visibility-filter', filter}, () => (
      {
        ...state, filter
      }
    )],
    [{...options, type: 'add-todo', text}, () => (
      {
        ...state, 
        todos: [...state.todos, {text, done: false}]
      }
    )],
    [{...options, type: 'toggle-todo', index}, () => (
      {
        ...state,
        todos: state.todos.map((todo, idx) => idx === index
          ? {...todo, done: !todo.done}
          : todo
        )
      }
    )],
    [, () => state]
  )
}
```