$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.iceCreamPanel', $.jqueryDash.panel,
			{
				options: {

				},
				_drawViewPanel: function()
				{
					this.element.find( "div.content" ).css( "textAlign", "center" ).append( $( "<p/>", { "text": "Is it time for Ice Cream?" } ) );

					var now = new Date();
					if( now.getDay() === 5 && now.getHours() === 15 )
					{
						this.element.find( "div.content" ).append( $( "<h1/>", { "text": "Yes" } ) );
					}
					else
					{
						this.element.find( "div.content" ).append( $( "<h1/>", { "text": "No" } ) );
					}
				}
			} );
} );