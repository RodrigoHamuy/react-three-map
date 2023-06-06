import { useThree } from "@react-three/fiber";
import { memo, useEffect } from "react";
import { Matrix4 } from "three";
import { ThreeMapState, ThreeMapStore } from "./use-store";
import { useFunction } from "./use-function";

type TickHandler = (props: ThreeMapState)=>void;

export interface ThreeLayerSyncProps {
  coordsMx: Matrix4;
  store: ThreeMapStore,
}

export const SyncLayer = memo<ThreeLayerSyncProps>(({store, coordsMx})=>{
  console.log('SyncLayer');
  
  const {advance,camera, gl}= useThree();

  const onTick = useFunction<TickHandler>(({timestamp, baseCamMx})=>{
    camera.projectionMatrix.fromArray(baseCamMx).multiply(coordsMx);      
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    gl.resetState();
    advance(timestamp, true);
  })

  useEffect(()=>store.subscribe(onTick), [onTick, store]);

  return <></>
})
SyncLayer.displayName = 'ThreeLayerSync';