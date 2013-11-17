$( function ()
{
	"use strict";
	$.widget( "panels.controller", {

		settings: [],
		panel: [],

		options: {
		},

		_create: function ()
		{
			var
				self = this,
				panels,
				panelIndex;
			//noinspection JSUnresolvedFunction
			this.settings = $.initNamespaceStorage( 'settings' ).localStorage;
			//noinspection JSUnresolvedFunction
			this.panels = $.initNamespaceStorage( 'panels' ).localStorage;

			panels = this.panels.keys();

			for ( panelIndex in panels )
			{
				if ( this.panels.isSet( panels[ panelIndex ] ) )
				{
					this._addPanel( this.panels.get( panels[ panelIndex ] ) );
				}
			}
			this.element.append(
				$( '<a>', { 'class': 'add-panel', 'text': '+' } )
					.click( function ()
					{
						var newId = self._createPanelID();
						self.panels.set( 'Panel' + newId, newId );
						self._addPanel( newId );
					} )
			);

			this.element.on( 'deletePanel', function( event, panelId ) {
				self.panels.remove( 'Panel' + panelId );
			} );
		},

		_createPanelID: function()
		{
			var id = 1;
			if( this.settings.isSet( 'PanelID' ) )
			{
				id = this.settings.get( 'PanelID' ) + 1
			}

			this.settings.set( 'PanelID', id );

			return id;
		},

		_addPanel: function( id )
		{
			this.element.append( $( '<div>' ).panel( { 'id': id } ) );
		}

	} );
} );