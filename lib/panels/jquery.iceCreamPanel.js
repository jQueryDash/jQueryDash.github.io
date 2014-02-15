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
			iceCreamHour: 15,
			minHeight: 100,
			_minEditorSize: {
				h: 100,
				w: 250
			}
		},

		_createEditorFields: function()
		{
			this.deprecateEditorField( 'refreshInterval', this.option.refreshInterval );
			this._super();
			this.addEditorField(
				'select',
				'iceCreamHour',
				this.options.iceCreamHour,
				'Ice Cream Time', { 'options': [
					{value: -1, display: 'All Day'},
					{value: 0, display: '12am'},
					{value: 1, display: '1am'},
					{value: 2, display: '2am'},
					{value: 3, display: '3am'},
					{value: 4, display: '4am'},
					{value: 5, display: '5am'},
					{value: 6, display: '6am'},
					{value: 7, display: '7am'},
					{value: 8, display: '8am'},
					{value: 9, display: '9am'},
					{value: 10, display: '10am'},
					{value: 11, display: '11am'},
					{value: 12, display: '12pm'},
					{value: 13, display: '1pm'},
					{value: 14, display: '2pm'},
					{value: 15, display: '3pm'},
					{value: 16, display: '4pm'},
					{value: 17, display: '5pm'},
					{value: 18, display: '6pm'},
					{value: 19, display: '7pm'},
					{value: 20, display: '8pm'},
					{value: 21, display: '9pm'},
					{value: 22, display: '10pm'},
					{value: 23, display: '11pm'}
				] } );
			this.addEditorField(
				'select',
				'iceCreamDay',
				this.options.iceCreamDay,
				'Ice Cream Day', { 'options': [
					{value: 0, display: 'Every Day'},
					{value: 1, display: 'Monday'},
					{value: 2, display: 'Tuesday'},
					{value: 3, display: 'Wednesday'},
					{value: 4, display: 'Thursday'},
					{value: 5, display: 'Friday'},
					{value: 6, display: 'Saturday'},
					{value: 7, display: 'Sunday'}
				] } );
		},

		_readSettings: function()
		{
			this.options.iceCreamDay = parseInt( this.setting( 'iceCreamDay' ), 10 );
			this.options.iceCreamHour = parseInt( this.setting( 'iceCreamHour' ), 10 );
		},

		refreshContent: function()
		{
			var
				now = new Date(),
				previousState = this.options.isIceCreamTime;

			this.options.isIceCreamTime =
			( this.options.iceCreamDay === 0 || now.getDay() === this.options.iceCreamDay )
				&&
			( this.options.iceCreamHour === -1 || now.getHours() === this.options.iceCreamHour );

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

		_drawViewPanel: function()
		{
			this.options.isIceCreamTime = null;
			this._super();
		}
	} );
} );