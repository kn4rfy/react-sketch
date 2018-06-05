/* eslint-disable class-methods-use-this */
/**
 * "Abstract" like base class for a Canvas tool
 */
export default class FabricCanvasTool {
	constructor(canvas) {
		this.canvas = canvas
	}

	configureCanvas(props) {}

	doMouseUp(event) {}

	doMouseDown(event) {}

	doMouseMove(event) {}

	doMouseOut(event) {}
}
