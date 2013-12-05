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
				$( '<a>', { 'class': 'button add-panel', 'text': '+', 'title': 'Add Panel' } )
					.click( function()
					{
						// Get new panel ID
						var newId = self._createPanelID();
						self.panels.set( 'Panel' + newId, newId );
						self._addPanel( newId, true );
					} ),
				$( '<a>', { 'class': 'button edit-panels', 'html': '&#9881;', 'title': 'Manage Panels' } )
					.click( function()
					{
						self.element.addClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							$( element ).panel( 'mode', 'edit' );
						} );
					} ),
				$( '<a>', { 'class': 'button view-panels', 'html': '&#10004;', 'title': 'View Panels' } )
					.click( function()
					{
						self.element.removeClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							$( element ).panel( 'mode', 'view' );
						} );
					} )
			);

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

		_addPanel: function( id, newPanel )
		{
			var self = this;
			this.element.append( $( '<div>', { 'class': 'panel' } ).panel(
				( newPanel !== undefined && newPanel ) ? { 'id': id, 'mode': 'edit', 'ordering': self.panels.keys().length } : { 'id': id }
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
				$( 'div.panel', this.element ).each( function() {
					var panelOrder = $( this ).zIndex();

					// Only update ordering if this panel's ordering is higher than the initial order of the new front panel
					if( panelOrder > initialOrdering )
					{
						$( this ).panel( 'setOrdering', panelOrder - 1 );
					}
				} );

				panelWidget.setOrdering( topPosition );
			}
		}

	} );
} );