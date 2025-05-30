---
title: "Modern State Management with Redux Toolkit"
date: "2024-02-12"
excerpt: "Learn how to effectively manage application state using Redux Toolkit"
imageUrl: "/images/redux-toolkit.jpg"
---

# Modern State Management with Redux Toolkit

Redux Toolkit is the official, opinionated toolset for efficient Redux development. Let's explore how to use it effectively.

## Getting Started

First, set up your store:

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import todoReducer from './todoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Creating Slices

Use `createSlice` to define your reducers and actions:

```typescript
// store/todoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
```

## Async Operations with createAsyncThunk

Handle asynchronous operations efficiently:

```typescript
// store/todoSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch todos');
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // ... other reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
```

## Custom Hooks for Redux

Create typed hooks for better TypeScript support:

```typescript
// hooks/useRedux.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Using Redux in Components

Implement Redux in your React components:

```typescript
// components/TodoList.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchTodos, addTodo, toggleTodo, removeTodo } from '../store/todoSlice';

export function TodoList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(state => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = (text: string) => {
    dispatch(addTodo({
      id: Date.now().toString(),
      text,
      completed: false,
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={() => handleAddTodo('New Todo')}>Add Todo</button>
      {items.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => dispatch(removeTodo(todo.id))}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Redux Middleware

Create custom middleware for logging or analytics:

```typescript
// store/middleware/logger.ts
import { Middleware } from '@reduxjs/toolkit';

export const loggerMiddleware: Middleware = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

// Add to store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});
```

## Best Practices

1. **State Structure**
   - Keep state normalized
   - Use entity adapters for collections
   - Minimize nested state

2. **Performance**
   - Use memoization with `createSelector`
   - Avoid unnecessary re-renders
   - Split state logically

3. **Type Safety**
   - Leverage TypeScript
   - Use proper type annotations
   - Create typed hooks

## RTK Query

For data fetching and caching:

```typescript
// store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => 'todos',
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (todo) => ({
        url: 'todos',
        method: 'POST',
        body: todo,
      }),
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation } = api;
```

## Conclusion

Redux Toolkit simplifies Redux development by providing utilities for common use cases and enforcing best practices. By following these patterns, you can build scalable and maintainable applications with efficient state management. 