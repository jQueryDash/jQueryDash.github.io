/**
 * @author Sam Thompson
 *
 * Panel for displaying the status of a service retrieved from a web page
 */
$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.statusWebPanel', $.jqueryDash.statusPanel, {

		options: {
			url: null,
			contentHashed: null,
			matchExpression: 'All Systems Operational'
		},

		/**
		 * Add settings fields for edit mode
		 *
		 * @private
		 */
		_createEditorFields: function()
		{
			this._super();
			this._addEditorField( 'text', 'url', this.options.url, 'Source URL' );
		},

		/**
		 * Clears the timer and current time values when the view is destroyed
		 *
		 * @private
		 */
		_destroyViewPanel: function()
		{
			this._super();
			this.options.contentHashed = null;
		},

		/**
		 * Update the show seconds flag
		 *
		 * @private
		 */
		_readSettings: function()
		{
			this._super();
			this.options.url = this.setting( 'url' );
		},

		refreshContent: function()
		{
			var
				self = this,
				refreshEnabled = this._super(),
				url;

			if( this.isSetting( 'url' ) && this.setting( 'url' ) !== '' )
			{
				this.sendGetRequest(
					this.options.url,
					'text/html',
					function()
					{
						var
							html,
							newStatus,
							hash = '',
							content;
						switch( this.readyState )
						{
							case XMLHttpRequest.OPENED:
								if( self.options.contentHashed === null )
								{
									self.element.find( 'div.content' ).text( 'Loading...' );
								}
								break;
							case XMLHttpRequest.DONE:
								html = this.response;
								if( html === null )
								{
									 if( self.options.contentHashed === null )
									{
										self.element.find( 'div.content' ).text( 'Unable to load feed source' );
									}
									return;
								}
								if( refreshEnabled )
								{
									hash += self.hash( html );
								}

								if( !refreshEnabled || hash !== self.options.contentHashed )
								{
									if( refreshEnabled )
									{
										self.options.contentHashed = hash;
									}
									newStatus = self.determineStatus( html );
									if( self.options.status !== newStatus )
									{
										self.setStatus( newStatus );
									}
								}
								break;
						}
					}
				);
			}
			else
			{
				this.element.find( 'div.content' ).text( 'Invalid Source URL' );
			}
		},

		/**
		 *
		 * @param content
		 */
		determineStatus: function( content )
		{
			return content.match( new RegExp( this.options.matchExpression, 'im' ) ) !== null
				? this.statuses.ok
				: this.statuses.error;
		}

	} );
} );