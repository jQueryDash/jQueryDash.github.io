/**
 * @author Sam Thompson
 *
 * A simple panel to display a bit of text on the dashboard
 */
$( function()
{
	"use strict";
	$.widget( 'jqueryDash.clockPanel', $.jqueryDash.panel, {
		options: {
			minHeight: 50,
			minWidth: 100,
			clockContainer: null,
			currentHour: null,
			currentMinute: null,
			showSeconds: false,
			_minEditorSize: {
				h: 100,
				w: 200
			},
			timer: null
		},

		/**
		 * Add settings fields for edit mode
		 *
		 * @private
		 */
		_createEditorFields: function()
		{
			this.addEditorField( 'bool', 'seconds', this.options.showSeconds ? 1 : 0, 'Show Seconds?' );
		},

		/**
		 * Draws the clock
		 *
		 * @private
		 */
		_drawViewPanel: function()
		{
			var
				self = this,
				placeholder = this.options.showSeconds ? '00:00:00' : '00:00';

			this._super();

			this.options.clockContainer = $( '<span/>', {'class': 'clock', 'text': placeholder} );
			this.element.find( 'div.content' ).html( this.options.clockContainer );
			this._scaleTextToFit();
			this._drawClock();
			this.timer = setInterval( function()
			{
				self._drawClock();
			}, 1000 );
		},

		/**
		 * Calculates the current time, redraws the contents of the panel if necessary
		 *
		 * @private
		 */
		_drawClock: function()
		{
			var
				now = new Date(),
				hour = now.getHours(),
				minute = now.getMinutes(),
				text;

			// Only redraw when necessary
			if( this.options.showSeconds || hour !== this.options.currentHour || minute !== this.options.currentMinute )
			{
				this.options.currentHour = hour;
				this.options.currentMinute = minute;

				text = this._pad( hour, 2 ) + ':' + this._pad( minute, 2 );
				if( this.options.showSeconds )
				{
					text += ':' + this._pad( now.getSeconds(), 2 );
				}
				this.options.clockContainer.text( text );
			}
		},

		/**
		 * Scales the contents span text size to fit the panel's content div
		 *
		 * @private
		 */
		_scaleTextToFit: function()
		{
			var
				self = this,
				containerWidth = this.options.clockContainer.width(),
				originalFontSize,
				newFontSize;

			// If the container is not yet draw, wait a wee while and try again
			if( containerWidth === 0 )
			{
				setTimeout( function()
				{
					self._scaleTextToFit();
				}, 50 );
			}
			else
			{
				originalFontSize = parseInt( this.options.clockContainer.css( 'font-size' ), 10 );
				newFontSize = ((this.element.width() - 20) / containerWidth) * originalFontSize;
				this.options.clockContainer.css( {'font-size': newFontSize, 'line-height': newFontSize / 1.2 +
																						   'px', 'display': 'block' } );
			}
		},

		/**
		 * Clears the timer and current time values when the view is destroyed
		 *
		 * @private
		 */
		_destroyViewPanel: function()
		{
			this._super();
			clearInterval( this.timer );
			this.options.currentHour = null;
			this.options.currentMinute = null;
		},

		/**
		 * Pads the provided number to the specified length
		 * with leading zeros
		 *
		 * @param {Number} number
		 * @param {Number} length
		 * @returns {string}
		 * @private
		 */
		_pad: function( number, length )
		{
			var str = number.toString();
			while( str.length < length )
			{
				str = '0' + str;
			}

			return str;
		},

		/**
		 * Update the show seconds flag
		 *
		 * @private
		 */
		_readSettings: function()
		{
			this._super();
			this.options.showSeconds = parseInt( this.setting( 'seconds' ), 10 ) === 1;
		}

	} );
} );