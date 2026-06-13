---
"react-three-map": patch
---

Fix hover/raycast inaccuracy by deriving the pointer-event ray origin from the cursor position. The ray origin was being unprojected from a fixed NDC point that ignored the cursor, producing a skewed ray whose error grew towards the edges of the map.
