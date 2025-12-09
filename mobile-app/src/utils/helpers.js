// 1. myMap: custom map (no built-in map)
export function myMap(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

// 2. myFilter: custom filter (no built-in filter)
export function myFilter(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

// 3. myReduce: custom reduce (no built-in reduce)
export function myReduce(array, callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (accumulator === undefined) {
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }

  return accumulator;
}

// 4. debounce: wait until user stops typing
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// 5. throttle: allow function only every "delay" ms
export function throttle(fn, delay) {
  let lastCall = 0;
  let timeoutId;

  return (...args) => {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      // ensure last call runs after delay
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, remaining);
    }
  };
}

// 6. groupBy: group array items by key or function
// Example: groupBy(todos, "status") -> { pending: [...], completed: [...] }
export function groupBy(array, key) {
  const result = {};
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const groupKey =
      typeof key === "function"
        ? key(item)
        : item[key];

    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }
  return result;
}

// 7. apiFetch: simple wrapper for fetch with loading + error
export async function apiFetch(url) {
  const result = {
    data: null,
    loading: true,
    error: null,
  };

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    result.data = await res.json();
  } catch (err) {
    result.error = err.message || "Something went wrong";
  } finally {
    result.loading = false;
  }

  return result;
}
