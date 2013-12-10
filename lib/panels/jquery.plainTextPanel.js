/**
 * @author Sam Thompson
 *
 * A simple panel to display a bit of text on the dashboard
 */
$( function()
{
	"use strict";
	$.widget( 'jqueryDash.plainTextPanel', $.jqueryDash.panel, {

		_drawViewPanel: function()
		{
			if( this.isSetting( 'text' ) )
			{
				this._super();
				this.element.find( 'div.content' ).text( this.setting( 'text' ) );
			}
		},

		_drawEditPanel: function()
		{
			this._super();
			this.element.append( $( '<textarea>', { 'text': this.setting( 'text' ) } ) );
		},

		_destroyEditPanel: function()
		{
			this.setting( 'text', this.element.find( 'textarea' ).val() );
			this._super();
		}

	} );
} );