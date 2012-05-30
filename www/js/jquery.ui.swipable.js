/*
 * $.ui.swipable
 *
 * http://code.google.com/p/jquery-ui-swipable/
 * version 0.1.1 (2010/09/04)
 * Copyright (c) 2010 Takeshi Takatsudo (takazudo[at]gmail.com)
 * MIT license
 *
=============================================================================
 depends on
-----------------------------------------------------------------------------
 * jQuery 1.4.2
 * jQuery UI 1.8.2
 * jQuery UI Widget 1.8.2
 *
=============================================================================
 how to use
-----------------------------------------------------------------------------
 * // setup
 * 
 * $(element).swipable();
 * 
 * // you can can bind iPhone,iPad swipe evnets
 * 
 * $(element).bind('swipe.right', fn);
 * $(element).bind('swipe.left', fn);
 * $(element).bind('swipe.top', fn);
 * $(element).bind('swipe.bottom', fn);
 * 
 */
(function($){ // start $=jQuery encapsulation
	
	$.widget('ui.swipable', {
		options: {
			preventDefault: true,
			distance: 150 // px threshold to invoke swipe events
		},
		_sleeping: false,
		_startX: null,
		_startY: null,
		_currentX: null,
		_currentY: null,
		_create: function(){
			this.widgetEventPrefix = 'swipe.';
			this._eventify();
			return this;
		},
		_eventify: function(){
			var e = this.element;
			e.bind('touchstart',  $.proxy(this._touchStartHandler, this));
			e.bind('touchmove',   $.proxy(this._touchMoveHandler, this));
			e.bind('touchend',    $.proxy(this._touchEndHandler, this));
			e.bind('touchcancel', $.proxy(this._touchCancelHandler, this));
			return this;
		},
		_evalSwipes: function(){
			var x = this._currentX;
			var y = this._currentY;
			var startX = this._startX;
			var startY = this._startY;
			var d = this.options.distance;
			((x-startX)>d) && this._swipeRight();
			((startX-x)>d) && this._swipeLeft();
			((y-startY)>d) && this._swipeBottom();
			((startY-y)>d) && this._swipeTop();
		},
		_awake: function(){
			this._sleeping = false;
			return this;
		},
		_sleep: function(){
			this._sleeping = true;
			return this;
		},
		_swipeTop: function(){
			this._sleep();
			this._trigger('top')
			return this;
		},
		_swipeRight: function(){
			this._sleep();
			this._trigger('right')
			return this;
		},
		_swipeBottom: function(){
			this._sleep();
			this._trigger('bottom')
			return this;
		},
		_swipeLeft: function(){
			this._sleep();
			this._trigger('left')
			return this;
		},
		_setStartTouch: function(touch){
			this._startX = touch.pageX;
			this._startY = touch.pageY;
			return this;
		},
		_setCurrentTouch: function(touch){
			this._currentX = touch.pageX;
			this._currentY = touch.pageY;
		},
		_touchStartHandler: function(event){
			var e = event.originalEvent;
			var touches = e.touches;
			if(touches.length>1){
				return;
			}
			var touch = touches[0];
			this._setStartTouch(touch);
		},
		_touchMoveHandler: function(event){
			var e = event.originalEvent;
			var touch = e.touches[0];
			this._setCurrentTouch(touch);
			!this._sleeping && this._evalSwipes();
			this.options.preventDefault && e.preventDefault();
		},
		_touchEndHandler: function(event){
			this._awake();
		},
		_touchCancelHandler: function(event){
			this._awake();
		}
	});

})(jQuery); // end $=jQuery encapsulation
