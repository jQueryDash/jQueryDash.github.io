/**
 * @author Sam Thompson
 *
 * Panel for handling rss feeds
 */
$( function()
{
	"use strict";
	$.widget( 'jqueryDash.rssPanel', $.jqueryDash.panel, {

		url: null,
		maxEntries: 5,
		contentHashed: null,

		slideTimer: null,
		timePerItem: 10000,

		showItemTitle: true,

		options: {
			minHeight: 50,
			minWidth: 400
		},

		/**
		 * Add settings fields for edit mode
		 *
		 * @private
		 */
		_createEditorFields: function()
		{
			this._super();
			this._addEditorField( 'bool', 'showItemTitle', 1 );
			this._addEditorField( 'text', 'url', '', 'Source URL' );
			this._addEditorField( 'text', 'maxEntries', 5, 'Max Entries' );
			this._addEditorField( 'text', 'slideTime', 10000, 'ms per item' );
		},

		/**
		 * Draws the clock
		 *
		 * @private
		 */
		_drawViewPanel: function()
		{
			var
				request = new XMLHttpRequest(),
				self = this;
			this._super();

			if( this.source !== null )
			{
				//noinspection SpellCheckingInspection
				request.onreadystatechange = function()
				{
					var
						xml,
						entries,
						maxEntry,
						entryIterator,
						hash = '',
						entryObjects = {},
						content,
						slideWidth,
						slideDom;

					switch( request.readyState )
					{
						case XMLHttpRequest.OPENED:
							if( self.contentHashed === null )
							{
								self.element.find( 'div.content' ).text( 'Loading...' );
							}
							break;
						case XMLHttpRequest.DONE:
							xml = request.responseXML;
							entries = xml.getElementsByTagName( 'item' );
							maxEntry = ( entries.length > self.maxEntries ) ? self.maxEntries : entries.length;
							for( entryIterator = 0; entryIterator < maxEntry; entryIterator = entryIterator + 1 )
							{
								entryObjects[ entryIterator ] = $( entries.item( entryIterator ) );
								hash += self.hash( entryObjects[ entryIterator ].text() );
							}

							if( hash !== self.contentHashed )
							{
								self.element.addClass( 'slides' );
								content = self.element.find( 'div.content' ).html( '' );
								slideWidth = self.element.innerWidth() - 4;
								for( entryIterator = 0; entryIterator < maxEntry; entryIterator = entryIterator + 1 )
								{
									slideDom = $( '<div>', {
										'class': 'slide item' + entryIterator,
										'style': 'width:' + slideWidth + 'px'
									} );
									if( self.showItemTitle )
									{
										slideDom.append(
											$( '<div>', { 'class': 'title' } )
												.append(
													$( '<a>', {
														'text': entryObjects[ entryIterator ].find( 'title' ).text(),
														'href': entryObjects[ entryIterator ].find( 'link' ).text(),
														'target': '_blank'
													} )
												)
										);
									}
									slideDom.append( self._createSlideContent( entryObjects[ entryIterator ] ) );
									content.append( slideDom );
								}
								content
									.css( 'width', slideWidth * maxEntry );

								self.slideTimer = setInterval( function()
								{
									var leftPos = self.element.scrollLeft();

									if( leftPos + slideWidth < content.width() )
									{
										self.element.scrollLeft( self.element.scrollLeft() + slideWidth );
									}
									else
									{
										self.element.scrollLeft( 0 );
									}
								}, self.timePerItem );
							}
							break;
					}
				};
				request.open( 'get', 'http://www.corsproxy.com/' + this.url.replace( 'http://', '' ), true );
				request.setRequestHeader( "Content-type", "application/xml; charset=UTF8" );
				request.setRequestHeader( "Accept", "application/xml" );
				request.send();
			}
			else
			{
				self.element.find( 'div.content' ).text( 'Invalid Source URL' );
			}
		},

		/**
		 *
		 * @param {jQuery} slideObject
		 * @returns {text}
		 * @private
		 */
		_createSlideContent: function( slideObject )
		{
			return slideObject.find( 'description' ).text();
		},

		/**
		 * Clears the timer and current time values when the view is destroyed
		 *
		 * @private
		 */
		_destroyViewPanel: function()
		{
			this._super();
			this.contentHashed = null;
			this.element.removeClass( 'slides' );
			clearInterval( this.slideTimer );
		},

		/**
		 * Update the show seconds flag
		 *
		 * @private
		 */
		_readSettings: function()
		{
			this._super();
			this.showItemTitle = parseInt( this.setting( 'showItemTitle' ), 10 ) === 1;
			this.url = this.setting( 'url' );
			this.maxEntries = this.setting( 'maxEntries' );
			this.timePerItem = this.setting( 'slideTime' );
		}

	} );
} );