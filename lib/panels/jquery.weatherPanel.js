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
				var responseJson, icon, description, temp, wind, getWeatherIcon = function(stuff){ return stuff;};

				if( request.responseText === "" )
				{
					return;
				}

				responseJson = JSON.parse( request.responseText );

				temp = $( '<div />', { id: "weather-temp" } ).text( parseInt( responseJson.main.temp, 10 ) );
				icon = $( '<div />', { id: "weather-icon", 'class': getWeatherIcon( responseJson.weather[0].icon ) } );
				description = $( '<div />', { id: "weather-description" } ).text( responseJson.weather[0].description );
				wind = $( '<div />', { id: "weather-wind" } ).text( self.getWindyness( responseJson.wind.speed ) );
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
		},
		getWindyness: function( windSpeed )
		{
			var wind;

			switch( true )
			{
				case windSpeed <= 0.2:
					wind = "Calm";
					break;
				case windSpeed >= 0.3 && windSpeed <= 1.5:
					wind = "Light Air";
					break;
				case windSpeed >= 1.6 && windSpeed <= 3.3:
					wind = "Light Breeze";
					break;
				case windSpeed >= 3.4 && windSpeed <= 5.4:
					wind = "Gentle Breeze";
					break;
				case windSpeed >= 5.5 && windSpeed <= 7.9:
					wind = "Moderate Breeze";
					break;
				case windSpeed >= 8.0 && windSpeed <= 10.7:
					wind = "Fresh Breeze";
					break;
				case windSpeed >= 10.8 && windSpeed <= 13.8:
					wind = "Strong Breeze";
					break;
				case windSpeed >= 13.9 && windSpeed <= 17.1:
					wind = "High Wind";
					break;
				case windSpeed >= 17.2 && windSpeed <= 20.7:
					wind = "Gale";
					break;
				case windSpeed >= 20.8 && windSpeed <= 24.4:
					wind = "Severe Gale";
					break;
				case windSpeed >= 24.5 && windSpeed <= 28.4:
					wind = "Storm";
					break;
				case windSpeed >= 28.5 && windSpeed <= 32.6:
					wind = "Violent Storm";
					break;
				case windSpeed >= 32.7:
					wind = "Hurricane";
					break;
				default:
					wind = "";
			}

			return wind;
		},
		getWeatherIconClass: function( iconIdentifier )
		{
			switch( iconIdentifier )
			{

			}
		}
	} );
} );