import { fabric } from 'fabric'
import FabricCanvasTool from './fabrictool'
import { linearDistance } from './utils'

export default class Circle extends FabricCanvasTool {
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
		this.fill = props.fillColor
	}

	doMouseDown(o) {
		const canvas = this.canvas
		this.isDown = true
		const pointer = canvas.getPointer(o.e)
		this.startX = pointer.x
		this.startY = pointer.y
		this.circle = new fabric.Circle({
			left: this.startX,
			top: this.startY,
			originX: 'left',
			originY: 'center',
			strokeWidth: this.width,
			stroke: this.color,
			fill: this.fill,
			selectable: false,
			evented: false,
			radius: 1,
		})
		canvas.add(this.circle)
	}

	doMouseMove(o) {
		if (!this.isDown) return
		const canvas = this.canvas
		const pointer = canvas.getPointer(o.e)
		this.circle.set({
			radius:
				linearDistance({ x: this.startX, y: this.startY }, { x: pointer.x, y: pointer.y }) /
				2,
			angle: Math.atan2(pointer.y - this.startY, pointer.x - this.startX) * 180 / Math.PI,
		})
		this.circle.setCoords()
		canvas.renderAll()
	}

	doMouseUp(o) {
		this.isDown = false
	}
}
