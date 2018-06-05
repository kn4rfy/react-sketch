'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _fabric = require('fabric');

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _history = require('./history');

var _history2 = _interopRequireDefault(_history);

var _select = require('./select');

var _select2 = _interopRequireDefault(_select);

var _pencil = require('./pencil');

var _pencil2 = _interopRequireDefault(_pencil);

var _line = require('./line');

var _line2 = _interopRequireDefault(_line);

var _rectangle = require('./rectangle');

var _rectangle2 = _interopRequireDefault(_rectangle);

var _circle = require('./circle');

var _circle2 = _interopRequireDefault(_circle);

var _pan = require('./pan');

var _pan2 = _interopRequireDefault(_pan);

var _tools = require('./tools');

var _tools2 = _interopRequireDefault(_tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-param-reassign,no-undef,react/no-unused-prop-types,react/require-default-props,react/forbid-prop-types */


/**
 * Sketch Tool based on FabricJS for React Applications
 */
var SketchField = function (_PureComponent) {
	_inherits(SketchField, _PureComponent);

	function SketchField() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, SketchField);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SketchField.__proto__ || Object.getPrototypeOf(SketchField)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			parentWidth: 550,
			action: true
		}, _this.componentDidMount = function () {
			var _this$props = _this.props,
			    tool = _this$props.tool,
			    value = _this$props.value,
			    defaultValue = _this$props.defaultValue,
			    undoSteps = _this$props.undoSteps;


			_this.fc = new _fabric.fabric.Canvas(_this.canvas /* , {
                                                     preserveObjectStacking: false,
                                                     renderOnAddRemove: false,
                                                     skipTargetFind: true
                                                     } */
			);

			var canvas = _this.fc;

			_this.initTools(canvas);

			var selectedTool = _this.tools[tool];
			selectedTool.configureCanvas(_this.props);
			_this.selectedTool = selectedTool;

			// Control resize
			window.addEventListener('resize', _this.resize, false);

			// Initialize History, with maximum number of undo steps
			_this.history = new _history2.default(undoSteps);

			// Events binding
			canvas.on('object:added', _this.onObjectAdded);
			canvas.on('object:modified', _this.onObjectModified);
			canvas.on('object:removed', _this.onObjectRemoved);
			canvas.on('mouse:down', _this.onMouseDown);
			canvas.on('mouse:move', _this.onMouseMove);
			canvas.on('mouse:up', _this.onMouseUp);
			canvas.on('mouse:out', _this.onMouseOut);
			canvas.on('object:moving', _this.onObjectMoving);
			canvas.on('object:scaling', _this.onObjectScaling);
			canvas.on('object:rotating', _this.onObjectRotating);

			_this.disableTouchScroll();

			_this.resize();
			// initialize canvas with controlled value if exists
			if (value || defaultValue) {
				_this.fromJSON(value || defaultValue);
			}
		}, _this.componentWillReceiveProps = function (nextProps) {
			if (_this.props.tool !== nextProps.tool) {
				_this.selectedTool = _this.tools[nextProps.tool] || _this.tools[_tools2.default.Pencil];
			}

			// Bring the cursor back to default if it is changed by a tool
			_this.fc.defaultCursor = 'default';
			_this.selectedTool.configureCanvas(nextProps);

			if (_this.props.backgroundColor !== nextProps.backgroundColor) {
				_this.backgroundColor(nextProps.backgroundColor);
			}

			if (_this.props.value !== nextProps.value || nextProps.value && nextProps.forceValue) {
				_this.fromJSON(nextProps.value);
			}
		}, _this.componentDidUpdate = function (prevProps, prevState) {
			if (_this.state.parentWidth !== prevState.parentWidth || _this.props.width !== prevProps.width || _this.props.height !== prevProps.height) {
				_this.resize();
			}
		}, _this.componentWillUnmount = function () {
			return window.removeEventListener('resize', _this.resize);
		}, _this.onMouseUp = function (e) {
			_this.selectedTool.doMouseUp(e);
			// Update the final state to new-generated object
			// Ignore Path object since it would be created after mouseUp
			// Assumed the last object in canvas.getObjects() in the newest object
			if (_this.props.tool !== _tools2.default.Pencil) {
				var canvas = _this.fc;
				var objects = canvas.getObjects();
				var newObj = objects[objects.length - 1];
				if (newObj && newObj.objectVersion === 1) {
					newObj.originalState = newObj.toJSON();
				}
			}
			if (_this.props.onChange) {
				var onChange = _this.props.onChange;
				setTimeout(function () {
					onChange(e.e);
				}, 10);
			}
		}, _this.onMouseDown = function (e) {
			_this.selectedTool.doMouseDown(e);
		}, _this.onMouseMove = function (e) {
			_this.selectedTool.doMouseMove(e);
		}, _this.onMouseOut = function (e) {
			_this.selectedTool.doMouseOut(e);
			if (_this.props.onChange) {
				var onChange = _this.props.onChange;
				setTimeout(function () {
					onChange(e.e);
				}, 10);
			}
		}, _this.onObjectAdded = function (e) {
			if (!_this.state.action) {
				_this.setState({ action: true });
				return;
			}
			var obj = e.target;
			obj.objectVersion = 1;
			// record current object state as json and save as originalState
			var objState = obj.toJSON();
			obj.originalState = objState;
			var state = JSON.stringify(objState);
			_this.history.keep([obj, state, state]);
		}, _this.onObjectModified = function (e) {
			var obj = e.target;
			obj.objectVersion += 1;
			var prevState = JSON.stringify(obj.originalState);
			var objState = obj.toJSON();
			// record current object state as json and update to originalState
			obj.originalState = objState;
			var currState = JSON.stringify(objState);
			_this.history.keep([obj, prevState, currState]);
		}, _this.onObjectMoving = function (e) {}, _this.onObjectScaling = function (e) {}, _this.onObjectRotating = function (e) {}, _this.onObjectRemoved = function (e) {
			var obj = e.target;
			obj.objectVersion = 0;
		}, _this.setBackgroundFromDataUrl = function (dataUrl) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var canvas = _this.fc;
			if (options.stretched) {
				delete options.stretched;
				Object.assign(options, {
					width: canvas.width,
					height: canvas.height
				});
			}
			if (options.stretchedX) {
				delete options.stretchedX;
				Object.assign(options, {
					width: canvas.width
				});
			}
			if (options.stretchedY) {
				delete options.stretchedY;
				Object.assign(options, {
					height: canvas.height
				});
			}
			var img = new Image();
			img.onload = function () {
				return canvas.setBackgroundImage(new _fabric.fabric.Image(img), function () {
					return canvas.renderAll();
				}, options);
			};
			img.src = dataUrl;
		}, _this.enableTouchScroll = function () {
			var canvas = _this.fc;
			if (canvas.allowTouchScrolling) return;
			canvas.allowTouchScrolling = true;
		}, _this.disableTouchScroll = function () {
			var canvas = _this.fc;
			if (canvas.allowTouchScrolling) {
				canvas.allowTouchScrolling = false;
			}
		}, _this.addImg = function (dataUrl) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var canvas = _this.fc;
			_fabric.fabric.Image.fromURL(dataUrl, function (oImg) {
				var opts = {
					left: Math.random() * (canvas.getWidth() - oImg.width * 0.5),
					top: Math.random() * (canvas.getHeight() - oImg.height * 0.5),
					scale: 0.5
				};
				Object.assign(opts, options);
				oImg.scale(opts.scale);
				oImg.set({
					left: opts.left,
					top: opts.top
				});
				canvas.add(oImg);
			});
		}, _this.resize = function (e) {
			if (e) e.preventDefault();
			var _this$props2 = _this.props,
			    widthCorrection = _this$props2.widthCorrection,
			    heightCorrection = _this$props2.heightCorrection;

			var canvas = _this.fc;
			var _this$container = _this.container,
			    offsetWidth = _this$container.offsetWidth,
			    clientHeight = _this$container.clientHeight;

			var prevWidth = canvas.getWidth();
			var prevHeight = canvas.getHeight();
			var wfactor = ((offsetWidth - widthCorrection) / prevWidth).toFixed(2);
			var hfactor = ((clientHeight - heightCorrection) / prevHeight).toFixed(2);
			canvas.setWidth(offsetWidth - widthCorrection);
			canvas.setHeight(clientHeight - heightCorrection);
			if (canvas.backgroundImage) {
				// Need to scale background images as well
				var bi = canvas.backgroundImage;
				bi.width *= wfactor;
				bi.height *= hfactor;
			}
			var objects = canvas.getObjects();
			objects.map(function (item) {
				var object = item;
				object.scaleX *= wfactor;
				object.scaleY *= hfactor;
				object.left *= wfactor;
				object.top *= hfactor;

				return object;
			});
			_this.setState({
				parentWidth: offsetWidth
			});
			canvas.renderAll();
			canvas.calcOffset();
		}, _this.backgroundColor = function (color) {
			if (!color) return;
			var canvas = _this.fc;
			canvas.setBackgroundColor(color, function () {
				return canvas.renderAll();
			});
		}, _this.zoom = function (factor) {
			var canvas = _this.fc;
			var objects = canvas.getObjects();
			objects.map(function (item) {
				var object = item;
				object.scaleX *= factor;
				object.scaleY *= factor;
				object.left *= factor;
				object.top *= factor;

				return object;
			});

			if (canvas.backgroundImage) {
				canvas.backgroundImage.scaleX *= factor;
				canvas.backgroundImage.scaleY *= factor;
				canvas.backgroundImage.left *= factor;
				canvas.backgroundImage.top *= factor;
			}

			canvas.renderAll();
			canvas.calcOffset();
		}, _this.undo = function () {
			var history = _this.history;
			if (history.canUndo()) {
				var canvas = _this.fc;

				var _history$getCurrent = history.getCurrent(),
				    _history$getCurrent2 = _slicedToArray(_history$getCurrent, 3),
				    obj = _history$getCurrent2[0],
				    prevState = _history$getCurrent2[1],
				    currState = _history$getCurrent2[2];

				history.undo();
				if (obj.objectVersion === 1) {
					canvas.remove(obj);
				} else {
					obj.objectVersion -= 1;
					obj.setOptions(JSON.parse(prevState));
				}
				obj.setCoords();
				canvas.renderAll();
				if (_this.props.onChange) {
					_this.props.onChange();
				}
			}
		}, _this.redo = function () {
			var history = _this.history;
			if (history.canRedo()) {
				var canvas = _this.fc;

				var _history$redo = history.redo(),
				    _history$redo2 = _slicedToArray(_history$redo, 3),
				    obj = _history$redo2[0],
				    prevState = _history$redo2[1],
				    currState = _history$redo2[2];

				if (obj.objectVersion === 0) {
					_this.setState({ action: false }, function () {
						canvas.add(obj);
						obj.objectVersion = 1;
					});
				} else {
					obj.objectVersion += 1;
					obj.setOptions(JSON.parse(currState));
				}
				obj.setCoords();
				canvas.renderAll();
				if (_this.props.onChange) {
					_this.props.onChange();
				}
			}
		}, _this.canUndo = function () {
			return _this.history.canUndo();
		}, _this.canRedo = function () {
			return _this.history.canRedo();
		}, _this.toDataURL = function (options) {
			return _this.fc.toDataURL(options);
		}, _this.toJSON = function (propertiesToInclude) {
			return _this.fc.toJSON(propertiesToInclude);
		}, _this.fromJSON = function (json) {
			if (!json) return;
			var canvas = _this.fc;
			setTimeout(function () {
				canvas.loadFromJSON(json, function () {
					canvas.renderAll();
					if (_this.props.onChange) {
						_this.props.onChange();
					}
				});
			}, 100);
		}, _this.clear = function (propertiesToInclude) {
			var discarded = _this.toJSON(propertiesToInclude);
			_this.fc.clear();
			_this.history.clear();
			return discarded;
		}, _this.initTools = function (fabricCanvas) {
			_this.tools = {};
			_this.tools[_tools2.default.Select] = new _select2.default(fabricCanvas);
			_this.tools[_tools2.default.Pencil] = new _pencil2.default(fabricCanvas);
			_this.tools[_tools2.default.Line] = new _line2.default(fabricCanvas);
			_this.tools[_tools2.default.Rectangle] = new _rectangle2.default(fabricCanvas);
			_this.tools[_tools2.default.Circle] = new _circle2.default(fabricCanvas);
			_this.tools[_tools2.default.Pan] = new _pan2.default(fabricCanvas);
		}, _this.render = function () {
			var _this$props3 = _this.props,
			    className = _this$props3.className,
			    style = _this$props3.style,
			    width = _this$props3.width,
			    height = _this$props3.height;


			var canvasDivStyle = Object.assign({}, style || {}, width ? { width: width } : {}, height ? { height: height } : { height: 512 });

			return _react2.default.createElement(
				'div',
				{
					className: className,
					ref: function ref(c) {
						_this.container = c;
					},
					style: canvasDivStyle
				},
				_react2.default.createElement(
					'canvas',
					{
						id: (0, _v2.default)(),
						ref: function ref(c) {
							_this.canvas = c;
						}
					},
					'Sorry, Canvas HTML5 element is not supported by your browser :('
				)
			);
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	/**
  * Action when the mouse button press is released
  */


	/**
  * Action when the mouse button is pressed down
  */


	/**
  * Action when the mouse cursor is moving around within the canvas
  */


	/**
  * Action when the mouse cursor is moving out from the canvas
  */


	/**
  * Action when an object is added to the canvas
  */


	/**
  * Action when an object is modified inside the canvas
  */


	/**
  * Action when an object is moving around inside the canvas
  */


	/**
  * Action when an object is scaling inside the canvas
  */


	/**
  * Action when an object is rotating inside the canvas
  */


	/**
  * Action when an object is removed from the canvas
  */


	/**
  * Sets the background from the dataUrl given
  *
  * @param dataUrl the dataUrl to be used as a background
  * @param options
  */


	/**
  * Enable touch Scrolling on Canvas
  */


	/**
  * Disable touch Scrolling on Canvas
  */


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


	/**
  * Track the resize of the window and update our state
  *
  * @param e the resize event
  * @private
  */


	/**
  * Sets the background color for this sketch
  * @param color in rgba or hex format
  */


	/**
  * Zoom the drawing by the factor specified
  *
  * The zoom factor is a percentage with regards the original, for example if factor is set to 2
  * it will double the size whereas if it is set to 0.5 it will half the size
  *
  * @param factor the zoom factor
  */


	/**
  * Perform an undo operation on canvas, if it cannot undo it will leave the canvas intact
  */


	/**
  * Perform a redo operation on canvas, if it cannot redo it will leave the canvas intact
  */


	/**
  * Delegation method to check if we can perform an undo Operation, useful to disable/enable possible buttons
  *
  * @returns {*} true if we can undo otherwise false
  */


	/**
  * Delegation method to check if we can perform a redo Operation, useful to disable/enable possible buttons
  *
  * @returns {*} true if we can redo otherwise false
  */


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


	/**
  * Returns JSON representation of canvas
  *
  * @param propertiesToInclude Array <optional> Any properties that you might want to additionally include in the output
  * @returns {string} JSON string
  */


	/**
  * Populates canvas with data from the specified JSON.
  *
  * JSON format must conform to the one of fabric.Canvas#toDatalessJSON
  *
  * @param json JSON string or object
  */


	/**
  * Clear the content of the canvas, this will also clear history but will return the canvas content as JSON to be
  * used as needed in order to undo the clear if possible
  *
  * @param propertiesToInclude Array <optional> Any properties that you might want to additionally include in the output
  * @returns {string} JSON string of the canvas just cleared
  */


	/**
  * Initialize Canvas tools
  */


	return SketchField;
}(_react.PureComponent);

