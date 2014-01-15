/**
 * @author Sam Thompson
 *
 * A simple panel to display a bit of text on the dashboard
 */
$( function()
{
	"use strict";
	$.widget( 'jqueryDash.HTMLPanel', $.jqueryDash.panel, {

		editControlsDivName: 'editControls',

		_destroyViewPanel: function()
		{
			// We don't want to remove the panel's contents here, just make them editable
		},

		_drawViewPanel: function()
		{
			this._super();

			if( this.isSetting( 'html' ) )
			{
				this.element.find( 'div.content' ).html( this.setting( 'html' ) );
			}
		},

		_drawEditPanel: function()
		{
			var contentDiv = this.element.find( 'div.content' );
			this._super();

			contentDiv.attr( 'contenteditable', 'true' );

			if( contentDiv.html() === '' )
			{
				contentDiv.html( 'Put your text in here' );
			}

			// Rather than adding the edit controls every time we load the dashboard, or even only if we have HTML panels,
			// the editControls are added only if we have an HTML panel and are editing the dashboard.
			// And only if we haven't already added one.
			// Once we have the edit controls it won't be removed again, but rather hidden until it is needed again.
			if( $( '#' + this.editControlsDivName ).length === 0 )
			{
				this.options.controller.element.append( '<div id="' + this.editControlsDivName + '"><div>\
					<a data-role="undo" href="javascript:void(0)">\
						<i class="fa fa-undo"></i>\
					</a>\
					<a data-role="redo" href="javascript:void(0)">\
						<i class="fa fa-repeat"></i>\
					</a>\
					<a data-role="bold" href="javascript:void(0)">\
						<i class="fa fa-bold"></i>\
					</a>\
					<a data-role="italic" href="javascript:void(0)">\
						<i class="fa fa-italic"></i>\
					</a>\
					<a data-role="underline" href="javascript:void(0)">\
						<i class="fa fa-underline"></i>\
					</a>\
					<a data-role="strikeThrough" href="javascript:void(0)">\
						<i class="fa fa-strikethrough"></i>\
					</a>\
					<a data-role="justifyLeft" href="javascript:void(0)">\
						<i class="fa fa-align-left"></i>\
					</a>\
					<a data-role="justifyCenter" href="javascript:void(0)">\
						<i class="fa fa-align-center"></i>\
					</a>\
					<a data-role="justifyRight" href="javascript:void(0)">\
						<i class="fa fa-align-right"></i>\
					</a>\
					<a data-role="justifyFull" href="javascript:void(0)">\
						<i class="fa fa-align-justify"></i>\
					</a>\
					<a data-role="indent" href="javascript:void(0)">\
						<i class="fa fa-indent"></i>\
					</a>\
					<a data-role="outdent" href="javascript:void(0)">\
						<i class="fa fa-outdent"></i>\
					</a>\
					<a data-role="insertUnorderedList" href="javascript:void(0)">\
						<i class="fa fa-list-ul"></i>\
					</a>\
					<a data-role="insertOrderedList" href="javascript:void(0)">\
						<i class="fa fa-list-ol"></i>\
					</a>\
					<a data-role="h1" href="javascript:void(0)">h\
						<sup>1</sup>\
					</a>\
					<a data-role="h2" href="javascript:void(0)">h\
						<sup>2</sup>\
					</a>\
					<a data-role="p" href="javascript:void(0)">p</a>\
					<a data-role="subscript" href="javascript:void(0)">\
						<i class="fa fa-subscript"></i>\
					</a>\
					<a data-role="superscript" href="javascript:void(0)">\
						<i class="fa fa-superscript"></i>\
					</a>\
				</div>\
				</div>' );
				$( '#' + this.editControlsDivName ).hide();
				$( '#' + this.editControlsDivName + ' a' ).click( function()
				{
					switch( $( this ).data( 'role' ) )
					{
						case 'h1':
						case 'h2':
						case 'p':
							document.execCommand( 'formatBlock', false, $( this ).data( 'role' ) );
							break;
						default:
							document.execCommand( $( this ).data( 'role' ), false, null );
							break;
					}
				} );
			}
		},

		_destroyEditPanel: function()
		{
			this.setting( 'html', this.element.find( 'div.content' ).html() );
			$( '#' + this.editControlsDivName ).hide();
			this._super();
		},

		showEditControls: function()
		{
			$( '#' + this.editControlsDivName ).show();
		},

		hideEditControls: function()
		{
			$( '#' + this.editControlsDivName ).hide();
		}
	} );

	$( 'body' ).on( 'focus.HTMLPanel', '.panel.HTMLPanel.edit div.content', function()
	{
		$( this ).parent().HTMLPanel( 'showEditControls' );
	});

	$( 'body' ).on( 'blur.HTMLPanel', '.panel.HTMLPanel.edit div.content', function()
	{
		$( this ).parent().HTMLPanel( 'hideEditControls' );
	} );
} );