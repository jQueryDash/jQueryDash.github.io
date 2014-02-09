TestCase( 'Widget', {
	"test exists": function()
	{
		assertFunction( 'localStorage is a widget', $.jqueryDash.localStorageEngine );
	}
} );

TestCase( 'Stored values', {
	obj: null,
	setUp: function()
	{
		"use strict";
		this.obj = new $[ 'jqueryDash' ][ 'localStorageEngine' ]();
	},
	"test nothing stored": function()
	{
		"use strict";
		var storageKey = 'test';
		localStorage.removeItem( storageKey );

		assertEquals( 'Stored value', {}, this.obj._getJSONObject( storageKey ) );
	},
	"test object stored": function()
	{
		"use strict";
		var
			storageKey = 'test',
			storedValue = {'key': 'value'};
		localStorage.setItem( storageKey, JSON.stringify( storedValue ) );

		assertEquals( 'Stored value', storedValue, this.obj._getJSONObject( storageKey ) );
	}
} );

