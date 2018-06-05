'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fabric = require('fabric');

var _fabrictool = require('./fabrictool');

var _fabrictool2 = _interopRequireDefault(_fabrictool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rectangle = function (_FabricCanvasTool) {
	_inherits(Rectangle, _FabricCanvasTool);

	function Rectangle() {
		_classCallCheck(this, Rectangle);

		return _possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).apply(this, arguments));
	}

	_createClass(Rectangle, [{
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
			this.rect = new _fabric.fabric.Rect({
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
				angle: 0
			});
			canvas.add(this.rect);
		}
	}, {
		key: 'doMouseMove',
		value: function doMouseMove(o) {
			if (!this.isDown) return;
			var canvas = this.canvas;
			var pointer = canvas.getPointer(o.e);
			if (this.startX > pointer.x) {
				this.rect.set({ left: Math.abs(pointer.x) });
			}
			if (this.startY > pointer.y) {
				this.rect.set({ top: Math.abs(pointer.y) });
			}
			this.rect.set({ width: Math.abs(this.startX - pointer.x) });
			this.rect.set({ height: Math.abs(this.startY - pointer.y) });
			this.rect.setCoords();
			canvas.renderAll();
		}
	}, {
		key: 'doMouseUp',
		value: function doMouseUp(o) {
			this.isDown = false;
		}
	}]);

	return Rectangle;
}(_fabrictool2.default);

exports.default = Rectangle;