/**
 * @author Sam Thompson
 *
 * Provides basic UI functionality of a panel
 */
$( function ()
{
	"use strict";
	$.widget( "panels.panel", {

		settingsNameSpace: null,

		options: {
			id : 0
		},

		_create: function ()
		{
			var
				self = this,
				storage;
			//noinspection JSUnresolvedFunction
			this.settingsNameSpace = 'Panel' + this.options.id;
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
					minWidth: 196,
					minHeight: 196,
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
			this.element.resize();

			// Load the saved panel position
			if ( storage.isSet( 'posX' ) && storage.isSet( 'posY' ) )
			{
				this.element.css( {
					'position': 'absolute',
					'top': storage.get( 'posY' ),
					'left': storage.get( 'posX' )
				} );
			}

			// Load the saved panel size
			if ( storage.isSet( 'width' ) )
			{
				this.element.width( storage.get( 'width' ) );
			}
			if ( storage.isSet( 'height' ) )
			{
				this.element.height( storage.get( 'height' ) );
			}
		},

		_getStorage: function()
		{
			return $.initNamespaceStorage( this.settingsNameSpace ).localStorage;
		}
	} );
} );