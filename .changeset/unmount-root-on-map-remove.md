---
"react-three-map": patch
---

Unmount the `<Canvas overlay={false}>` root when the map is removed, so it no longer leaks after the whole map unmounts.
