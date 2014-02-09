$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.iceCreamPanel', $.jqueryDash.panel, {
		options: {
			refreshable: true,
			refreshInterval: 60,
			isIceCreamTime: null,
			iceCreamDay: 5,
			iceCreamHour: 15
		},
		refreshContent: function()
		{
			var
				now = new Date(),
				previousState = this.options.isIceCreamTime;

			this.options.isIceCreamTime =
			now.getDay() === this.options.iceCreamDay && now.getHours() === this.options.iceCreamHour;

			if( previousState !== this.options.isIceCreamTime )
			{
				this.element.find( "div.content" )
					.html( '' )
					.append(
						$( "<p/>", { "text": "Is it time for Ice Cream?" } ),
						$( "<h1/>", { "text": this.options.isIceCreamTime ? 'Yes' : 'No' } )
					);
			}
		},

		_createEditorFields: function()
		{
			this.deprecateEditorField( 'refreshInterval', this.option.refreshInterval );
			this._super();
		}
	} );
} );