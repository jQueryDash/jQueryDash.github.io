$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.weatherPanel', $.jqueryDash.panel,
	{
		options:
		{
			refreshable: true,
			url: 'http://api.openweathermap.org/data/2.5/weather?units=metric&q=',
			location: 'Lisburn, UK'
		},
		_createEditorFields: function()
		{
			this.addEditorField( 'text', 'location', this.options.location, 'Location' );
		},
		refreshContent: function()
		{
			var
				self = this,
				refreshEnabled = this._super(),
				onStateChangeHandlers = {};

			onStateChangeHandlers[ XMLHttpRequest.OPENED ] = function( request )
			{
				if( self.options.contentHashed === null )
				{
					self.element.find( 'div.content' ).text( 'Loading...' );
				}
			};

			onStateChangeHandlers[ XMLHttpRequest.DONE ] = function( request )
			{
				var responseJson, icon, description, temp, wind, getWeatherIcon = function(stuff){ return stuff;}, getWindyness = function( stuff ){ return stuff; };

				if( request.responseText === "" )
				{
					return;
				}

				responseJson = JSON.parse( request.responseText );

				temp = $( '<div />', { id: "weather-temp" } ).text( parseInt( responseJson.main.temp, 10 ) );
				icon = $( '<div />', { id: "weather-icon", 'class': getWeatherIcon( responseJson.weather[0].icon ) } );
				description = $( '<div />', { id: "weather-description" } ).text( responseJson.weather[0].description );
				wind = $( '<div />', { id: "weather-wind" } ).text( getWindyness( responseJson.wind.speed ) );
				self.element.find( 'div.content' ).text( '' ).append( temp ).append( icon ).append( description ).append( wind );
			};

			if( this.options.url !== undefined && this.options.url !== '' && this.isSetting( 'location' ) && this.setting( 'location' ) !== '' )
			{
				this.sendGetRequest(
					this.options.url + this.options.location,
					'application/json',
						onStateChangeHandlers
				);
			}
		}
	} );
} );