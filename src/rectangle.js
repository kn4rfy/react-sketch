import { fabric } from 'fabric'
import FabricCanvasTool from './fabrictool'

export default class Rectangle extends FabricCanvasTool {
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
		this.rect = new fabric.Rect({
			left: this.startX,
			top: this.startY,
			originX: 'left',
			originY: 'top',
			width: pointer.x - this.startX,
			height: pointer.y - this.startY,
			stroke: this.color,
			strokeWidth: this.width,
			fill: this.fill,
			// fill: 'rgba(255,0,0,0.5)',
			transparentCorners: false,
			selectable: false,
			evented: false,
			angle: 0,
		})
		canvas.add(this.rect)
	}

	doMouseMove(o) {
		if (!this.isDown) return
		const canvas = this.canvas
		const pointer = canvas.getPointer(o.e)
		if (this.startX > pointer.x) {
			this.rect.set({ left: Math.abs(pointer.x) })
		}
		if (this.startY > pointer.y) {
			this.rect.set({ top: Math.abs(pointer.y) })
		}
		this.rect.set({ width: Math.abs(this.startX - pointer.x) })
		this.rect.set({ height: Math.abs(this.startY - pointer.y) })
		this.rect.setCoords()
		canvas.renderAll()
	}

	doMouseUp(o) {
		this.isDown = false
	}
}