/**
 * @author Sam Thompson
 *
 * Panel for displaying the status of a service
 */
$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.statusPanel', $.jqueryDash.panel, {

		statuses: {
			ok: 'ok',
			warning: 'warning',
			error: 'error',
			unknown: 'unknown'
		},

		options: {
			refreshable: true,
			minHeight: 50,
			minWidth: 50,
			status: 'unknown',
			_minEditorSize: {
				h: 150,
				w: 200
			},
			title: null
		},

		_getCreateOptions: function()
		{
			return {'additionalPanelClass': this.options.additionalPanelClass + ' statusPanel'};
		},

		/**
		 *
		 * @returns {Boolean}
		 */
		refreshContent: function()
		{
			var retVal = this._super();
			if( retVal )
			{
				this.setStatus( this.options.status );
			}
			return retVal;
		},

		_destroyViewPanel: function()
		{
			this.setStatus();
			this._super();
		},

		_createEditorFields: function()
		{
			this._super();
			this.addEditorField( 'text', 'title', this.options.title );
		},

		_readSettings: function()
		{
			this._super();
			this.options.title = this.setting( 'title' );
		},

		/**
		 * Sets the panel's status
		 *
		 * @param {String} [newStatus] Optionally sets status or removes all statuses if not provided
		 */
		setStatus: function( newStatus )
		{
			var
				status,
				remove = '',
				add = '';
			this.options.status = newStatus;
			for( status in this.statuses )
			{
				if( this.statuses.hasOwnProperty( status ) )
				{
					if( status === newStatus )
					{
						add += ' ' + this.statuses[ status ];
					}
					else
					{
						remove += ' ' + this.statuses[ status ];
					}
				}
			}

			if( remove !== '' )
			{
				this.element.removeClass( remove );
			}
			if( add !== '' )
			{
				this.element
					.addClass( add )
					.find( 'div.content' ).html( '' ).append(
						$( '<div/>', {'class': 'title', 'text': this.options.title} ),
						$( '<div/>', {'class': 'status'} )
					);
			}
		}

	} );
} );