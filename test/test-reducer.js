import match from '../index.js';

export const initialState = { 
  filter: 'all',
  todos: [
    { 
      text: 'Finish demos', 
      done: false
    }
  ]
}

const options = { 
  type: undefined, 
  filter: undefined, 
  index: undefined, 
  text: undefined 
};

export function todoApp(state = initialState, {type, filter, index, text}) {
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