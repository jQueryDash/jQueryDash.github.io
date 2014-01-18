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
			status: 'unknown'
		},

		_getCreateOptions: function()
		{
			return {'additionalPanelClass': this.options.additionalPanelClass + ' statusPanel'};
		},

		refreshContent: function()
		{
			this.setStatus( this.options.status );
		},

		_destroyViewPanel: function()
		{
			this.setStatus();
			this._super();
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
				this.element.addClass( add );
			}
		}

	} );
} );