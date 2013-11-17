$( function ()
{
	"use strict";
	$.widget( "panels.panel", {

		storage: null,

		options: {
		},

		_create: function ()
		{
			var self = this;
			//noinspection JSUnresolvedFunction
			this.storage = $.initNamespaceStorage( 'panels' ).localStorage;

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
						self.storage.set( 'posX', position.left );
						self.storage.set( 'posY', position.top );
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
						self.storage.set( 'width', $( this ).width() );
						self.storage.set( 'height', $( this ).height() );
					}
				} );

			// Load the saved panel position
			if ( this.storage.isSet( 'posX' ) && this.storage.isSet( 'posY' ) )
			{
				this.element.css( {
					'position': 'absolute',
					'top': this.storage.get( 'posY' ),
					'left': this.storage.get( 'posX' )
				} );
			}

			// Load the saved panel size
			if ( this.storage.isSet( 'width' ) )
			{
				this.element.width( this.storage.get( 'width' ) );
			}
			if ( this.storage.isSet( 'height' ) )
			{
				this.element.height( this.storage.get( 'height' ) );
			}
		}
	} );
} );