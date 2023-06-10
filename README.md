# React Three Map

React Three Map is an open source npm package that seamlessly integrates three.js with Mapbox, allowing you to bring the power of 3D rendering to your maps.
This package offers a Three layer that allows you to use `@react-three/fiber` within `react-map-gl` and is compatible with both Mapbox and Maplibre.

## Installation

You can install React Three Map via npm:

```bash
npm install react-three-map
```

## Features

- Declarative: React Three Map provides a declarative interface, making your code more predictable and easier to debug.
- 3D Rendering: Unlock the full potential of your maps with 3D rendering capabilities provided by three.js.
- Integration: Seamlessly integrates with Mapbox and Maplibre, enabling advanced mapping features.
- Uses `@react-three/fiber` to create and manage three.js objects.


## Getting Started

In order to get started with React Three Map, you will need to import it into your project:

```jsx
import { ReactThreeMap } from 'react-three-map';
```

From there, you can start using the React Three Map components within your existing `react-map-gl` components. Here is a basic usage example:

```jsx
import { ReactMapGL, StaticMap } from 'react-map-gl';
import { ReactThreeMap } from 'react-three-map';
import { Canvas } from '@react-three/fiber';

<ReactMapGL {...viewport} >
  <ReactThreeMap>
    <Canvas>
      {/* Here go your Three objects */}
      <mesh>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color="orange" />
      </mesh>
    </Canvas>
  </ReactThreeMap>
</ReactMapGL>
...
```

## Documentation

For a full API reference, more usage examples, and other information, check out the full React [Three Map Documentation](#todo).

## Contributing

We encourage you to contribute to React Three Map! Please check out the [Contributing to React Three Map guide](#todo) for guidelines about how to proceed.

## License

React Three Map is [MIT licensed](#todo).

## Support

f you're having a problem with anything related to this library, we encourage you to reach out to us. We're always happy to help resolve issues and answer any questions you might have. Open an issue on our [Github repo](#todo).

Remember to always follow the Code of Conduct when interacting with the community.

## Enjoy Using React Three Map!

We hope that you enjoy using React Three Map as much as we enjoyed building it. Happy coding!

## Roadmap

- [ ] Use ThreeJS as a Map Layer.
- [ ] Use ThreeJS as a canvas overlay.
- [ ] Add stencil buffers to occlude from the map.
- [ ] Fully decompose the projection matrix into all the Camera properties required.