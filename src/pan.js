import { fabric } from 'fabric'
import FabricCanvasTool from './fabrictool'

export default class Pan extends FabricCanvasTool {
	configureCanvas(props) {
		const canvas = this.canvas
		canvas.isDrawingMode = false
		canvas.selection = false
		canvas.forEachObject(o => {
			const item = o
			item.selectable = false
			item.evented = false

			return item
		})
		canvas.defaultCursor = 'move'
	}

	doMouseDown(o) {
		const canvas = this.canvas
		this.isDown = true
		const pointer = canvas.getPointer(o.e)
		this.startX = pointer.x
		this.startY = pointer.y
	}

	doMouseMove(o) {
		if (!this.isDown) return
		const canvas = this.canvas
		const pointer = canvas.getPointer(o.e)

		canvas.relativePan({
			x: pointer.x - this.startX,
			y: pointer.y - this.startY,
		})
		canvas.renderAll()
	}

	doMouseUp(o) {
		this.isDown = false
	}
}