SketchField.propTypes = {
	// the color of the line
	lineColor: _propTypes2.default.string,
	// The width of the line
	lineWidth: _propTypes2.default.number,
	// the fill color of the shape when applicable
	fillColor: _propTypes2.default.string,
	// the background color of the sketch
	backgroundColor: _propTypes2.default.string,
	// the opacity of the object
	opacity: _propTypes2.default.number,
	// number of undo/redo steps to maintain
	undoSteps: _propTypes2.default.number,
	// The tool to use, can be pencil, rectangle, circle, brush
	tool: _propTypes2.default.string,
	// image format when calling toDataURL
	imageFormat: _propTypes2.default.string,
	// Sketch data for controlling sketch from
	// outside the component
	value: _propTypes2.default.object,
	// Set to true if you wish to force load the given value, even if it is  the same
	forceValue: _propTypes2.default.bool,
	// Specify some width correction which will be applied on auto resize
	widthCorrection: _propTypes2.default.number,
	// Specify some height correction which will be applied on auto resize
	heightCorrection: _propTypes2.default.number
};
SketchField.defaultProps = {
	lineColor: 'black',
	lineWidth: 10,
	fillColor: 'transparent',
	backgroundColor: 'transparent',
	opacity: 1.0,
	undoSteps: 25,
	tool: _tools2.default.Pencil,
	widthCorrection: 2,
	heightCorrection: 0,
	forceValue: false
};
exports.default = SketchField;