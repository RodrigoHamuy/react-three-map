import { createContext } from "react";
import { StateRef } from "./state-ref";
import { FromLngLat } from "./generic-map";

export const canvasContext = createContext<{stateRef: StateRef, fromLngLat: FromLngLat}>(undefined as any);