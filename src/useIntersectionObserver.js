import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

let bulkOperations = [];

function executeInBulk() {
  const ops = bulkOperations;
  bulkOperations = [];
  ReactDOM.unstable_batchedUpdates(() => ops.forEach(op => op()));
}

export function useBatched(callback) {
  if (!bulkOperations.length) {
    setTimeout(executeInBulk, 1);
  }
  bulkOperations.push(callback);
}
const withIntersectionObserver = (cb) => {
  if ('IntersectionObserver' in window) {
    Promise.resolve(window.IntersectionObserver).then(cb);
  } else {
    // Require the polyfill before requiring any other modules.
    // eslint-disable-next-line global-require
   require('intersection-observer');
  }
};

const useIntersectionObserver = (callback, nodeRef, options = {}) => {
  const [node, setNode] = useState(nodeRef.current);
  const lastState = useRef(undefined);

  useEffect(() => {
    if (node !== nodeRef.current) {
      setNode(nodeRef.current);
    }
  }, [nodeRef.current]);

  useEffect(() => {
    let observer;
    let canceled = false;
    if (node) {
      withIntersectionObserver((Observer) => {
        if (canceled) {
          return;
        }
        observer = new Observer((entries) => {
          entries.forEach(({ isIntersecting, target }) => {
            if (nodeRef.current === target) {
              if (lastState.current !== isIntersecting) {
                lastState.current = isIntersecting;
                useBatched(() => callback(isIntersecting));
              }
            }
            if (isIntersecting && options.once) {
              observer.unobserve(node);
            }
          });
        }, {
          rootMargin: options.rootMargin,
          root: options.rootRef ? options.rootRef.current : undefined,
        });

        observer.observe(node);
      });
    }

    return () => {
      canceled = true;
      if (observer) {
        observer.disconnect();
      }
    };
  }, [node, options.rootMargin, ...(options.deps || [])]);
};

export default useIntersectionObserver;
