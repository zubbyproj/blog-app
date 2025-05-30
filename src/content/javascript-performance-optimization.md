---
title: "JavaScript Performance Optimization"
date: "2024-02-15"
excerpt: "Learn essential techniques to make your JavaScript code faster and more efficient"
imageUrl: "/images/js-performance.jpg"
---

# JavaScript Performance Optimization

Performance is crucial for modern web applications. Let's explore techniques to optimize your JavaScript code for better performance.

## 1. Efficient Data Structures

Choose the right data structure for your use case:

```javascript
// Bad: Searching in array
const users = ['John', 'Jane', 'Bob'];
const hasUser = users.indexOf('Jane') !== -1; // O(n)

// Good: Using Set for lookups
const userSet = new Set(['John', 'Jane', 'Bob']);
const hasUser = userSet.has('Jane'); // O(1)

// Bad: Array as dictionary
const userAges = [];
userAges[userId] = 25; // Sparse array, memory inefficient

// Good: Using Map
const userAges = new Map();
userAges.set(userId, 25);
```

## 2. Debouncing and Throttling

Control the rate of function execution:

```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const handleSearch = debounce((event) => {
  // Expensive API call
  fetchSearchResults(event.target.value);
}, 300);

searchInput.addEventListener('input', handleSearch);
```

## 3. Virtual Lists for Large Data

Render only visible items:

```javascript
function VirtualList({ items, itemHeight, windowHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(windowHeight / itemHeight),
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div
      style={{ height: `${items.length * itemHeight}px`, position: 'relative' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
        {visibleItems.map(item => (
          <div key={item.id} style={{ height: itemHeight }}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 4. Memory Management

Prevent memory leaks:

```javascript
class EventEmitter {
  constructor() {
    this.listeners = new WeakMap();
  }

  addEventListener(element, event, callback) {
    element.addEventListener(event, callback);
    
    // Use WeakMap to allow garbage collection
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }
    this.listeners.get(element).set(event, callback);
  }

  removeEventListener(element, event) {
    const callback = this.listeners.get(element)?.get(event);
    if (callback) {
      element.removeEventListener(event, callback);
      this.listeners.get(element).delete(event);
    }
  }
}
```

## 5. Code Splitting and Lazy Loading

Load code only when needed:

```javascript
// Bad: Loading everything upfront
import HeavyComponent from './HeavyComponent';

// Good: Lazy loading
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## 6. Web Workers for Heavy Computation

Move intensive tasks off the main thread:

```javascript
// worker.js
self.onmessage = function(e) {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};

// main.js
const worker = new Worker('worker.js');

worker.onmessage = function(e) {
  console.log('Computation result:', e.data);
};

worker.postMessage(data);
```

## Best Practices

1. **Measure First**
   - Use Performance API
   - Profile with Chrome DevTools
   - Set performance budgets

2. **Optimize Rendering**
   - Use requestAnimationFrame
   - Avoid layout thrashing
   - Batch DOM updates

3. **Resource Loading**
   - Use async/defer for scripts
   - Implement progressive loading
   - Cache appropriately

## Conclusion

Performance optimization is an ongoing process. Always measure before optimizing and focus on improvements that provide the best user experience for your specific application. 