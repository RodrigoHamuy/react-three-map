import { Billboard, Box, Line, Plane, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import { AxesHelper, DoubleSide, MathUtils, Matrix4, Mesh, Object3D, Vector3 } from "three";
import { StoryMap } from "./story-map";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";

export function Default() {

  const [hovered, hover] = useState(false);

  return <StoryMap latitude={51} longitude={0} zoom={20} pitch={0}>
    {/* <Text fontSize={17} color="#2592a8" scale={10} rotation={[-90*MathUtils.DEG2RAD,0,0]}>0</Text>
    <Text fontSize={17} color="#2592a8" scale={10} rotation={[-90*MathUtils.DEG2RAD,0,0]} position={[0,3000,0]}>3000</Text> */}
    {/* <MyBox /> */}
    <axesHelper args={[10]} position={[10,0,0]}/>
    <axesHelper args={[10]} position={[0,0,0]}/>
    {/* <CamPos /> */}
    {/* <axesHelper args={[500]} /> */}
    <Billboard>
      <Plane
        args={[10, 10, 10]}
        position={[0, 10, 0]}
        rotation={[0, 0, 0]}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        material-color={hovered ? 'purple' : 'orange'}
      />
      {/* <Box
        args={[10, 10, 10]}
        position={[0, 10, 0]}
        rotation={[0, 0, 0]}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        material-color={hovered ? 'purple' : 'orange'}
      /> */}
    </Billboard>
  </StoryMap>
}

const rotObj = new Object3D();

const CamPos = () => {
  const cam = useThree(s=>s.camera);
  const ref = useRef<AxesHelper>(null);
  const {camPos} = useControls({camPos: true});
  useFrame(()=>{
    if(!camPos) return;
    if(!ref.current) return;

    updateCamera(ref.current, cam.projectionMatrixInverse);

    // get camera pos
    // ref.current.position
    //   .setScalar(0)
    //   .applyMatrix4(cam.projectionMatrixInverse);
    
    // // get camera up vector
    // const center = new Vector3().applyMatrix4(cam.projectionMatrixInverse);
    // const top = new Vector3(0,1,0).applyMatrix4(cam.projectionMatrixInverse);
    // rotObj.up.copy(center).sub(top).normalize();

    // // get camera rotation
    // const forward = new Vector3(0,0,-1).applyMatrix4(cam.projectionMatrixInverse);
    // rotObj.position.set(0,0,1).applyMatrix4(cam.projectionMatrixInverse);
    // rotObj.lookAt(forward);
    // ref.current.quaternion.copy(rotObj.quaternion);


  }, -1)
  return <>
    <axesHelper ref={ref} args={[300]} />
    {!camPos && <Line points={[[0,0,0], ref.current!.position.toArray()]} />}
  </>
}

const MyBox = () => {
  const ref = useRef<Mesh>(null)
  const cam = useThree(s=>s.camera);
  const {follow} = useControls({follow: true});
  const lookAt = useRef<AxesHelper>(null);
  useFrame(()=>{
    if(!ref.current) return;
    if(!lookAt.current) return;
    if(!follow) return;
    const center = new Vector3().applyMatrix4(cam.projectionMatrixInverse);
    const top = new Vector3(0,1,0).applyMatrix4(cam.projectionMatrixInverse);
    ref.current.up.copy(top).sub(center).normalize();
    const pos = lookAt.current.position;
    pos.copy(ref.current.position);
    pos.applyMatrix4(cam.projectionMatrix);
    pos.z -= .1;
    pos.applyMatrix4(cam.projectionMatrixInverse);
    // console.log(pos.toArray())
    // console.log('useFrame');    
    // console.log(ref.current.matrix.toArray())
    // ref.current.quaternion.copy(cam.quaternion);
    // ref.current.updateMatrix();
    ref.current.lookAt(pos)
    // console.log(ref.current.matrix.toArray())
  })
  return <>
  <Box
  ref={ref}
  args={[200, 200, 200]}
  position={[0, 50, 0]}
  >
  <Plane 
  args={[300,100]}
  material-color="pink"
  rotation={[0,0,0]} 
  // material-side={DoubleSide}
  />
    <axesHelper args={[300]} />
  </Box>
  <axesHelper args={[300]} ref={lookAt} />
  </>
}

const fwd = new Vector3();

const updateCamera = (target: Object3D, projByViewInv: Matrix4)=>{
  

  target.position
    .setScalar(0)
    .applyMatrix4(projByViewInv)

    target.up
    .set(0,1,0)
    .applyMatrix4(projByViewInv)
    .negate()
    .add(target.position)
    .normalize()

    fwd
      .set(0,0,-1)
      .applyMatrix4(projByViewInv)
    
      target.lookAt(fwd);

}