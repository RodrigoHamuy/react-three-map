import { BlendFunction, Effect } from "postprocessing";

import fragmentShader from "./screen-blend.frag?raw";

export class ScreenBlendEffect extends Effect {

	constructor() {

		super("ScreenBlendEffect", fragmentShader);

		this.blendMode.blendFunction = BlendFunction.SCREEN;
	}

}
