/**
 * @author Sam Thompson
 *
 * A simple panel to display a bit of text on the dashboard
 */
$( function()
{
	"use strict";
	$.widget( 'jqueryDash.clockPanel', $.jqueryDash.panel, {

		clockContainer: null,

		currentHour: null,
		currentMinute: null,

		showSeconds: false,

		timer: null,

		options: {
			minHeight: 50
		},

		/**
		 * Add settings fields for edit mode
		 * @private
		 */
		_createEditorFields: function()
		{
			this._addEditorField( 'bool', 'seconds', 0, 'Show Seconds?' );
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
				placeholder = ( parseInt( this.setting( 'seconds' ), 10 ) === 1 ) ? '00:00:00' : '00:00';

			this._super();

			this.clockContainer = $( '<span>', {'class': 'clock', 'text': placeholder} );
			this.element.find( 'div.content' ).html( this.clockContainer );
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
			if( this.showSeconds || hour !== this.currentHour || minute !== this.currentMinute )
			{
				this.currentHour = hour;
				this.currentMinute = minute;

				text = this._pad( hour, 2 ) + ':' + this._pad( minute, 2 );
				if( this.showSeconds )
				{
					text += ':' + this._pad( now.getSeconds(), 2 )
				}
				this.clockContainer.text( text );
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
				containerWidth = this.clockContainer.width(),
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
				originalFontSize = parseInt( this.clockContainer.css( 'font-size' ) );
				newFontSize = ((this.element.width() - 20) / containerWidth) * originalFontSize;
				this.clockContainer.css( {'font-size': newFontSize, 'line-height': newFontSize / 1.2 +
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
			this.currentHour = null;
			this.currentMinute = null;
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
			var str = '' + number;
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
			this.showSeconds = parseInt( this.setting( 'seconds' ), 10 ) === 1;
		}

	} );
} );