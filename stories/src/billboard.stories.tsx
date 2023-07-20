import { Billboard, Box, Line, Plane, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import { AxesHelper, DoubleSide, MathUtils, Matrix4, Mesh, Object3D, Vector3 } from "three";
import { StoryMap } from "./story-map";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";

export function Default() {

  const [hovered, hover] = useState(false);

  return <StoryMap latitude={51} longitude={0} zoom={13} pitch={0}>
    {/* <Text fontSize={17} color="#2592a8" scale={10} rotation={[-90*MathUtils.DEG2RAD,0,0]}>0</Text>
    <Text fontSize={17} color="#2592a8" scale={10} rotation={[-90*MathUtils.DEG2RAD,0,0]} position={[0,3000,0]}>3000</Text> */}
    {/* <MyBox /> */}
    {/* <axesHelper args={[300]} position={[300,0,0]}/> */}
    <CamPos />
    {/* <Billboard>
      <Plane
        args={[500, 500, 500]}
        position={[0, 250, 0]}
        rotation={[0, 45 * MathUtils.DEG2RAD, 0]}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        material-color={hovered ? 'purple' : 'orange'}
      />
      <Box
        args={[200, 200, 200]}
        position={[0, 50, 0]}
        rotation={[0, 0, 0]}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        material-color={hovered ? 'purple' : 'orange'}
      />
    </Billboard> */}
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

    // get camera pos
    ref.current.position
      .setScalar(0)
      .applyMatrix4(cam.projectionMatrixInverse);
    
    // get camera up vector
    const center = new Vector3().applyMatrix4(cam.projectionMatrixInverse);
    const top = new Vector3(0,1,0).applyMatrix4(cam.projectionMatrixInverse);
    rotObj.up.copy(center).sub(top).normalize();

    // get camera rotation
    const forward = new Vector3(0,0,-1).applyMatrix4(cam.projectionMatrixInverse);
    rotObj.position.set(0,0,1).applyMatrix4(cam.projectionMatrixInverse);
    rotObj.lookAt(forward);
    ref.current.quaternion.copy(rotObj.quaternion);


  })
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