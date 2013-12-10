/**
 * @author Sam Thompson
 *
 * Provides basic UI functionality of a panel
 */
$( function()
{
	"use strict";
	$.widget( "panels.panel", $.jqueryDash.localStorageObject, {

		options: {
			id: 0,
			minWidth: 196,
			minHeight: 196,
			defaults: {
				w: 200,
				h: 200,
				x: 8,
				y: 9
			}
		},

		_create: function()
		{
			var
				self = this,
				initialPos,
				initialWidth,
				initialHeight;

			this.element
				// Load styling etc
				.addClass( 'panel' )
				// Set the panel to be movable
				.draggable( {
					containment: 'parent',
					grid: [50, 50],
					stop: function()
					{
						var position = $( this ).position();
						self.setting( 'posX', position.left );
						self.setting( 'posY', position.top );
					}
				} )
				// Set the panel to be resizable
				.resizable( {
					minWidth: this.options.minWidth,
					minHeight: this.options.minHeight,
					grid: 50,
					containment: 'parent',
					stop: function()
					{
						self.setting( 'width', $( this ).width() );
						self.setting( 'height', $( this ).height() );
					}
				} )
				.append(
					$( '<div>', {'text': 'x'} ).click( function()
					{
						if( confirm( 'Are you sure you want to delete this panel?' ) )
						{
							self.removeSettings();
							$( this ).trigger( 'deletePanel', self.options.id );
							self.element.remove();
						}
					} )
				);

			// Load the saved panel position
			initialPos = ( this.isSetting( 'posX' ) && this.isSetting( 'posY' ) ) ?
						 { 'x': this.setting( 'posX' ), 'y': this.setting( 'posY' ) } :
						 { 'x': this.options.defaults.x, 'y': this.options.defaults.y };

			// Load the saved panel size
			initialWidth = ( this.isSetting( 'width' ) ) ? this.setting( 'width' ) : this.options.defaults.w;
			initialHeight = ( this.isSetting( 'height' ) ) ? this.setting( 'height' ) : this.options.defaults.h;

			this.element
				.width( initialWidth )
				.height( initialHeight )
				.css( {
					'position': 'absolute',
					'top': initialPos.y,
					'left': initialPos.x
				} );
		},

		_getStorageNamespace: function()
		{
			return this.options.id;
		}

	} );
} );