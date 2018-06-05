import { fabric } from 'fabric'
import FabricCanvasTool from './fabrictool'

export default class Line extends FabricCanvasTool {
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
		this.width = props.lineWidth
		this.color = props.lineColor
	}

	doMouseDown(o) {
		this.isDown = true
		const canvas = this.canvas
		const pointer = canvas.getPointer(o.e)
		const points = [pointer.x, pointer.y, pointer.x, pointer.y]
		this.line = new fabric.Line(points, {
			strokeWidth: this.width,
			fill: this.color,
			stroke: this.color,
			originX: 'center',
			originY: 'center',
			selectable: false,
			evented: false,
		})
		canvas.add(this.line)
	}

	doMouseMove(o) {
		if (!this.isDown) return
		const canvas = this.canvas
		const pointer = canvas.getPointer(o.e)
		this.line.set({ x2: pointer.x, y2: pointer.y })
		this.line.setCoords()
		canvas.renderAll()
	}

	doMouseUp(o) {
		this.isDown = false
	}

	doMouseOut(o) {
		this.isDown = false
	}
}