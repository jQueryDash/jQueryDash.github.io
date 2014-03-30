$( function()
{
	"use strict";
	//noinspection JSUnresolvedVariable
	$.widget( 'jqueryDash.weatherPanel', $.jqueryDash.panel,
		{
			options: {
				minHeight: 100,
				minWidth: 450,
				_resizable: false,
				refreshable: true,
				contentHashed: null,
				url: 'http://api.openweathermap.org/data/2.5/weather?units=metric&q=',
				_minEditorSize: {
					h: 100,
					w: 250
				},
				location: 'Lisburn, UK'
			},
			_createEditorFields: function()
			{
				this._super();
				this.addEditorField( 'text', 'location', this.options.location, 'Location' );
			},
			refreshContent: function()
			{
				var
					self = this,
					refreshEnabled = this._super(),
					onStateChangeHandlers = {},
					hash = '';

				onStateChangeHandlers[ XMLHttpRequest.OPENED ] = function( request )
				{
					if( self.options.contentHashed === null )
					{
						self.element.find( 'div.content' ).text( 'Loading...' );
					}
				};

				onStateChangeHandlers[ XMLHttpRequest.DONE ] = function( request )
				{
					var responseJson;

					if( request.responseText === "" )
					{
						return;
					}

					if( refreshEnabled )
					{
						hash = self.hash( request.responseText + self.setting( 'location' ) );
					}

					if( !refreshEnabled || hash !== self.options.contentHashed )
					{
						if( refreshEnabled )
						{
							self.options.contentHashed = hash;
						}

						responseJson = JSON.parse( request.responseText );

						self.element.find( 'div.content' )
							.text( '' )
							.append(
								$( '<div />',
									{
										'class': 'temp',
										'text': parseInt( responseJson.main.temp, 10 )
									}
								),
								$( '<div />', { 'class': 'icon ' +
														 self.getWeatherIconClass( responseJson.weather[0].icon )
									}
								),
								$( '<div />', { 'class': 'title', 'text': self.setting( 'location' ) } ),
								$( '<div />', { 'class': 'description', 'text': responseJson.weather[0].description } ),
								$( '<div />', { 'class': 'wind', 'text': self.getWindyness( responseJson.wind.speed ) } )
							);
					}
				};

				if(
					this.options.url !== undefined
						&& this.options.url !== ''
						&& this.isSetting( 'location' )
						&& this.setting( 'location' ) !== ''
					)
				{
					this.sendGetRequest(
						this.options.url + this.options.location,
						'application/json',
						onStateChangeHandlers
					);
				}
			},

			/**
			 *
			 * @param {float} windSpeed
			 * @returns {string}
			 */
			getWindyness: function( windSpeed )
			{
				var wind = '';

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
				}

				return wind;
			},

			/**
			 *
			 * @param {string} iconIdentifier
			 * @returns {string}
			 */
			getWeatherIconClass: function( iconIdentifier )
			{
				var iClass = '';
				switch( iconIdentifier )
				{
					case '01d':
					case '01n':
						iClass = 'clear';
						break;
					case "02d":
					case "02n":
						iClass = 'few-clouds';
						break;
					case "03d":
					case "03n":
						iClass = 'scattered-clouds';
						break;
					case "04d":
					case "04n":
						iClass = 'broken-clouds';
						break;
					case "09d":
					case "09n":
						iClass = 'shower-rain';
						break;
					case "10d":
					case "10n":
						iClass = 'rain';
						break;
					case "11d":
					case "11n":
						iClass = 'thunderstorm';
						break;
					case "13d":
					case "13n":
						iClass = 'snow';
						break;
					case "50d":
					case "50n":
						iClass = 'mist';
						break;
				}
				return iClass;
			},

			/**
			 *
			 * @private
			 */
			_readSettings: function()
			{
				this._super();
				this.options.location = this.setting( 'location' );
			}
		} );
} );