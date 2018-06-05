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

var Pan = function (_FabricCanvasTool) {
	_inherits(Pan, _FabricCanvasTool);

	function Pan() {
		_classCallCheck(this, Pan);

		return _possibleConstructorReturn(this, (Pan.__proto__ || Object.getPrototypeOf(Pan)).apply(this, arguments));
	}

	_createClass(Pan, [{
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
			canvas.defaultCursor = 'move';
		}
	}, {
		key: 'doMouseDown',
		value: function doMouseDown(o) {
			var canvas = this.canvas;
			this.isDown = true;
			var pointer = canvas.getPointer(o.e);
			this.startX = pointer.x;
			this.startY = pointer.y;
		}
	}, {
		key: 'doMouseMove',
		value: function doMouseMove(o) {
			if (!this.isDown) return;
			var canvas = this.canvas;
			var pointer = canvas.getPointer(o.e);

			canvas.relativePan({
				x: pointer.x - this.startX,
				y: pointer.y - this.startY
			});
			canvas.renderAll();
		}
	}, {
		key: 'doMouseUp',
		value: function doMouseUp(o) {
			this.isDown = false;
		}
	}]);

	return Pan;
}(_fabrictool2.default);

exports.default = Pan;