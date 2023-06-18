# React Three Map

[![Version](https://img.shields.io/npm/v/react-three-map?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/@react-three/fiber)


⚠️ **Alpha Warning: This library is currently in its alpha phase. While functional, it's still under active development and may have bugs. Please use with caution in production and feel free to report any issues you encounter. Thank you for your understanding!**

`react-three-map` is a bridge to use [`react-three-fiber`](https://github.com/pmndrs/react-three-fiber) inside [`react-map-gl`](https://github.com/visgl/react-map-gl).

Until now you had:

| imperative | declarative (react) |
| --- | --- |
| Mapbox GL JS | react-map-gl |
| THREE.js | react-three-fiber |

Now with `react-three-map`, you can use them together :fist_right::fist_left:.

```sh
npm install react-three-map
```

Find use examples in our [Stories :book:](https://rodrigohamuy.github.io/react-three-map).

## What does it look like?


<table>
  <tbody>
    <tr>
      <td>Let's build the same <code>react-three-fiber</code> basic example, but now it can be inside a map. (<a href="https://codesandbox.io/p/sandbox/vigorous-snyder-2n9vpl?file=%2Fsrc%2FApp.tsx%3A48%2C45">live demo</a>).</td>
      <td>
        <a href="https://codesandbox.io/p/sandbox/vigorous-snyder-2n9vpl?file=%2Fsrc%2FApp.tsx%3A48%2C45">
          <img src="docs/basic-app.gif" />
        </a>
      </td>
    </tr>
  </tbody>
</table>

1. Import `Canvas` from `react-three-map` instead of `@react-three/fiber`.
2. Give it a latitude and longitude so it knows where to position the scene in the map.
3. Everything else should work just as usual.

```jsx
import "maplibre-gl/dist/maplibre-gl.css"
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import Map from "react-map-gl/maplibre"
import { Canvas } from "react-three-map"

function BasicExample() {
  return <Map
    antialias
    initialViewState={{
      latitude: 51,
      longitude: 0,
      zoom: 13,
      pitch: 60
    }}
    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  >
    <Canvas latitude={51} longitude={0}>
      <hemisphereLight
        args={["#ffffff", "#60666C"]}
        position={[1, 4.5, 3]}
      />
      <object3D scale={500}>
        <Box position={[-1.2, 1, 0]} />
        <Box position={[1.2, 1, 0]} />
      </object3D>
    </Canvas>
  </Map>
}
```

# Why we build this?

Look [how complex](https://maplibre.org/maplibre-gl-js-docs/example/add-3d-model/) is to add just one ThreeJS object to a map.

Look [how complex](https://docs.pmnd.rs/react-three-fiber/api/canvas#createroot) is to create your custom root for R3F.

You can now replace all that complexity and hundreds of lines of code with the `<Canvas>` component exported by `react-three-map`, which includes a tone of extra features and seamless integration, supporting pointer events, raycasting, and much more, all out of the box.