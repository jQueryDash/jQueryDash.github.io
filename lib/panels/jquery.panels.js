/**
 * Manages all panels
 *
 * @author Sam Thompson
 */
$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.panels', $.jqueryDash.localStorageObject, {

		_panelElements: {},

		panelTypes: {
			'panel': 'Default'
		},

		options: {
		},

		/**
		 * Creates the panels control widget
		 *
		 * @private
		 */
		_create: function()
		{
			var
				self = this,
				panels = this._getPanels(),
				panelKeys = panels.keys(),
				panelIndex,
				panel;

			// Load existing panels from local storage
			for( panelIndex in panelKeys )
			{
				if( panelKeys.hasOwnProperty( panelIndex ) && panels.isSet( panelKeys[ panelIndex ] ) )
				{
					panel = panels.get( panelKeys[ panelIndex ] );
					this._addPanel( panel.id, panel.type );
				}
			}

			this.element.append(

				// Add Button - for creating new panels
				$( '<a>', { 'class': 'button add-panel above-panels', 'text': '+', 'title': 'Add Panel' } )
					.click( function()
					{

						// Create a select input for picking the panel type
						var
							select = $( '<select>' ),
							typeKey;

						for( typeKey in self.panelTypes )
						{
							if( self.panelTypes.hasOwnProperty( typeKey ) )
							{
								select.append( $( '<option>', { 'value': typeKey, 'text': self.panelTypes[ typeKey ] } ) );
							}
						}

						// Create the type selection dialog
						$( "<div>", {'class': 'type-picker'} )
							.append( select )
							.attr( 'title', 'Add a Panel' )
							.dialog( {
								modal: true,
								resizable: false,
								draggable: false,
								buttons: {
									'Create Panel': function()
									{
										var
											newId = self._createPanelID(),
											type = $( this ).find( 'select' ).val();
										self._addPanel( newId, type, true );
										$( this ).dialog( 'close' );
									}
								},
								close: function()
								{
									$( this ).dialog( 'destroy' ).remove();
								}
							} );
					} ),

				// Edit button for managing panels
				$( '<a>', { 'class': 'button edit-panels above-panels', 'html': '&#9881;', 'title': 'Manage Panels' } )
					.click( function()
					{
						self.element.addClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							self._callMethodOnPanelWidget( $( element ), 'mode', 'edit' );
						} );
					} ),

				// View button for exiting edit mode
				$( '<a>', { 'class': 'button view-panels above-panels', 'html': '&#10004;', 'title': 'View Panels' } )
					.click( function()
					{
						self.element.removeClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							self._callMethodOnPanelWidget( $( element ), 'mode', 'view' );
						} );
					} )
			);

			this.element.find( '.above-panels' ).zIndex( panelKeys.length + 1 );

			this.element.on( 'deletePanel', function( event, panelId )
			{
				// Remove the panel from the ordering
				self._reduceOrderingOfPanels( self._getElementForPanelId( panelId ).zIndex() );

				// Remove the panel from the controller's settings
				self._getPanels().remove( panelId );

				// Remove the panel from the list of element
				delete self._panelElements[ panelId ];
			} );
		},

		/**
		 * Returns the panels storage object
		 *
		 * @returns {{_localStorageKey: string, _data: *, get: Function, set: Function, remove: Function, removeAll: Function, keys: Function, isSet: Function}}
		 * @private
		 */
		_getPanels: function()
		{
			return this.getLocalStorageObject( 'panels', true );
		},

		/**
		 * Returns the next sequential Panel ID
		 *
		 * @returns {number}
		 * @private
		 */
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

		/**
		 *
		 * @param {number} id
		 * @param {string} panelType
		 * @param {boolean} [newPanel]
		 * @private
		 */
		_addPanel: function( id, panelType, newPanel )
		{
			var self = this;
			if( newPanel !== undefined && newPanel )
			{
				self._getPanels().set( id, { 'id': id, 'type': panelType } );
			}

			this._panelElements[ id ] = $( '<div>', { 'class': 'panel' } );

			this.element.append( this._panelElements[ id ][ panelType ](
				( newPanel !== undefined && newPanel ) ? { 'id': id, 'mode': 'edit', 'ordering': id } : { 'id': id }
			) );
		},

		/**
		 * The storage namespace
		 *
		 * @returns {String}
		 * @private
		 */
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
				topPosition = this._getPanels().keys().length;
			// Only bring to front if this is not already the foremost panel
			if( initialOrdering !== topPosition )
			{
				this._reduceOrderingOfPanels( initialOrdering );

				panelWidget.setOrdering( topPosition );
				this.element.find( '.above-panels' ).zIndex( topPosition + 1 );
			}
		},

		/**
		 * Calls a method on the panel widget associated with a jQuery DOM object
		 *
		 * @param {jQuery} element
		 * @param {String} method
		 * @param {*} params
		 * @returns {*} Return value of the specified method
		 * @private
		 */
		_callMethodOnPanelWidget: function( element, method, params )
		{
			return element[ element.data( 'panelType' ) ]( method, params );
		},

		/**
		 *
		 * @param {number} panelId
		 * @returns {jQuery} element
		 * @private
		 */
		_getElementForPanelId: function( panelId )
		{
			return this._panelElements[ panelId ];
		},

		_reduceOrderingOfPanels: function( zIndexGreaterThan )
		{
			var self = this;
			this.element.find( 'div.panel' ).each( function()
			{
				var panelOrder = $( this ).zIndex();

				// Only update ordering if this panel's ordering is higher than the initial order of the new front panel
				if( panelOrder > zIndexGreaterThan )
				{
					self._callMethodOnPanelWidget( $( this ), 'setOrdering', panelOrder - 1 );
				}
			} );
		}


	} );

	$( 'div#container' ).panels();
} );