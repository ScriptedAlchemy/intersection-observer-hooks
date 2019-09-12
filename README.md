


`import {useIntersectionObserver} from "intersection-observer-hooks"`

API:

`useIntersectionObserver(callback, nodeRef, options = {}) `

`callback`: returns a bool of when isIntersecting

`options`: Object <br>
`options.once`: observe once then unobserve
`options.rootMargin`: the root margin for intersection observer
`options.rootRef`: React ref

Example use:

```js
  useIntersectionObserver((visible) => {
    // then we are not at SSR
    ssr.current = false;
    setOffscreen(!visible);
    onVisibilitySet(visible);
  }, containerRef || ref, {
    once: true,
    rootMargin: '30%',
    rootRef,
  });
```
