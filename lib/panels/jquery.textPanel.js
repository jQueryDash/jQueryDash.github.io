/**
 * @author Sam Thompson
 *
 * A simple panel to display a bit of text on the dashboard
 */
$( function()
{
	"use strict";

	var editControlsDivName = 'text-controls';

	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.textPanel', $.jqueryDash.panel, {

		options: { _editDialogCompatible: true },

		_drawViewPanel: function()
		{
			this._super();

			if( this.isSetting( 'html' ) )
			{
				this.element.find( 'div.content' ).html( this.setting( 'html' ) );
			}
		},

		/**
		 * Creates a button for the control bar
		 *
		 * @param {string} action
		 * @param {string} [label=action]
		 * @returns {jQuery}
		 * @private
		 */
		_createSimpleControlButton: function( action, label )
		{
			if( label === undefined )
			{
				label = action;
			}
			return $( '<a/>', {'class': 'fa ' + action, 'title': label, 'href': '#'} ).data( 'role', action );
		},

		/**
		 * Creates a button for the control bar with additional content
		 *
		 * @param {string} action
		 * @param {string} content
		 * @param {string} [label=action]
		 * @returns {jQuery}
		 * @private
		 */
		_createControlButtonWithContent: function( action, content, label )
		{
			return this._createSimpleControlButton( action, label ).html( content );
		},

		_drawEditPanel: function()
		{
			var
				contentDiv = this.element.find( 'div.content' ),
				controlsDiv = $( '#' + editControlsDivName );
			this._super();

			//noinspection SpellCheckingInspection
			contentDiv.attr( 'contenteditable', true );

			if( controlsDiv.length === 0 )
			{
				//noinspection SpellCheckingInspection
				this.options.controller.element.append(
					$( '<div/>', {'id': editControlsDivName, 'class': 'above-panels'} )
						.append(
							this._createSimpleControlButton( 'undo' ),
							this._createSimpleControlButton( 'redo' ),
							this._createSimpleControlButton( 'bold' ),
							this._createSimpleControlButton( 'italic' ),
							this._createSimpleControlButton( 'underline' ),
							this._createSimpleControlButton( 'justifyLeft', 'align left' ),
							this._createSimpleControlButton( 'justifyCenter', 'align center' ),
							this._createSimpleControlButton( 'justifyRight', 'align right' ),
							this._createSimpleControlButton( 'justifyFull', 'justify' ),
							this._createSimpleControlButton( 'indent' ),
							this._createSimpleControlButton( 'outdent' ),
							this._createSimpleControlButton( 'insertUnorderedList', 'unordered list' ),
							this._createSimpleControlButton( 'insertOrderedList', 'ordered list' ),
							this._createControlButtonWithContent( 'h1', 'h<sup>1</sup>' ),
							this._createControlButtonWithContent( 'h2', 'h<sup>2</sup>' ),
							this._createControlButtonWithContent( 'p', 'p', 'paragraph' ),
							this._createSimpleControlButton( 'subscript' ),
							this._createSimpleControlButton( 'superscript' )
						)
						.on( 'click', 'a', function( event )
						{
							var role = $( this ).data( 'role' );
							event.preventDefault();
							switch( role )
							{
								case 'h1':
								case 'h2':
								case 'p':
									document.execCommand( 'formatBlock', false, role );
									break;
								default:
									document.execCommand( role, false, null );
									break;
							}
						} )
				);
			}
		},

		_destroyEditPanel: function()
		{
			this.setting(
				'html',
				this.element.find( 'div.content' )
					.attr( 'contenteditable', false )
					.html()
			);
			$( '#' + editControlsDivName ).remove();
			this._super();
		}
	} );

	// textPanel Static Methods
	//noinspection JSUnresolvedVariable
	$.jqueryDash.textPanel.showEditControls = function()
	{
		$( '#' + editControlsDivName ).show();
	};

	//noinspection JSUnresolvedVariable
	$.jqueryDash.textPanel.hideEditControls = function()
	{
		$( '#' + editControlsDivName ).hide();
	};

	$( 'body' ).on( 'click.jqueryDash', '#container.manage', function( event )
	{
		if( $( event.toElement ).parents( '.textPanel' ).length > 0 ||
			$( event.toElement ).parents( '#' + editControlsDivName ).length > 0 )
		{
			event.preventDefault();
			//noinspection JSUnresolvedVariable
			$.jqueryDash.textPanel.showEditControls();
		}
		else
		{
			//noinspection JSUnresolvedVariable
			$.jqueryDash.textPanel.hideEditControls();
		}
	} );
} );