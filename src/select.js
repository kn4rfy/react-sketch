import FabricCanvasTool from './fabrictool'

export default class Select extends FabricCanvasTool {
	configureCanvas(props) {
		const canvas = this.canvas
		canvas.isDrawingMode = false
		canvas.selection = true
		canvas.forEachObject(o => {
			const item = o
			item.selectable = true
			item.evented = true

			return item
		})
	}
}
