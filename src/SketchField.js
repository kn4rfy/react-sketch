/* eslint-disable no-param-reassign,no-undef,react/no-unused-prop-types,react/require-default-props,react/forbid-prop-types */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { fabric } from 'fabric'
import uuidV4 from 'uuid/v4'
import History from './history'
import Select from './select'
import Pencil from './pencil'
import Line from './line'
import Rectangle from './rectangle'
import Circle from './circle'
import Pan from './pan'
import Tool from './tools'

/**
 * Sketch Tool based on FabricJS for React Applications
 */
export default class SketchField extends PureComponent {
	static propTypes = {
		// the color of the line
		lineColor: PropTypes.string,
		// The width of the line
		lineWidth: PropTypes.number,
		// the fill color of the shape when applicable
		fillColor: PropTypes.string,
		// the background color of the sketch
		backgroundColor: PropTypes.string,
		// the opacity of the object
		opacity: PropTypes.number,
		// number of undo/redo steps to maintain
		undoSteps: PropTypes.number,
		// The tool to use, can be pencil, rectangle, circle, brush
		tool: PropTypes.string,
		// image format when calling toDataURL
		imageFormat: PropTypes.string,
		// Sketch data for controlling sketch from
		// outside the component
		value: PropTypes.object,
		// Set to true if you wish to force load the given value, even if it is  the same
		forceValue: PropTypes.bool,
		// Specify some width correction which will be applied on auto resize
		widthCorrection: PropTypes.number,
		// Specify some height correction which will be applied on auto resize
		heightCorrection: PropTypes.number,
	}

	static defaultProps = {
		lineColor: 'black',
		lineWidth: 10,
		fillColor: 'transparent',
		backgroundColor: 'transparent',
		opacity: 1.0,
		undoSteps: 25,
		tool: Tool.Pencil,
		widthCorrection: 2,
		heightCorrection: 0,
		forceValue: false,
	}

	state = {
		parentWidth: 550,
		action: true,
	}

	componentDidMount = () => {
		const { tool, value, defaultValue, undoSteps } = this.props

		this.fc = new fabric.Canvas(
			this.canvas /* , {
         preserveObjectStacking: false,
         renderOnAddRemove: false,
         skipTargetFind: true
         } */
		)

		const canvas = this.fc

		this.initTools(canvas)

		const selectedTool = this.tools[tool]
		selectedTool.configureCanvas(this.props)
		this.selectedTool = selectedTool

		// Control resize
		window.addEventListener('resize', this.resize, false)

		// Initialize History, with maximum number of undo steps
		this.history = new History(undoSteps)

		// Events binding
		canvas.on('object:added', this.onObjectAdded)
		canvas.on('object:modified', this.onObjectModified)
		canvas.on('object:removed', this.onObjectRemoved)
		canvas.on('mouse:down', this.onMouseDown)
		canvas.on('mouse:move', this.onMouseMove)
		canvas.on('mouse:up', this.onMouseUp)
		canvas.on('mouse:out', this.onMouseOut)
		canvas.on('object:moving', this.onObjectMoving)
		canvas.on('object:scaling', this.onObjectScaling)
		canvas.on('object:rotating', this.onObjectRotating)

		this.disableTouchScroll()

		this.resize()
		// initialize canvas with controlled value if exists
		if (value || defaultValue) {
			this.fromJSON(value || defaultValue)
		}
	}

	componentWillReceiveProps = nextProps => {
		if (this.props.tool !== nextProps.tool) {
			this.selectedTool = this.tools[nextProps.tool] || this.tools[Tool.Pencil]
		}

		// Bring the cursor back to default if it is changed by a tool
		this.fc.defaultCursor = 'default'
		this.selectedTool.configureCanvas(nextProps)

		if (this.props.backgroundColor !== nextProps.backgroundColor) {
			this.backgroundColor(nextProps.backgroundColor)
		}

		if (this.props.value !== nextProps.value || (nextProps.value && nextProps.forceValue)) {
			this.fromJSON(nextProps.value)
		}
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (
			this.state.parentWidth !== prevState.parentWidth ||
			this.props.width !== prevProps.width ||
			this.props.height !== prevProps.height
		) {
			this.resize()
		}
	}

