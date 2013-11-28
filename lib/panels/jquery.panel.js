/**
 * @author Sam Thompson
 *
 * Provides basic UI functionality of a panel
 */
$( function()
{
	"use strict";
	$.widget( "panels.panel", $.jqueryDash.localStorageObject, {

		_mode: 'init',
		_modeEdit: 'edit',
		_modeView: 'view',


		options: {
			id: 0,
			mode: this._modeView,
			minWidth: 196,
			minHeight: 196,
			defaults: {
				w: 200,
				h: 200,
				x: 8,
				y: 9
			}
		},

		_create: function()
		{
			var
				initialPos,
				initialWidth,
				initialHeight;

			// Load the saved panel position
			initialPos = ( this.isSetting( 'posX' ) && this.isSetting( 'posY' ) ) ?
						 { 'x': this.setting( 'posX' ), 'y': this.setting( 'posY' ) } :
						 { 'x': this.options.defaults.x, 'y': this.options.defaults.y };

			// Load the saved panel size
			initialWidth = ( this.isSetting( 'width' ) ) ? this.setting( 'width' ) : this.options.defaults.w;
			initialHeight = ( this.isSetting( 'height' ) ) ? this.setting( 'height' ) : this.options.defaults.h;

			this.element
				.width( initialWidth )
				.height( initialHeight )
				.css( {
					'position': 'absolute',
					'top': initialPos.y,
					'left': initialPos.x
				} );

			// Set the default mode
			this.mode( this.options.mode );
		},

		_getStorageNamespace: function()
		{
			return this.options.id;
		},

		/**
		 * Gets or sets the mode of this panel
		 *
		 * @param {string} mode Optional - Acts as setter if provided
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
		 * Completely removes this widget
		 * @private
		 */
		_destroy: function()
		{
			// Remove settings for this object from this, and the controller's local storage
			this.removeSettings();
			this.element.parent().trigger( 'deletePanel', this.options.id );

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

			// remove the element from the DOM
			this.element.remove();

			// Destroy this widget
			this._super();
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
				// Set the panel to be movable
				.draggable( {
					containment: 'parent',
					grid: [50, 50],
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
					grid: 50,
					containment: 'parent',
					stop: function()
					{
						self.setting( 'width', $( this ).width() );
						self.setting( 'height', $( this ).height() );
					}
				} )
				.append(
					$( '<a>', {'class': 'button delete-panel', 'text': 'x'} ).click( function()
					{
						if( confirm( 'Are you sure you want to delete this panel?' ) )
						{
							self._destroy();
						}
					} )
				);
		},

		/**
		 * Destroys the editor interface for this panel
		 *
		 * @private
		 */
		_destroyEditPanel: function()
		{
			var parent = this.element.parent();
			this.element
				.detach()
				.draggable( 'destroy' )
				.resizable( 'destroy' )
				.html( '' )
				.appendTo( parent );
		},

		/**
		 * Creates the view interface for this panel
		 *
		 * @private
		 */
		_drawViewPanel: function()
		{
			this.element.html( 'content' );
		},

		/**
		 * Destroys the view interface for this panel
		 *
		 * @private
		 */
		_destroyViewPanel: function()
		{
			this.element.html( '' );
		}

	} );
} );