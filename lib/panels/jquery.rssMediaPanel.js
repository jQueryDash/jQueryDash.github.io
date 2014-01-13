/**
 * @author Sam Thompson
 *
 * Panel for handling rss feeds and displaying the media from these feeds
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
		 * Override a the parent method's title field as this will not be used by these panels
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