	componentWillUnmount = () => window.removeEventListener('resize', this.resize)

	/**
	 * Action when the mouse button press is released
	 */
	onMouseUp = e => {
		this.selectedTool.doMouseUp(e)
		// Update the final state to new-generated object
		// Ignore Path object since it would be created after mouseUp
		// Assumed the last object in canvas.getObjects() in the newest object
		if (this.props.tool !== Tool.Pencil) {
			const canvas = this.fc
			const objects = canvas.getObjects()
			const newObj = objects[objects.length - 1]
			if (newObj && newObj.version === 1) {
				newObj.originalState = newObj.toJSON()
			}
		}
		if (this.props.onChange) {
			const onChange = this.props.onChange
			setTimeout(() => {
				onChange(e.e)
			}, 10)
		}
	}

	/**
	 * Action when the mouse button is pressed down
	 */
	onMouseDown = e => {
		this.selectedTool.doMouseDown(e)
	}

	/**
	 * Action when the mouse cursor is moving around within the canvas
	 */
	onMouseMove = e => {
		this.selectedTool.doMouseMove(e)
	}

	/**
	 * Action when the mouse cursor is moving out from the canvas
	 */
	onMouseOut = e => {
		this.selectedTool.doMouseOut(e)
		if (this.props.onChange) {
			const onChange = this.props.onChange
			setTimeout(() => {
				onChange(e.e)
			}, 10)
		}
	}

	/**
	 * Action when an object is added to the canvas
	 */
	onObjectAdded = e => {
		if (!this.state.action) {
			this.setState({ action: true })
			return
		}
		const obj = e.target
		obj.version = 1
		// record current object state as json and save as originalState
		const objState = obj.toJSON()
		obj.originalState = objState
		const state = JSON.stringify(objState)

		// object, previous state, current state
		this.history.keep([obj, state, state])
	}

	/**
	 * Action when an object is modified inside the canvas
	 */
	onObjectModified = e => {
		const obj = e.target
		obj.version += 1
		const prevState = JSON.stringify(obj.originalState)
		const objState = obj.toJSON()
		// record current object state as json and update to originalState
		obj.originalState = objState
		const currState = JSON.stringify(objState)
		this.history.keep([obj, prevState, currState])
	}

	/**
	 * Action when an object is moving around inside the canvas
	 */
	onObjectMoving = e => {}

	/**
	 * Action when an object is scaling inside the canvas
	 */
	onObjectScaling = e => {}

	/**
	 * Action when an object is rotating inside the canvas
	 */
	onObjectRotating = e => {}

	/**
	 * Action when an object is removed from the canvas
	 */
	onObjectRemoved = e => {
		const obj = e.target
		obj.version = 0
	}

	/**
	 * Sets the background from the dataUrl given
	 *
	 * @param dataUrl the dataUrl to be used as a background
	 * @param options
	 */
	setBackgroundFromDataUrl = (dataUrl, options = {}) => {
		const canvas = this.fc
		if (options.stretched) {
			delete options.stretched
			Object.assign(options, {
				width: canvas.width,
				height: canvas.height,
			})
		}
		if (options.stretchedX) {
			delete options.stretchedX
			Object.assign(options, {
				width: canvas.width,
			})
		}
		if (options.stretchedY) {
			delete options.stretchedY
			Object.assign(options, {
				height: canvas.height,
			})
		}
		const img = new Image()
		img.onload = () =>
			canvas.setBackgroundImage(new fabric.Image(img), () => canvas.renderAll(), options)
		img.src = dataUrl
	}

	/**
	 * Enable touch Scrolling on Canvas
	 */
	enableTouchScroll = () => {
		const canvas = this.fc
		if (canvas.allowTouchScrolling) return
		canvas.allowTouchScrolling = true
	}

	/**
	 * Disable touch Scrolling on Canvas
	 */
	disableTouchScroll = () => {
		const canvas = this.fc
		if (canvas.allowTouchScrolling) {
			canvas.allowTouchScrolling = false
		}
	}

