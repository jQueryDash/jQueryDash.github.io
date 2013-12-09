$( function()
{
	"use strict";
	$.widget( 'jqueryDash.panels', $.jqueryDash.localStorageObject, {

		panel: [],

		panelTypes: {
			'panel': 'Default'
		},

		options: {
		},

		_create: function()
		{
			var
				self = this,
				panels,
				panelIndex,
				panel;

			this.panels = this._getLocalStorageObject( 'panels' );

			panels = this.panels.keys();

			// Load existing panels from local storage
			for( panelIndex in panels )
			{
				if( panels.hasOwnProperty( panelIndex ) && this.panels.isSet( panels[ panelIndex ] ) )
				{
					panel = this.panels.get( panels[ panelIndex ] );
					this._addPanel( panel.id, panel.type );
				}
			}

			this.element.append(
				// Add Button - for creating new panels
				$( '<a>', { 'class': 'button add-panel above-panels', 'text': '+', 'title': 'Add Panel' } )
					.click( function()
					{
						// ToDo: allow for creation of panels of type this.panelType
						var
							newId = self._createPanelID(),
							type = 'panel';
						self._addPanel( newId, type, true );
					} ),
				$( '<a>', { 'class': 'button edit-panels above-panels', 'html': '&#9881;', 'title': 'Manage Panels' } )
					.click( function()
					{
						self.element.addClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							$( element ).panel( 'mode', 'edit' );
						} );
					} ),
				$( '<a>', { 'class': 'button view-panels above-panels', 'html': '&#10004;', 'title': 'View Panels' } )
					.click( function()
					{
						self.element.removeClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							$( element ).panel( 'mode', 'view' );
						} );
					} )
			);

			this.element.find( '.above-panels' ).zIndex( panels.length );

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

		_addPanel: function( id, panelType, newPanel )
		{
			var self = this;
			if( newPanel !== undefined && newPanel )
			{
				self.panels.set( 'Panel' + id, { 'id': id, 'type': panelType } );
			}
			this.element.append( $( '<div>', { 'class': 'panel' } )[ panelType ](
				( newPanel !== undefined && newPanel ) ? { 'id': id, 'mode': 'edit', 'ordering': id } : { 'id': id }
			) );
		},

		_getStorageNamespace: function()
		{
			return 'Settings';
		},

		/**
		 * Moves the specified panel to be the foremost panel
		 *
		 * @param panelWidget
		 */
		setFrontPanel: function( panelWidget )
		{
			var
				initialOrdering = panelWidget.element.zIndex(),
				topPosition = this.panels.keys().length;

			// Only bring to front if this is not already the foremost panel
			if( initialOrdering !== topPosition )
			{
				this.element.find( 'div.panel' ).each( function()
				{
					var panelOrder = $( this ).zIndex();

					// Only update ordering if this panel's ordering is higher than the initial order of the new front panel
					if( panelOrder > initialOrdering )
					{
						$( this ).panel( 'setOrdering', panelOrder - 1 );
					}
				} );

				panelWidget.setOrdering( topPosition );
				this.element.find( '.above-panels' ).zIndex( topPosition + 1 );
			}
		}

	} );
} );