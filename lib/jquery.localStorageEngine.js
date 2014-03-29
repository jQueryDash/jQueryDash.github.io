$( function()
{

	"use strict";
	$.widget( "jqueryDash.localStorageEngine", {

		options: {
			'cache': {}
		},

		/**
		 * Returns a local storage object either from cache or from localStorage JSON
		 *
		 * @param {String} objectName
		 * @param {boolean} [fromCache] This should only be used for small data stores which are frequently accessed (eg on panel refresh)
		 * @returns {{get: Function, set: Function, remove: Function, removeAll: Function, keys: Function, isSet: Function}}
		 */
		getLocalStorageObject: function( objectName, fromCache )
		{
			var
				self = this,
				storageObject = {},
				dataObject;

			// Caching disabled by default, in case it is accidentally used with a very large data store
			if( fromCache === undefined )
			{
				fromCache = false;
			}

			// Return the cache object if possible
			if( fromCache && this.options.cache[ objectName ] !== undefined )
			{
				storageObject = this.options.cache[ objectName ];
			}
			// Otherwise, parse the localStorage json and return a new storage object
			else
			{

				dataObject = localStorage[ this.widgetName + '/' + objectName ];
				dataObject = JSON.parse( ( dataObject !== undefined ) ? dataObject : '{}' );

				storageObject = {
					_storageKey: self.widgetName + '/' + objectName,
					_data: dataObject,

					/**
					 * Saves a value to the storage object
					 *
					 * @param {String} key
					 * @param {*} value
					 */
					set: function( key, value )
					{
						this._data[ key ] = value;
						localStorage[ this._storageKey ] = JSON.stringify( this._data );
					},

					/**
					 * Removes the specified key from the storage object.
					 * If no key is provided, the storage object is destroyed
					 *
					 * @param {String} [key]
					 */
					remove: function( key )
					{
						if( key === undefined )
						{
							this._data = {};
							if( self.options.cache[ this._storageKey ] !== undefined )
							{
								delete self.options.cache[ this._storageKey ];
							}
							localStorage.removeItem( this._storageKey );
						}
						else
						{
							delete this._data[ key ];
							localStorage[ this._storageKey ] = JSON.stringify( this._data );
						}
					},

					/**
					 * Gets a value from the storage object
					 *
					 * @param {String} key
					 * @returns {*}
					 */
					get: function( key )
					{
						return this._data[ key ];
					},

					/**
					 * Removes the storage object
					 */
					removeAll: function()
					{
						this.remove();
					},

					/**
					 * Returns an array of all of the keys in this storage object
					 *
					 * @returns {String[]}
					 */
					keys: function()
					{
						var
							keys = [],
							key;

						for( key in this._data )
						{
							if( this._data.hasOwnProperty( key ) )
							{
								keys.push( key );
							}
						}

						return keys;
					},

					/**
					 * Tests if the specified key exists in the storage object
					 *
					 * @param key
					 * @returns {boolean}
					 */
					isSet: function( key )
					{
						return ( this._data[ key ] !== undefined );
					}

				};

				// Cache the object if an attempt was made to load it from the cache
				if( fromCache )
				{
					this.options.cache[ objectName ] = storageObject;
				}
			}

			return storageObject;
		},

		/**
		 * Gets or sets the value of the specified setting
		 *
		 * @param {String} settingName
		 * @param {*} [settingValue]
		 * @returns {*}
		 */
		setting: function( settingName, settingValue )
		{
			return ( settingValue === undefined ) ?
				   this._getSetting( settingName ) :
				   this._setSetting( settingName, settingValue );
		},

		/**
		 * Tests of the specified setting is a setting saved to the storage object
		 *
		 * @param {String} settingName
		 * @returns {boolean}
		 */
		isSetting: function( settingName )
		{
			return this._getStorage().isSet( settingName );
		},

		/**
		 * Gets a list of all settings in this storage object
		 *
		 * @returns {String[]}
		 */
		listSettings: function()
		{
			return this._getStorage().keys();
		},

		/**
		 * Removes the specified setting from the storage object
		 *
		 * @param settingName
		 * @returns {*|remove|remove|remove|remove}
		 */
		removeSetting: function( settingName )
		{
			return this._getStorage().remove( settingName );
		},

		/**
		 * Removes the entire storage object.
		 *
		 * This object will not be reusable once this is called
		 */
		removeSettings: function()
		{
			this._getStorage().removeAll();
		},

		/**
		 * Returns the default local storage object for this widget
		 *
		 * @returns {{_storageKey: string, _data: *, get: Function, set: Function, remove: Function, removeAll: Function, keys: Function, isSet: Function}|*}
		 * @private
		 */
		_getStorage: function()
		{
			return this.getLocalStorageObject( this._getStorageNamespace(), true );
		},

		/**
		 * Storage namespace to be used for the default object
		 *
		 * @returns {string}
		 * @private
		 */
		_getStorageNamespace: function()
		{
			return 'MISSING';
		},

		/**
		 * Fetches the specified setting from the storage object
		 *
		 * @param {String} settingName
		 * @returns {*}
		 * @private
		 */
		_getSetting: function( settingName )
		{
			return this._getStorage().get( settingName );
		},

		/**
		 * Sets the specified setting in the storage object
		 *
		 * @param {String} settingName
		 * @param {*} settingValue
		 * @private
		 */
		_setSetting: function( settingName, settingValue )
		{
			this._getStorage().set( settingName, settingValue );
		},

		/**
		 * Clean up local storage allocated to this object when it's destroyed
		 * @private
		 */
		_destroy: function()
		{
			this._super();

			// Remove local storage objects related to this object
			this._getStorage().removeAll();
		}

	} );
} );