	/**
	 * Add an image as object to the canvas
	 *
	 * @param dataUrl the image url or Data Url
	 * @param options object to pass and change some options when loading image, the format of the object is:
	 *
	 * {
     *   left: <Number: distance from left of canvas>,
     *   top: <Number: distance from top of canvas>,
     *   scale: <Number: initial scale of image>
     * }
	 */
	addImg = (dataUrl, options = {}) => {
		const canvas = this.fc
		fabric.Image.fromURL(dataUrl, oImg => {
			const opts = {
				left: Math.random() * (canvas.getWidth() - (oImg.width * 0.5)),
				top: Math.random() * (canvas.getHeight() - (oImg.height * 0.5)),
				scale: 0.5,
			}
			Object.assign(opts, options)
			oImg.scale(opts.scale)
			oImg.set({
				left: opts.left,
				top: opts.top,
			})
			canvas.add(oImg)
		})
	}

	/**
	 * Track the resize of the window and update our state
	 *
	 * @param e the resize event
	 * @private
	 */
	resize = e => {
		if (e) e.preventDefault()
		const { widthCorrection, heightCorrection } = this.props
		const canvas = this.fc
		const { offsetWidth, clientHeight } = this.container
		const prevWidth = canvas.getWidth()
		const prevHeight = canvas.getHeight()
		const wfactor = ((offsetWidth - widthCorrection) / prevWidth).toFixed(2)
		const hfactor = ((clientHeight - heightCorrection) / prevHeight).toFixed(2)
		canvas.setWidth(offsetWidth - widthCorrection)
		canvas.setHeight(clientHeight - heightCorrection)
		if (canvas.backgroundImage) {
			// Need to scale background images as well
			const bi = canvas.backgroundImage
			bi.width *= wfactor
			bi.height *= hfactor
		}
		const objects = canvas.getObjects()
		objects.map(item => {
			const object = item
			object.scaleX *= wfactor
			object.scaleY *= hfactor
			object.left *= wfactor
			object.top *= hfactor

			return object
		})
		this.setState({
			parentWidth: offsetWidth,
		})
		canvas.renderAll()
		canvas.calcOffset()
	}

	/**
	 * Sets the background color for this sketch
	 * @param color in rgba or hex format
	 */
	backgroundColor = color => {
		if (!color) return
		const canvas = this.fc
		canvas.setBackgroundColor(color, () => canvas.renderAll())
	}

	/**
	 * Zoom the drawing by the factor specified
	 *
	 * The zoom factor is a percentage with regards the original, for example if factor is set to 2
	 * it will double the size whereas if it is set to 0.5 it will half the size
	 *
	 * @param factor the zoom factor
	 */
	zoom = factor => {
		const canvas = this.fc
		const objects = canvas.getObjects()
		objects.map(item => {
			const object = item
			object.scaleX *= factor
			object.scaleY *= factor
			object.left *= factor
			object.top *= factor

			return object
		})

		if (canvas.backgroundImage) {
			canvas.backgroundImage.scaleX *= factor
			canvas.backgroundImage.scaleY *= factor
			canvas.backgroundImage.left *= factor
			canvas.backgroundImage.top *= factor
		}

		canvas.renderAll()
		canvas.calcOffset()
	}

	/**
	 * Perform an undo operation on canvas, if it cannot undo it will leave the canvas intact
	 */
	undo = () => {
		const history = this.history
		if (history.canUndo()) {
			const canvas = this.fc
			const [obj, prevState, currState] = history.getCurrent()
			history.undo()
			if (obj.version === 1) {
				canvas.remove(obj)
			} else {
				obj.version -= 1
				obj.setOptions(JSON.parse(prevState))
			}
			obj.setCoords()
			canvas.renderAll()
			if (this.props.onChange) {
				this.props.onChange()
			}
		}
	}

	/**
	 * Perform a redo operation on canvas, if it cannot redo it will leave the canvas intact
	 */
	redo = () => {
		const history = this.history
		if (history.canRedo()) {
			const canvas = this.fc
			const [obj, prevState, currState] = history.redo()
			if (obj.version === 0) {
				this.setState({ action: false }, () => {
					canvas.add(obj)
					obj.version = 1
				})
			} else {
				obj.version += 1
				obj.setOptions(JSON.parse(currState))
			}
			obj.setCoords()
			canvas.renderAll()
			if (this.props.onChange) {
				this.props.onChange()
			}
		}
	}

