import { OrbitControls, Plane as PlaneDrei } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AlwaysStencilFunc, BackSide, DecrementWrapStencilOp, DoubleSide, FrontSide, IncrementWrapStencilOp, NotEqualStencilFunc, Plane, ReplaceStencilOp, TorusKnotGeometry, Vector3 } from 'three';

const planes = [new Plane(new Vector3(0, -1, 0), 0.8)];
const geometry = new TorusKnotGeometry(0.4, 0.15, 220, 60);

const Scene = () => {

  return (
    <>
      <object3D name="object">
        <object3D name="stencilGroup 0">
          <mesh geometry={geometry} renderOrder={1}>
            <meshBasicMaterial
              depthWrite={false}
              depthTest={false}
              colorWrite={false}
              stencilWrite={true}
              side={BackSide}
              clippingPlanes={planes}
              stencilFunc={AlwaysStencilFunc}
              stencilFail={IncrementWrapStencilOp}
              stencilZFail={IncrementWrapStencilOp}
              stencilZPass={IncrementWrapStencilOp}
            />
          </mesh>
          <mesh geometry={geometry} renderOrder={1}>
            <meshBasicMaterial
              depthWrite={false}
              depthTest={false}
              colorWrite={false}
              stencilWrite={true}
              side={FrontSide}
              clippingPlanes={planes}
              stencilFunc={AlwaysStencilFunc}
              stencilFail={DecrementWrapStencilOp}
              stencilZFail={DecrementWrapStencilOp}
              stencilZPass={DecrementWrapStencilOp}
            />
          </mesh>
        </object3D>
        <mesh name="clippedColorFront" geometry={geometry}>
          <meshStandardMaterial
            color={0xFFC107}
            metalness={0.1}
            roughness={0.75}
            clippingPlanes={planes}
            clipShadows={true}
            shadowSide={DoubleSide}
          />
        </mesh>
      </object3D>
      <object3D name='poGroup'>
        <PlaneDrei name='po 0'
          args={[4, 4]}
          renderOrder={1.1}
          material-color={0xE91E63}
          material-metallness={0.1}
          material-roughness={0.75}
          material-clippingPlanes={[]} // others
          material-stencilWrite={true}
          material-stencilRef={0}
          material-stencilFunc={NotEqualStencilFunc}
          material-stencilFail={ReplaceStencilOp}
          material-stencilZFail={ReplaceStencilOp}
          material-stencilZPass={ReplaceStencilOp}
          onAfterRender={(renderer) => {
            renderer.clearStencil();
          }}
        />
      </object3D>
    </>
  );
};

export const Default = () => {
  return (
    <Canvas
      gl={{ antialias: true, localClippingEnabled: true }}
      camera={{ position: [0, 0, 5] }}
      style={{ height: '100vh', width: '100%' }}
      shadows
    >
      <axesHelper args={[500]} />
      <OrbitControls />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 7.5]} intensity={3} />
      <Scene />
    </Canvas>
  );
}
