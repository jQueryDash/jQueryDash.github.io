/**
 * @author Sam Thompson
 *
 * Provides basic UI functionality of a panel
 */
$( function ()
{
	"use strict";
	$.widget( "panels.panel", {

		options: {
			id : 0,
			minWidth: 196,
			minHeight: 196,
			defaults: {
				w: 200,
				h: 200,
				x: 8,
				y: 9
			}
		},

		_create: function ()
		{
			var
				self = this,
				storage,
				initialPos,
				initialWidth,
				initialHeight;

			storage = this._getStorage();

			this.element
				// Load styling etc
				.addClass( 'panel' )
				// Set the panel to be movable
				.draggable( {
					containment: 'parent',
					grid: [50, 50],
					stop: function ()
					{
						var position = $( this ).position();
						storage.set( 'posX', position.left );
						storage.set( 'posY', position.top );
					}
				} )
				// Set the panel to be resizable
				.resizable( {
					minWidth: this.options.minWidth,
					minHeight: this.options.minHeight,
					grid: 50,
					containment: 'parent',
					stop: function ()
					{
						storage.set( 'width', $( this ).width() );
						storage.set( 'height', $( this ).height() );
					}
				} )
				.append(
					$( '<div>', {'text': 'x'} ).click( function() {
						if( confirm( 'Are you sure you want to delete this panel?' ) )
						{
							storage.removeAll();
							$(this).trigger( 'deletePanel',  self.options.id );
							self.element.remove();
						}
					} )
				);

			// Load the saved panel position
			initialPos = ( storage.isSet( 'posX' ) && storage.isSet( 'posY' ) ) ?
						 { 'x': storage.get( 'posX' ), 'y': storage.get( 'posY' ) } :
						 { 'x': this.options.defaults.x, 'y': this.options.defaults.y };

			// Load the saved panel size
			initialWidth = ( storage.isSet( 'width' ) ) ? storage.get( 'width' ) : this.options.defaults.w;
			initialHeight = ( storage.isSet( 'height' ) ) ? storage.get( 'height' ) : this.options.defaults.h;

			this.element
				.width( initialWidth )
				.height( initialHeight )
				.css( {
				'position': 'absolute',
				'top': initialPos.y,
				'left': initialPos.x
			} );
		},

		_getStorage: function()
		{
			//noinspection JSUnresolvedFunction
			return $.initNamespaceStorage( 'Panel/' + this.options.id ).localStorage;
		}
	} );
} );