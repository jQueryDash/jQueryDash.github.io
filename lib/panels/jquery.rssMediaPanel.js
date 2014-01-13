/**
 * @author Sam Thompson
 *
 * Panel for handling rss feeds
 */
$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.rssMediaPanel', $.jqueryDash.rssPanel, {

		options: {
			minHeight: 100,
			minWidth: 100
		},

		/**
		 * Add settings fields for edit mode
		 *
		 * @private
		 */
		_createEditorFields: function()
		{
			this._deprecateEditorField( 'showItemTitle', 0 );
			this._super();
		},

		/**
		 * Extracts the media (currently only images) from the item description for display
		 *
		 * @param {jQuery} slideObject
		 * @returns {text}
		 * @private
		 */
		_createSlideContent: function( slideObject )
		{
			var
				rawContent = slideObject.find( 'description' ).text(),
				mediaContent = rawContent.match(/<img.*?>/);

			return mediaContent !== null ? mediaContent : rawContent;
		}
	} );
} );