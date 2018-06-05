"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* eslint-disable no-undef */
/**
 * Determine the mouse position
 *
 * @param event the canvas event
 * @returns *[] tuple of position x,y
 * @private
 */
var pointerPosition = exports.pointerPosition = function pointerPosition(event) {
	var eventInstance = event || window.event;
	var target = eventInstance.target || eventInstance.srcElement;
	var style = target.currentStyle || window.getComputedStyle(target, null);
	var borderLeftWidth = parseInt(style.borderLeftWidth, 10);
	var borderTopWidth = parseInt(style.borderTopWidth, 10);
	var rect = target.getBoundingClientRect();
	var x = eventInstance.clientX - borderLeftWidth - rect.left;
	var y = eventInstance.clientY - borderTopWidth - rect.top;
	var touchX = eventInstance.changedTouches ? eventInstance.changedTouches[0].clientX - borderLeftWidth - rect.left : null;
	var touchY = eventInstance.changedTouches ? eventInstance.changedTouches[0].clientY - borderTopWidth - rect.top : null;
	return [x || touchX, y || touchY];
};

// function getMouseCoords(canvas, event)
// {
//    var pointer = canvas.getPointer(event.e)
//    var posX = pointer.x
//    var posY = pointer.y
//    console.log(posX+", "+posY)    // Log to console
// }

/**
 * Calculate the distance of two x,y points
 *
 * @param point1 an object with x,y attributes representing the start point
 * @param point2 an object with x,y attributes representing the end point
 *
 * @returns {number}
 */
var linearDistance = exports.linearDistance = function linearDistance(point1, point2) {
	var xs = point2.x - point1.x;
	var ys = point2.y - point1.y;
	return Math.sqrt(xs * xs + ys * ys);
};