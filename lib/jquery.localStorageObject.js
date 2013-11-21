$( function()
{
	"use strict";
	$.widget( "jqueryDash.localStorageObject", {

		_getLocalStorageObject: function( objectName )
		{
			//noinspection JSUnresolvedFunction
			return $.initNamespaceStorage( this.widgetName + '/' + objectName ).localStorage;
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
		 * @returns {localStorage|*|localStorage}
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