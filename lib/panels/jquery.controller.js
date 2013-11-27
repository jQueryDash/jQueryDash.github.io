$( function()
{
	"use strict";
	$.widget( "jqueryDash.panels", $.jqueryDash.localStorageObject, {

		panel: [],

		options: {
		},

		_create: function()
		{
			var
				self = this,
				panels,
				panelIndex;

			this.panels = this._getLocalStorageObject( 'panels' );

			panels = this.panels.keys();

			// Load existing panels from local storage
			for( panelIndex in panels )
			{
				if( panels.hasOwnProperty( panelIndex ) && this.panels.isSet( panels[ panelIndex ] ) )
				{
					this._addPanel( this.panels.get( panels[ panelIndex ] ) );
				}
			}

			this.element.append(
				// Add Button - for creating new panels
				$( '<a>', { 'class': 'button add-panel', 'text': '+' } )
					.click( function()
					{
						// Get new panel ID
						var newId = self._createPanelID();
						self.panels.set( 'Panel' + newId, newId );
						self._addPanel( newId );
					} ),
				$( '<a>', { 'class': 'button edit-panels', 'text': 'edit' } )
					.click( function()
					{
						self.element.addClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							$( element ).panel( 'mode', 'edit' );
						} );
					} ),
				$( '<a>', { 'class': 'button view-panels', 'text': 'view' } )
					.click( function()
					{
						self.element.removeClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							$( element ).panel( 'mode', 'view' );
						} );
					} )
			)
			;

			this.element.on( 'deletePanel', function( event, panelId )
			{
				self.panels.remove( 'Panel' + panelId );
			} );
		},

		_createPanelID: function()
		{
			var id = 1;
			if( this.isSetting( 'PanelID' ) )
			{
				id = this.setting( 'PanelID' ) + 1;
			}

			this.setting( 'PanelID', id );

			return id;
		},

		_addPanel: function( id )
		{
			this.element.append( $( '<div>', { 'class': 'panel' } ).panel( { 'id': id } ) );
		},

		_getStorageNamespace: function()
		{
			return 'Settings';
		}

	} );
} );