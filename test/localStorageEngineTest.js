TestCase( 'Local storage engine Widget', {
	"test widget exists": function()
	{
		"use strict";
		// Test for jquery
		assertFunction( jQuery );
		// Test for $ notation
		assertSame( jQuery, $ );
		// Test for jquery widget factory
		assertFunction( $.widget );
		// Test for the widget we want
		assertFunction( $.jqueryDash.localStorageEngine );
	}
} );

TestCase( 'Storage object', {
	widget: null,
	storageObject: null,

	setUp: function()
	{
		"use strict";
		this.widget = new $.jqueryDash.localStorageEngine();
		localStorage.setItem( 'localStorageEngine/test', JSON.stringify( {'key': 'value'} ) );
		this.storageObject = this.widget.getLocalStorageObject( 'test' );
	},
	"test get method": function()
	{
		"use strict";
		assertFunction( this.storageObject.get );
		assertEquals( 'value', this.storageObject.get( 'key' ) );
	},
	"test get method no value": function()
	{
		"use strict";
		assertEquals( undefined, this.storageObject.get( 'not-a-key' ) );
	},
	"test keys method": function()
	{
		"use strict";
		assertFunction( this.storageObject.keys );
		assertEquals( ['key'], this.storageObject.keys() );
	},
	"test set method": function()
	{
		"use strict";
		assertFunction( this.storageObject.set );
		this.storageObject.set( 'key', 'valueSet' );
		assertEquals( {'key': 'valueSet'}, JSON.parse( localStorage.getItem( 'localStorageEngine/test' ) ) );
	},
	"test isSet true": function()
	{
		"use strict";
		assertFunction( this.storageObject.isSet );
		assertTrue( this.storageObject.isSet( 'key' ) );
	},
	"test isSet false": function()
	{
		"use strict";
		assertFunction( this.storageObject.isSet );
		assertFalse( this.storageObject.isSet( 'not-a-key' ) );
	},
	"test remove": function()
	{
		"use strict";
		assertFunction( this.storageObject.remove );
		this.storageObject.remove( 'valueSet' );
		assertUndefined( this.storageObject.get( 'valueSet' ) );
	},
	"test removeAll": function()
	{
		"use strict";
		assertFunction( this.storageObject.removeAll );
		this.storageObject.removeAll();
		assertNull( localStorage.getItem( 'localStorageEngine/test' ) );
	},
	tearDown: function()
	{
		"use strict";
		localStorage.removeItem( 'localStorageEngine/test' );
	}

} );

TestCase( 'Storage interactions', {
	widget: null,

	setUp: function()
	{
		"use strict";
		this.widget = new $.jqueryDash.localStorageEngine();
		localStorage.setItem( 'localStorageEngine/MISSING', JSON.stringify( {'key': 'value'} ) );
	},
	"test namespace fetch": function()
	{
		"use strict";
		assertFunction( this.widget._getStorageNamespace );
		assertTypeOf( 'string', this.widget._getStorageNamespace() );
	},
	"test getStorage": function()
	{
		"use strict";
		assertFunction( this.widget._getStorage );
		assertObject( this.widget._getStorage() );
	},
	"test isSetting": function()
	{
		"use strict";
		assertFunction( this.widget.isSetting );
		assertTrue( this.widget.isSetting( 'key' ) );
		assertFalse( this.widget.isSetting( 'not a key' ) );
	},
	"test listSettings": function()
	{
		"use strict";
		assertFunction( this.widget.listSettings );
		assertEquals( ['key'], this.widget.listSettings() );
	},
	"test getSetting": function()
	{
		"use strict";
		assertFunction( this.widget._getSetting );
		assertEquals( 'value', this.widget._getSetting( 'key' ) );
	},
	"test setSetting": function()
	{
		"use strict";
		assertFunction( this.widget._setSetting );
		this.widget._setSetting( 'key', 'value1' )
		assertEquals( 'value1', this.widget._getSetting( 'key' ) );
		this.widget._setSetting( 'key2', 'value2' )
		assertEquals( 'value2', this.widget._getSetting( 'key2' ) );
	},
	"test setting": function()
	{
		"use strict";
		assertFunction( this.widget.setting );
		assertEquals( 'value1', this.widget.setting( 'key' ) );
		this.widget.setting( 'key', 'value2' );
		assertEquals( 'value2', this.widget.setting( 'key' ) );
	},
	"test removeSetting": function()
	{
		"use strict";
		assertFunction( this.widget.removeSetting );
		this.widget.removeSetting( 'key' );
		assertFalse( this.widget.isSetting( 'key' ) );
	},
	"test removeSettings": function()
	{
		"use strict";
		assertFunction( this.widget.removeSettings );
		this.widget.removeSettings();
		assertFalse( this.widget.isSetting( 'key2' ) );
	},
	tearDown: function()
	{
		"use strict";
		localStorage.removeItem( 'localStorageEngine/MISSING' );
	}

} );

TestCase( 'Widget Destroyed', {
	widget: null,

	setUp: function()
	{
		"use strict";
		this.widget = new $.jqueryDash.localStorageEngine();
		localStorage.setItem( 'localStorageEngine/MISSING', JSON.stringify( {'key': 'value'} ) );
	},
	"test destroy": function()
	 {
	 "use strict";
	 assertFunction( this.widget._destroy );
	 this.widget._destroy();
	 assertNull( localStorage.getItem( 'localStorageEngine/MISSING' ) );
	 },
	tearDown: function()
	{
		"use strict";
		localStorage.removeItem( 'localStorageEngine/MISSING' );
	}
} );
