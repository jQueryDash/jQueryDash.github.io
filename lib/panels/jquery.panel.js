/**
 * @author Sam Thompson
 *
 * Provides basic functionality of a panel
 */
$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.panel', $.jqueryDash.localStorageObject, {

		_mode: 'init',
		_modeEdit: 'edit',
		_modeView: 'view',

		options: {
			id: 0,
			mode: 'view',
			minWidth: 200,
			minHeight: 200,
			position: {
				x: 8,
				y: 9
			},
			_editorFields: {},
			_editorFieldCount: 0,
			ordering: null,
			refreshable: false,
			refreshInterval: 300
		},

		/**
		 * Create a new panel widget
		 *
		 * @private
		 */
		_create: function()
		{
			var
				initialPos,
				initialWidth,
				initialHeight;

			this.element.data( 'panelType', this.widgetName );

			// Load the saved panel position
			initialPos = ( this.isSetting( 'posX' ) && this.isSetting( 'posY' ) ) ?
						 { 'x': this.setting( 'posX' ), 'y': this.setting( 'posY' ) } :
						 { 'x': this.options.position.x, 'y': this.options.position.y };

			// Load the saved panel size
			initialWidth = ( this.isSetting( 'width' ) ) ? this.setting( 'width' ) : this.options.minWidth;
			initialHeight = ( this.isSetting( 'height' ) ) ? this.setting( 'height' ) : this.options.minHeight;

			this.element
				.width( initialWidth )
				.height( initialHeight )
				.css( {
					'position': 'absolute',
					'top': initialPos.y,
					'left': initialPos.x
				} )
				.addClass( this.widgetName );

			this._createEditorFields();

			this._readSettings();

			// Set the default mode
			this.mode( this.options.mode );

			// Set the ordering if one is specified
			if( this.options.ordering !== null )
			{
				this.setOrdering( this.options.ordering );
			}
			else
			{
				// Load the ordering setting
				if( this.isSetting( 'ordering' ) )
				{
					this.element.zIndex( this.setting( 'ordering' ) );
				}
			}
		},

		/**
		 * Name of the storage object for this widget
		 *
		 * @returns {number}
		 * @private
		 */
		_getStorageNamespace: function()
		{
			return this.options.id;
		},

		/**
		 * Gets or sets the mode of this panel
		 *
		 * @param {string} [mode] Acts as setter if provided
		 * @returns {string} Current mode
		 */
		mode: function( mode )
		{
			// Set the mode if provided
			if( mode !== undefined && mode !== this._mode )
			{

				if( mode === this._modeEdit )
				{
					// destroy view mode if required
					if( this._mode === this._modeView )
					{
						this._destroyViewPanel();
					}
					this._drawEditPanel();
					this._mode = this._modeEdit;
				}
				else
				{
					// destroy edit mode if required
					if( this._mode === this._modeEdit )
					{
						this._destroyEditPanel();
					}
					// open view
					this._drawViewPanel();
					this._mode = this._modeView;
				}
			}

			// Return the mode - allows this method to be used as a getter if no mode is passed
			return this._mode;
		},

		/**
		 * Completely removes this panel and all storage records associated with it
		 *
		 * @private
		 */
		_destroy: function()
		{

			// destroy anything specific to whatever mode we are in
			switch( this._mode )
			{
				case this._modeEdit:
					this._destroyEditPanel();
					break;
				case this._modeView:
					this._destroyViewPanel();
					break;
			}

			// Destroy this widget
			this._super();

			// Remove settings for this object from the controller's local storage and remove the element from the DOM
			this.element.parent().trigger( 'deletePanel', this.options.id ).end().remove();
		},

		/**
		 * Creates the editor interface for this panel
		 *
		 * @private
		 */
		_drawEditPanel: function()
		{
			var self = this;
			this.element
				.addClass( 'edit' )
				.html( $( '<div/>', { 'class': 'content', 'text': 'content' } ) )
				// Set the panel to be movable
				.draggable( {
					containment: 'parent',
					grid: [50, 50],
					'handle': '.move-panel',
					start: function()
					{
						self._bringToFront();
					},
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
					handles: 'n,s,e,w,se,sw,nw',
					grid: 50,
					containment: 'parent',
					start: function()
					{
						self._bringToFront();
					},
					stop: function()
					{
						self.setting( 'width', $( this ).width() );
						self.setting( 'height', $( this ).height() );
					}
				} )
				.append(
					$( '<a/>', {'class': 'button delete-panel', 'text': 'x', 'title': 'Delete Panel'} ).click( function()
					{
						if( confirm( 'Are you sure you want to delete this panel?' ) )
						{
							self._destroy();
						}
					} ),
					$( '<a/>', {'class': 'move-panel', 'html': '&equiv;', 'title': 'Move Panel'} )
				)
				.click( function()
				{
					self._bringToFront();
				} );

			if( this.options._editorFieldCount > 0 )
			{
				this._drawEditorFields();
			}

			$( 'body' ).disableSelection();
		},

		/**
		 * Destroys the editor interface for this panel
		 *
		 * @private
		 */
		_destroyEditPanel: function()
		{
			var parent = this.element.parent();

			if( this.options._editorFieldCount > 0 )
			{
				this._saveEditorFieldValues();
			}

			this.element
				.detach()
				.removeClass( 'edit' )
				.draggable( 'destroy' )
				.resizable( 'destroy' )
				.unbind( 'click' )
				.html( '' )
				.appendTo( parent );
			$( 'body' ).removeClass( 'viewing' );
		},

		/**
		 * Creates the view interface for this panel
		 *
		 * @private
		 */
		_drawViewPanel: function()
		{
			this.element
				.addClass( 'view' )
				.html( $( '<div/>', { 'class': 'content', 'text': 'content' } ) );
			if( this.options.refreshable )
			{
				this.element.addClass( 'refresh' );
				this.refreshContent();
			}
		},

		/**
		 * Destroys the view interface for this panel
		 *
		 * @private
		 */
		_destroyViewPanel: function()
		{
			this.element.removeClass( 'view' );
			if( this.options.refreshable )
			{
				this.element.removeClass( 'refresh' );
			}
		},

		/**
		 * Called by the _create method or when panels are reorder by the Panels controller
		 *
		 * @param order New z-index for this panel
		 */
		setOrdering: function( order )
		{
			this.element.zIndex( order );
			this.setting( 'ordering', order );
		},

		/**
		 * Brings this panel to the front
		 *
		 * @private
		 */
		_bringToFront: function()
		{
			this.element.parent().panels( 'setFrontPanel', this );
		},

		/**
		 * Override this method and call this._addEditorField as required in here
		 *
		 * @private
		 */
		_createEditorFields: function()
		{
			if( this.options.refreshable )
			{
				this._addEditorField(
					'select',
					'refreshInterval',
					this.option.refreshInterval,
					'Check for new data',
					{ 'options': [
						{'value': 60, 'display': 'every minute'},
						{'value': 300, 'display': 'every 5 minutes'},
						{'value': 1800, 'display': 'every half hour'},
						{'value': 3600, 'display': 'once an hour'}
					] } );
			}
		},

		/**
		 * Adds an editor field
		 *
		 * @param {String} fieldType Currently supports: bool
		 * @param {String} settingName Name of the setting to be modified by this field
		 * @param {*} defaultValue Default value of the setting
		 * @param {String} [fieldLabel] Label to use for the input. Setting name is used if nothing is provided
		 * @param {Object} [additionalData] additional data required for the display of this input (eg drop down options)
		 * @private
		 */
		_addEditorField: function( fieldType, settingName, defaultValue, fieldLabel, additionalData )
		{
			// Default the field label to settingName if none was provided
			if( fieldLabel === undefined )
			{
				fieldLabel = settingName;
			}

			if( additionalData === undefined )
			{
				additionalData = {};
			}

			// Create the editor fields object
			this.options._editorFields[ settingName ] = {
				'type': fieldType,
				'label': fieldLabel,
				'editorId': 'ef' + (this.options._editorFieldCount = this.options._editorFieldCount + 1),
				'additionalData': additionalData
			};

			// Set the default if it isn't set
			if( this.isSetting( settingName ) === false )
			{
				this.setting( settingName, defaultValue );
			}
		},

		/**
		 * Adds the editor fields to the editor view
		 *
		 * @param {Boolean} [clearContent] Content div will be cleared if TRUE, default: TRUE
		 * @private
		 */
		_drawEditorFields: function( clearContent )
		{
			var
				fieldSetting,
				fieldSettings,
				container = this.element.find( 'div.content' ),
				input,
				inputValue,
				iteratorLimit,
				iterator,
				iteratedValue;

			if( clearContent === undefined || clearContent )
			{
				container.html( '' );
			}
			for( fieldSetting in this.options._editorFields )
			{
				if( this.options._editorFields.hasOwnProperty( fieldSetting ) )
				{
					fieldSettings = this.options._editorFields[ fieldSetting ];
					inputValue = this.setting( fieldSetting );

					switch( fieldSettings.type )
					{
						case 'bool':
							input =
							$( '<input/>', { 'type': 'checkbox', 'checked': parseInt( inputValue, 10 ) === 1 } );
							break;
						case 'text':
							input = $( '<input/>', { 'type': 'text', 'value': inputValue } );
							break;
						case 'select':
							input = $( '<select/>' );
							iteratorLimit = fieldSettings.additionalData.options.length;
							//noinspection JSLint
							for( iterator = 0; iterator < iteratorLimit; iterator++ )
							{
								iteratedValue = fieldSettings.additionalData.options[ iterator ];
								input.append( $( '<option/>',
									{
										'value': iteratedValue.value,
										'text': (
											iteratedValue.display !== undefined
												? iteratedValue.display
												: iteratedValue.value
											),
										'selected': iteratedValue.value.toString() === inputValue
									}
								) );
							}
							break;
						default:
							input = $( '<span/>', {'text': 'Unsupported input type: ' + fieldSettings.type} );
							break;
					}
					container.append(
						$( '<label/>', { 'text': fieldSettings.label } ).append( input.addClass( fieldSettings.editorId ) )
					);
				}
			}
		},

		/**
		 * Save editor field values to settings
		 *
		 * @private
		 */
		_saveEditorFieldValues: function()
		{
			var
				fieldSetting,
				fieldSettings,
				fieldInput,
				settingValue,
				container = this.element.find( 'div.content' );

			// For each editor field, retrieve the field's value and store it in the appropriate setting
			for( fieldSetting in this.options._editorFields )
			{
				if( this.options._editorFields.hasOwnProperty( fieldSetting ) )
				{
					fieldSettings = this.options._editorFields[ fieldSetting ];
					fieldInput = container.find( '.' + fieldSettings.editorId );
					// Retrieve the value from the input
					switch( fieldSettings.type )
					{
						case 'bool':
							settingValue = fieldInput.is( ':checked' ) ? 1 : 0;
							break;
						case 'text':
						case 'select':
							settingValue = fieldInput.val();
							break;
						default:
							settingValue = undefined;
							break;
					}

					// If a valid value has been retrieved, set the setting
					if( settingValue !== undefined )
					{
						this.setting( fieldSetting, settingValue );
					}
				}
			}
			this._readSettings();
		},

		/**
		 * Used to read settings into properties of widgets. Useful for setting flags etc
		 *
		 * Triggered on creation of the widget and when settings are updated
		 *
		 * @private
		 */
		_readSettings: function()
		{
			if( this.options.refreshable )
			{
				this.options.refreshInterval = parseInt( this.setting( 'refreshInterval' ), 10 );
			}
		},

		/**
		 * Hashes the passed string
		 *
		 * @param string
		 * @returns {Object}
		 */
		hash: function( string )
		{
			// JSLint really doesn't like bitwise operations. But they are totally fine here. Probably
			return string.split( "" ).reduce( function( a, b )
				//noinspection JSLint
			{
				a = ((a << 5) - a) + b.charCodeAt( 0 );
				//noinspection JSLint
				return (a & a);
			}, 0 );
		},

		/**
		 * Updates a panel's content after a specified time interval
		 *
		 * @returns {boolean} Indicates if this panel should use refreshing (is refreshable and has a refresh interval)
		 */
		refreshContent: function()
		{
			if( this.options.refreshable )
			{
				this.element.data( 'nextRefresh', (new Date()).getTime() + ( this.options.refreshInterval * 1000 ) );

				return this.options.refreshInterval > 0;
			}

			return false;
		}

	} );
} );
