/**
 * Manages all panels
 *
 * @author Sam Thompson
 */
$( function()
{
	"use strict";

	$.widget( "jqueryDash.dialog", $.ui.dialog, {
		_getCreateOptions: function()
		{
			return {
				modal: true,
				resizable: false,
				draggable: false
			};
		},
		close: function()
		{
			this._super();
			this.destroy();
			this.element.remove();
		}
	} );

	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.panels', $.jqueryDash.localStorageObject, {

		_panelElements: {},

		panelTypes: {
			'textPanel': 'Text',
			'clockPanel': 'Clock',
			'rssPanel': 'RSS',
			'rssMediaPanel': 'RSS (Media)',
			'statusWebPanel': 'Status (Web)',
			'htmlPanel': 'HTML',
			'twitterPanel': 'Twitter',
			'iceCreamPanel': 'Ice Cream Status'
		},

		_refreshTimer: null,

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
				$( '<a/>', { 'class': 'button add-panel above-all', 'text': '+', 'title': 'Add Panel' } )
					.click( function()
					{

						// Create a select input for picking the panel type
						var
							select = $( '<select/>' ),
							typeKey;

						for( typeKey in self.panelTypes )
						{
							if( self.panelTypes.hasOwnProperty( typeKey ) )
							{
								select.append( $( '<option/>', { 'value': typeKey, 'text': self.panelTypes[ typeKey ] } ) );
							}
						}

						// Create the type selection dialog
						$( '<div/>', {'class': 'type-picker'} )
							.append( $( '<label/>', {'text': 'Select a panel type'} ).append( select ) )
							.attr( 'title', 'Add a Panel' )
							.dialog( {
								buttons: {
									'Create Panel': function()
									{
										var
											newId = self._createPanelID(),
											type = $( this ).find( 'select' ).val();
										self._addPanel( newId, type, true );
										$( this ).dialog( 'close' );
									}
								}
							} );
					} ),

				// Edit button for managing panels
				$( '<a/>', { 'class': 'button edit-panels above-all', 'html': '&#9881;', 'title': 'Manage Panels' } )
					.click( function()
					{
						self._stopPanelRefresh();
						self.element.addClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							self._callMethodOnPanelWidget( $( element ), 'mode', 'edit' );
						} );
					} ),

				// View button for exiting edit mode
				$( '<a/>', { 'class': 'button view-panels above-all', 'html': '&#10004;', 'title': 'View Panels' } )
					.click( function()
					{
						self.element.removeClass( 'manage' ).find( '.panel' ).each( function( index, element )
						{
							self._callMethodOnPanelWidget( $( element ), 'mode', 'view' );
						} );
						self._startPanelRefresh();
					} ),

				// Settings button for invoking the settings management dialog
				$( '<a/>', { 'class': 'button settings above-all', 'html': '&#9883;', 'title': 'Settings' } )
					.click( function()
					{
						// Create the settings dialog
						$( '<div/>', {'class': 'settings'} )
							.attr( 'title', 'Settings' )
							.append(
								$( '<div/>', {'class': 'import-export pane'} )
									.append(
										$( '<label/>', {'text': 'Export Configuration'} ).append(
											$( '<button/>', {'text': '\u2193 Download Settings'} ).click( function()
											{
												// Create a pretend link and click it to trigger download
												var link = document.createElement( 'a' );
												link.setAttribute( 'href', 'data:application/json;charset=utf-8,' +
																		   encodeURIComponent( JSON.stringify( localStorage ) ) );
												link.setAttribute( 'download', 'settings.json' );
												link.click();
											} )
										),
										$( '<label/>', {'text': 'Import Settings'} ).append(
											$( '<input/>', {'type': 'file'} ).on( 'change', function( changeEvent )
											{
												//noinspection JSLint
												var
													reader = new FileReader(),
													file = changeEvent.target.files[ 0 ];
												reader.onload = function( evt )
												{
													if( confirm( 'Click OK to replace the existing configuration with this file.\nThere is no way to undo this action!' ) )
													{
														self._importSettings( evt.target.result );
													}
												};
												reader.onerror = function()
												{
													alert( 'File upload error. Please try again.' );
												};

												if( file.type === "application/json" )
												{
													reader.readAsText( changeEvent.target.files[ 0 ] );
												}
												else
												{
													alert( 'Invalid file type selected: "' + file.type + '"' );
												}
											} )
										),
										$( '<button/>', {'text': 'Clear All Settings', 'class': 'mega-warning'} )
											.click( function()
											{
												if( confirm( 'Are you sure you want to proceed?\nThe application will be reset to it\'s default state.\nAll settings and panels will be lost.' ) )
												{
													self._clearStorage();
													window.location.reload();
												}
											} )
									)
							)
							.dialog( {
								width: '400',
								height: '300'
							} );
					} )

			);

			this._replaceCSSRules(
				[
					'.above-panels',
					'.above-all',
					'.above-all-overlay'
				],
				[
					{'z-index': panelKeys.length + 1},
					{'z-index': panelKeys.length + 2},
					{'z-index': panelKeys.length + 3}
				] );
			this.element.on( 'deletePanel', function( event, panelId )
			{
				// Remove the panel from the ordering
				self._reduceOrderingOfPanels( self._getElementForPanelId( panelId ).zIndex() );

				// Remove the panel from the controller's settings
				self._getPanels().remove( panelId );

				// Remove the panel from the list of element
				delete self._panelElements[ panelId ];
			} );
			this._startPanelRefresh();
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
			if( newPanel !== undefined && newPanel )
			{
				this._getPanels().set( id, { 'id': id, 'type': panelType } );
			}

			this._panelElements[ id ] = $( '<div/>' );

			if( this._panelElements[ id ][ panelType ] !== undefined )
			{
				this.element.append( this._panelElements[ id ][ panelType ](
					( newPanel !== undefined && newPanel )
						? { 'controller': this, 'id': id, 'mode': 'edit', 'ordering': id }
						: { 'controller': this, 'id': id }
				) );
			}
			else
			{
				console.log( "WARNING: Missing " + panelType + " definition. Skipping panel id:" + id );
			}
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

		/**
		 *
		 * @param {number} zIndexGreaterThan
		 * @private
		 */
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
		},

		/**
		 * Removes all of the jQueryDash contents from the storage object
		 *
		 * @private
		 */
		_clearStorage: function()
		{
			//ToDo: namespace local storage for jQueryDash and only remove it's local storage values
			localStorage.clear();
		},

		/**
		 * Imports application state from a json string and reloads the application
		 *
		 * @param {String} jsonString
		 * @private
		 */
		_importSettings: function( jsonString )
		{
			var
				json,
				key;

			try
			{
				json = JSON.parse( jsonString );

				// Wipe down existing local storage data
				this._clearStorage();

				// Import the new data
				for( key in json )
				{
					if( json.hasOwnProperty( key ) )
					{
						localStorage.setItem( key, json[ key ] );
					}
				}

				// Reload the window with the new panel configuration
				window.location.reload();
			}
			catch( error )
			{
				alert( 'Sorry, your settings file could not be read.' );
			}
		},

		/**
		 * Loops through all panels with a refresh class. Calls refreshContent on any panels who's nextRefresh time
		 * is passed. This method will be called every 5 seconds. Anything that needs updated more frequently than
		 * this should just use it's own timer.
		 *
		 * @private
		 */
		_refreshPanels: function()
		{
			var
				timeNow = new Date(),
				self = this;
			timeNow = timeNow.getTime();

			this.element.find( '.panel.refresh' ).each( function( index, element )
			{
				var nextRefresh;
				element = $( element );
				nextRefresh = element.data( 'nextRefresh' );

				if( nextRefresh !== undefined && nextRefresh <= timeNow )
				{
					self._callMethodOnPanelWidget( element, 'refreshContent' );
				}
			} );
		},

		/**
		 * Starts the refresh timer
		 *
		 * @private
		 */
		_startPanelRefresh: function()
		{
			var self = this;
			this._refreshTimer = setInterval( function()
			{
				self._refreshPanels();
			}, 5000 );
		},

		/**
		 * Stops the refresh timer
		 *
		 * @private
		 */
		_stopPanelRefresh: function()
		{
			clearInterval( this._refreshTimer );
		},

		/**
		 * Allows for existing rules to be overridden
		 *
		 * Number of selectors and replacements must be the same
		 *
		 * @param {Array} selectors selector strings
		 * @param {Array} rules replacement rules for each selector. Dictionary of properties and values
		 * @private
		 */
		_replaceCSSRules: function( selectors, rules )
		{
			var rule,
				ruleIterator,
				sheet,
				sheetIterator,
				index,
				newProperty;

			if( document.styleSheets )
			{
				for( sheetIterator = 0; sheetIterator < document.styleSheets.length; sheetIterator++ )
				{
					sheet = document.styleSheets[ sheetIterator ];
					ruleIterator = 0;

					rule = false;
					//noinspection JSValidateTypes
					while( ( rule = sheet.cssRules[ ruleIterator ] ) !== undefined )
					{
						if( ( index = selectors.indexOf( rule.selectorText ) ) !== -1 )
						{
							sheet.deleteRule( ruleIterator );
							sheet.insertRule( selectors[ index ] + ' { }', ruleIterator );
							rule = sheet.cssRules[ ruleIterator ];
							for( newProperty in rules[ index ] )
							{
								if( rules[ index ].hasOwnProperty( newProperty ) )
								{
									rule.style[ newProperty ] = rules[ index ][ newProperty ];
								}
							}
						}
						ruleIterator++;
					}
				}
			}
		}

	} );

	$( 'div#container' ).panels();
} );