	/**
	 * Delegation method to check if we can perform an undo Operation, useful to disable/enable possible buttons
	 *
	 * @returns {*} true if we can undo otherwise false
	 */
	canUndo = () => this.history.canUndo()

	/**
	 * Delegation method to check if we can perform a redo Operation, useful to disable/enable possible buttons
	 *
	 * @returns {*} true if we can redo otherwise false
	 */
	canRedo = () => this.history.canRedo()

	/**
	 * Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately
	 *
	 * Available Options are
	 * <table style="width:100%">
	 *
	 * <tr><td><b>Name</b></td><td><b>Type</b></td><td><b>Argument</b></td><td><b>Default</b></td><td><b>Description</b></td></tr>
	 * <tr><td>format</td> <td>String</td> <td><optional></td><td>png</td><td>The format of the output image. Either "jpeg" or "png"</td></tr>
	 * <tr><td>quality</td><td>Number</td><td><optional></td><td>1</td><td>Quality level (0..1). Only used for jpeg.</td></tr>
	 * <tr><td>multiplier</td><td>Number</td><td><optional></td><td>1</td><td>Multiplier to scale by</td></tr>
	 * <tr><td>left</td><td>Number</td><td><optional></td><td></td><td>Cropping left offset. Introduced in v1.2.14</td></tr>
	 * <tr><td>top</td><td>Number</td><td><optional></td><td></td><td>Cropping top offset. Introduced in v1.2.14</td></tr>
	 * <tr><td>width</td><td>Number</td><td><optional></td><td></td><td>Cropping width. Introduced in v1.2.14</td></tr>
	 * <tr><td>height</td><td>Number</td><td><optional></td><td></td><td>Cropping height. Introduced in v1.2.14</td></tr>
	 *
	 * </table>
	 *
	 * @returns {String} URL containing a representation of the object in the format specified by options.format
	 */
	toDataURL = options => this.fc.toDataURL(options)

	/**
	 * Returns JSON representation of canvas
	 *
	 * @param propertiesToInclude Array <optional> Any properties that you might want to additionally include in the output
	 * @returns {string} JSON string
	 */
	toJSON = propertiesToInclude => this.fc.toJSON(propertiesToInclude)

	/**
	 * Populates canvas with data from the specified JSON.
	 *
	 * JSON format must conform to the one of fabric.Canvas#toDatalessJSON
	 *
	 * @param json JSON string or object
	 */
	fromJSON = json => {
		if (!json) return
		const canvas = this.fc
		setTimeout(() => {
			canvas.loadFromJSON(json, () => {
				canvas.renderAll()
				if (this.props.onChange) {
					this.props.onChange()
				}
			})
		}, 100)
	}

	/**
	 * Clear the content of the canvas, this will also clear history but will return the canvas content as JSON to be
	 * used as needed in order to undo the clear if possible
	 *
	 * @param propertiesToInclude Array <optional> Any properties that you might want to additionally include in the output
	 * @returns {string} JSON string of the canvas just cleared
	 */
	clear = propertiesToInclude => {
		const discarded = this.toJSON(propertiesToInclude)
		this.fc.clear()
		this.history.clear()
		return discarded
	}

	/**
	 * Initialize Canvas tools
	 */
	initTools = fabricCanvas => {
		this.tools = {}
		this.tools[Tool.Select] = new Select(fabricCanvas)
		this.tools[Tool.Pencil] = new Pencil(fabricCanvas)
		this.tools[Tool.Line] = new Line(fabricCanvas)
		this.tools[Tool.Rectangle] = new Rectangle(fabricCanvas)
		this.tools[Tool.Circle] = new Circle(fabricCanvas)
		this.tools[Tool.Pan] = new Pan(fabricCanvas)
	}

	render = () => {
		const { className, style, width, height } = this.props

		const canvasDivStyle = Object.assign(
			{},
			style || {},
			width ? { width } : {},
			height ? { height } : { height: 512 }
		)

		return (
			<div
				className={className}
				ref={c => {
					this.container = c
				}}
				style={canvasDivStyle}
			>
				<canvas
					id={uuidV4()}
					ref={c => {
						this.canvas = c
					}}
				>
					Sorry, Canvas HTML5 element is not supported by your browser :(
				</canvas>
			</div>
		)
	}
}
