'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fabric = require('fabric');

var _fabrictool = require('./fabrictool');

var _fabrictool2 = _interopRequireDefault(_fabrictool);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Circle = function (_FabricCanvasTool) {
	_inherits(Circle, _FabricCanvasTool);

	function Circle() {
		_classCallCheck(this, Circle);

		return _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).apply(this, arguments));
	}

	_createClass(Circle, [{
		key: 'configureCanvas',
		value: function configureCanvas(props) {
			var canvas = this.canvas;
			canvas.isDrawingMode = false;
			canvas.selection = false;
			canvas.forEachObject(function (o) {
				var item = o;
				item.selectable = false;
				item.evented = false;

				return item;
			});
			this.width = props.lineWidth;
			this.color = props.lineColor;
			this.fill = props.fillColor;
		}
	}, {
		key: 'doMouseDown',
		value: function doMouseDown(o) {
			var canvas = this.canvas;
			this.isDown = true;
			var pointer = canvas.getPointer(o.e);
			this.startX = pointer.x;
			this.startY = pointer.y;
			this.circle = new _fabric.fabric.Circle({
				left: this.startX,
				top: this.startY,
				originX: 'left',
				originY: 'center',
				strokeWidth: this.width,
				stroke: this.color,
				fill: this.fill,
				selectable: false,
				evented: false,
				radius: 1
			});
			canvas.add(this.circle);
		}
	}, {
		key: 'doMouseMove',
		value: function doMouseMove(o) {
			if (!this.isDown) return;
			var canvas = this.canvas;
			var pointer = canvas.getPointer(o.e);
			this.circle.set({
				radius: (0, _utils.linearDistance)({ x: this.startX, y: this.startY }, { x: pointer.x, y: pointer.y }) / 2,
				angle: Math.atan2(pointer.y - this.startY, pointer.x - this.startX) * 180 / Math.PI
			});
			this.circle.setCoords();
			canvas.renderAll();
		}
	}, {
		key: 'doMouseUp',
		value: function doMouseUp(o) {
			this.isDown = false;
		}
	}]);

	return Circle;
}(_fabrictool2.default);

exports.default = Circle;