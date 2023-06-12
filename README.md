# React Three Map

⚠️ **Alpha Warning: This library is currently in its alpha phase. While functional, it's still under active development and may have bugs. Please use with caution in production and feel free to report any issues you encounter. Thank you for your understanding!**


React Three Map seamlessly integrates three.js with Mapbox, allowing you to bring the power of 3D rendering to your maps.
This package offers a Three layer that allows you to use `@react-three/fiber` within `react-map-gl` and is compatible with both Mapbox and Maplibre.

## Installation

You can install React Three Map via npm:

```bash
npm install react-three-map
```


## Getting Started

Just add `<Canvas>` inside the map and start using R3F as usual :)

```jsx
import { ReactMapGL, StaticMap } from 'react-map-gl';
import { Canvas } from 'react-three-map';

<ReactMapGL {...viewport} >
  <Canvas>
    {/* Use react-three-fiber as usual in here */}
    <mesh>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color="orange" />
    </mesh>
  </Canvas>
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
- [ ] Support post processing.
- [ ] Support multiple coordinate transformations using only one ThreeJS renderer.