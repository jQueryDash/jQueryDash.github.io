$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.htmlPanel', $.jqueryDash.panel, {
		options: {
			minHeight: 300,
			minWidth: 300,
			title: "HTML"
		},
		_createEditorFields: function()
		{
			this.addEditorField( 'textarea', 'html', '', this.options.title );
		},
		_drawViewPanel: function()
		{
			this._super();

			if( this.isSetting( 'html' ) )
			{
				this.element.find( 'div.content' ).html( this.setting( 'html' ) );
			}
		}
	} );
} );