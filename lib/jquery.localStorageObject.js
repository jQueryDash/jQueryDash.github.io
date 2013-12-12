$( function()
{
	"use strict";
	$.widget( "jqueryDash.localStorageObject", {

		/**
		 *
		 *
		 * @param objectName localStorage key required
		 * @returns {string} JSON
		 * @private
		 */
		_getRawLocalStorageJSON: function( objectName )
		{
			var storageObject = localStorage[ objectName ];
			return ( storageObject !== undefined ) ? storageObject : '{}';
		},

		_getLocalStorageObject: function( objectName )
		{
			var
				namespace = this.widgetName + '/' + objectName,
				storageObject = {
					_localStorageKey: '',
					_data: {},

					_load: function( key, json )
					{
						this._localStorageKey = key;
						this._data = JSON.parse( json );
						return this;
					},

					get: function( key )
					{
						return this._data[ key ];
					},

					set: function( key, value )
					{
						this._data[ key ] = value;
						localStorage[ this._localStorageKey ] = JSON.stringify( this._data );
						return this;
					},

					remove: function( key )
					{
						if( key === undefined )
						{
							delete localStorage[ this._localStorageKey ];
						}
						else
						{
							delete this._data[ key ];
							localStorage[ this._localStorageKey ] = JSON.stringify( this._data );
						}
					},

					keys: function()
					{
						var keys = [], key;

						for( key in this._data )
						{
							if( this._data.hasOwnProperty( key ) )
							{
								keys.push( key );
							}
						}

						return keys;
					},

					isSet: function( key )
					{
						return ( this._data[ key ] !== undefined );
					}
				};

			return storageObject._load(
				namespace,
				( storageObject !== undefined ) ?
				this._getRawLocalStorageJSON( namespace ) :
				'{}'
			);
		},

		setting: function( settingName, settingValue )
		{
			return ( settingValue === undefined ) ?
				   this._getSetting( settingName ) :
				   this._setSetting( settingName, settingValue );
		},

		isSetting: function( settingName )
		{
			return this._getStorage().isSet( settingName );
		},

		listSettings: function()
		{
			return this._getStorage().keys();
		},

		removeSetting: function( settingName )
		{
			return this._getStorage().remove( settingName );
		},

		removeSettings: function()
		{
			this._getStorage().removeAll();
			$.localStorage.remove( this.widgetName + '/' + this._getStorageNamespace() );
		},

		/**
		 * Returns the default local storage object for this widget
		 * @private
		 */
		_getStorage: function()
		{
			return this._getLocalStorageObject( this._getStorageNamespace() );
		},

		_getStorageNamespace: function()
		{
			return 'MISSING';
		},

		_getSetting: function( settingName )
		{
			return this._getStorage().get( settingName );
		},

		_setSetting: function( settingName, settingValue )
		{
			return this._getStorage().set( settingName, settingValue );
		}

	} );
} );