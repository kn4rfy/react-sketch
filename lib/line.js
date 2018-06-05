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

var Line = function (_FabricCanvasTool) {
	_inherits(Line, _FabricCanvasTool);

	function Line() {
		_classCallCheck(this, Line);

		return _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).apply(this, arguments));
	}

	_createClass(Line, [{
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
		}
	}, {
		key: 'doMouseDown',
		value: function doMouseDown(o) {
			this.isDown = true;
			var canvas = this.canvas;
			var pointer = canvas.getPointer(o.e);
			var points = [pointer.x, pointer.y, pointer.x, pointer.y];
			this.line = new _fabric.fabric.Line(points, {
				strokeWidth: this.width,
				fill: this.color,
				stroke: this.color,
				originX: 'center',
				originY: 'center',
				selectable: false,
				evented: false
			});
			canvas.add(this.line);
		}
	}, {
		key: 'doMouseMove',
		value: function doMouseMove(o) {
			if (!this.isDown) return;
			var canvas = this.canvas;
			var pointer = canvas.getPointer(o.e);
			this.line.set({ x2: pointer.x, y2: pointer.y });
			this.line.setCoords();
			canvas.renderAll();
		}
	}, {
		key: 'doMouseUp',
		value: function doMouseUp(o) {
			this.isDown = false;
		}
	}, {
		key: 'doMouseOut',
		value: function doMouseOut(o) {
			this.isDown = false;
		}
	}]);

	return Line;
}(_fabrictool2.default);

exports.default = Line;