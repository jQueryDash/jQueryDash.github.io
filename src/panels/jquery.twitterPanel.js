$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.twitterPanel', $.jqueryDash.htmlPanel, {
		options: {
			minHeight: 650,
			minWidth: 550,
			_resizable: false,
			title: "Embed Code"
		},
		_destroyEditPanel: function()
		{
			$( 'script#twitter-wjs' ).remove();
			this._super();
		}
	} );
} );