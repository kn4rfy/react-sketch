"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Maintains the history of an object
 */
var History = function () {
	function History() {
		var undoLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
		var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		_classCallCheck(this, History);

		this.undoLimit = undoLimit;
		this.undoList = [];
		this.redoList = [];
		this.current = null;
		this.debug = debug;
	}

	/**
  * Get the limit of undo/redo actions
  *
  * @returns {number|*} the undo limit, as it is configured when constructing the history instance
  */


	_createClass(History, [{
		key: "getUndoLimit",
		value: function getUndoLimit() {
			return this.undoLimit;
		}

		/**
   * Get Current state
   *
   * @returns {null|*}
   */

	}, {
		key: "getCurrent",
		value: function getCurrent() {
			return this.current;
		}

		/**
   * Keep an object to history
   *
   * This method will set the object as current value and will push the previous "current" object to the undo history
   *
   * @param obj
   */

	}, {
		key: "keep",
		value: function keep(obj) {
			try {
				this.redoList = [];
				if (this.current) {
					this.undoList.push(this.current);
				}
				if (this.undoList.length > this.undoLimit) {
					this.undoList.shift();
				}
				this.current = obj;
			} finally {
				this.print();
			}
		}

		/**
   * Undo the last object, this operation will set the current object to one step back in time
   *
   * @returns the new current value after the undo operation, else null if no undo operation was possible
   */

	}, {
		key: "undo",
		value: function undo() {
			try {
				if (this.current) {
					this.redoList.push(this.current);
					if (this.redoList.length > this.undoLimit) {
						this.redoList.shift();
					}
					if (this.undoList.length === 0) this.current = null;
				}
				if (this.undoList.length > 0) {
					this.current = this.undoList.pop();
					return this.current;
				}
				return null;
			} finally {
				this.print();
			}
		}

		/**
   * Redo the last object, redo happens only if no keep operations have been performed
   *
   * @returns the new current value after the redo operation, or null if no redo operation was possible
   */

	}, {
		key: "redo",
		value: function redo() {
			try {
				if (this.redoList.length > 0) {
					if (this.current) this.undoList.push(this.current);
					this.current = this.redoList.pop();
					return this.current;
				}
				return null;
			} finally {
				this.print();
			}
		}

		/**
   * Checks whether we can perform a redo operation
   *
   * @returns {boolean}
   */

	}, {
		key: "canRedo",
		value: function canRedo() {
			return this.redoList.length > 0;
		}

		/**
   * Checks whether we can perform an undo operation
   *
   * @returns {boolean}
   */

	}, {
		key: "canUndo",
		value: function canUndo() {
			return this.undoList.length > 0 || this.current != null;
		}

		/**
   * Clears the history maintained, can be undone
   */

	}, {
		key: "clear",
		value: function clear() {
			this.undoList = [];
			this.redoList = [];
			this.current = null;
			this.print();
		}
	}, {
		key: "print",
		value: function print() {
			if (this.debug) {
				/* eslint-disable no-console */
				console.log(this.undoList, " -> " + this.current + " <- ", this.redoList.slice(0).reverse());
			}
		}
	}]);

	return History;
}();

exports.default = History;