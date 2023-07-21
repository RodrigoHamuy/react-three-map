# ![logo](public/favicon.svg)React Three Map

[![Repository](https://img.shields.io/static/v1?&message=github&style=flat&colorA=000000&colorB=000000&label=&logo=github&logoColor=ffffff)](https://github.com/RodrigoHamuy/react-three-map)
[![Version](https://img.shields.io/npm/v/react-three-map?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/react-three-map)
[![Build Size](https://img.shields.io/bundlephobia/minzip/react-three-map?label=size&?style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=react-three-map)
[![Stories](https://img.shields.io/badge/stories-stories?colorA=000&colorB=000000&logo=maplibre)](https://rodrigohamuy.github.io/react-three-map/?story=canvas--a-maplibre-example)
[![Build Status](https://img.shields.io/github/actions/workflow/status/RodrigoHamuy/react-three-map/release.yml?branch=main&style=flat&colorA=000000)](https://github.com/RodrigoHamuy/react-three-map/actions?query=workflow%3Arelease)

`react-three-map` is a bridge to use [`react-three-fiber`](https://github.com/pmndrs/react-three-fiber) inside [`react-map-gl`](https://github.com/visgl/react-map-gl).

Until now you had:

| imperative | declarative (react)    |
| --------------- | ----------------- |
| Maplibre/Mapbox | react-map-gl      |
| THREE.js        | react-three-fiber |

Now with `react-three-map`, you can use them together :fist_right::star::fist_left:.

```sh
npm install react-three-map
```

## :book: Examples

Check out our examples [here](https://rodrigohamuy.github.io/react-three-map) (powered by [Ladle](https://ladle.dev/)).

## :mag: What does it look like?


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
import { Canvas } from "react-three-map/maplibre" 
// import { Canvas } from "react-three-map" // if you are using MapBox

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

## :thinking: Why we build this?

Look [how complex](https://maplibre.org/maplibre-gl-js-docs/example/add-3d-model/) is to add just one ThreeJS object to a map.

Look [how complex](https://docs.pmnd.rs/react-three-fiber/api/canvas#createroot) is to create your custom root for R3F.

You can now replace all that complexity and hundreds of lines of code with the `<Canvas>` component exported by `react-three-map`, which includes a tone of extra features and seamless integration, supporting pointer events, raycasting, and much more, all out of the box.

## :gear: API

### Canvas

Same as in `@react-three/fiber`, the `<Canvas>` object is where you start to define your React Three Fiber Scene. 

```tsx
import "maplibre-gl/dist/maplibre-gl.css"
import Map from "react-map-gl/maplibre"
import { Canvas } from 'react-three-map/maplibre'
// import { Canvas } from "react-three-map" // if you are using MapBox

const App = () => (
  <Map 
    initialViewState={{ latitude: 51, longitude: 0, zoom: 13 }} 
    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" >
    <Canvas latitude={51} longitude={0}>
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>
  </Map>
)
```

It shares most of the props from R3F `<Canvas>`, so you can check them directly in the [`@react-three/fiber` docs](https://docs.pmnd.rs/react-three-fiber/api/canvas). There are a few important exceptions though, which are mentioned bellow.

#### Render Props

| Prop       | Description                                      | Default    |
| ---------  | ------------------------------------------------ | ---------- |
| latitude   | The latitude coordinate where to add the scene.  |            |
| longitude  | The longitude coordinate where to add the scene. |            |
| altitude   | The altitude coordinate where to add the scene.  | `0`        |
| frameloop  | Render mode: `"always"`, `"demand"`.             | `"always"` |

#### Render Props removed from `@react-three/fiber`

Because the scene now lives in a map, we leave a lot of the render and camera control to the map, rather than to R3F.

Therefore, the following `<Canvas>` props are ignored:

- gl
- camera
- resize
- orthographic
- dpr

### Coordinates

[![Coordinates example](docs/coordinates.png)](https://rodrigohamuy.github.io/react-three-map/?story=multi-coordinates--default)

This component allows you to have 3D objects at different coordinates.


```tsx
import { Canvas, Coordinates } from 'react-three-map'

<Canvas latitude={51} longitude={0}>
  <Coordinates latitude={50} longitude={0}>
    <mesh><sphereGeometry /></mesh>
  </Coordinates>
  <Coordinates latitude={52} longitude={0}>
    <mesh><sphereGeometry /></mesh>
  </Coordinates>
</Canvas>
```

| Props       | Description                                      | Default    |
| ---------  | ------------------------------------------------ | ---------- |
| latitude   | The latitude coordinate where to add the scene.  |            |
| longitude  | The longitude coordinate where to add the scene. |            |
| altitude   | The altitude coordinate where to add the scene.  | `0`        |

### useMap

Access the map from inside `react-three-map`.

```tsx
import { useMap } from "react-three-map";
// import { useMap } from "react-three-map/maplibre"; if you use maplibre
const Component = () => {
  const map = useMap();
  return <>...</>
}

```