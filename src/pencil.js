import FabricCanvasTool from './fabrictool'

export default class Pencil extends FabricCanvasTool {
	configureCanvas(props) {
		this.canvas.isDrawingMode = true
		this.canvas.freeDrawingBrush.width = props.lineWidth
		this.canvas.freeDrawingBrush.color = props.lineColor
	}
}
