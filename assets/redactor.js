/*
	Redactor v6.1.1
	http://imperavi.com/
 
	Copyright 2010, Imperavi Ltd.
	Dual licensed under the MIT or GPL Version 2 licenses.
	
	EXAMPLE
	$('#content').redactor();
*/
var LOOP_LEVEL = 0;
var LOOP_SIZE = 100;
var isCtrl = false;
RedactorActive = false;
RedactorColorMode = false;
RedactorTable = false;

var $table = false;
var $tbody = false; 
var $thead = false; 
var $tfoot = false; 
var $current_tr = false;
var $current_td = false;
var $table_tr = false;
var $table_td = false;
var twidth;
		
		
(function($){


	// Initialization	
	$.fn.redactor = function(options)
	{				
		var obj = new Construct(this, options);
		
		obj.init();
		return obj;
	};

	
	// Options and variables	
	function Construct(el, options) {

		this.opts = $.extend({	
			toolbar: 'original',
			lang: 'ru',		
			pageview: false,
			fullscreen: false,
			autosave: false,
			saveInterval: 60, // seconds
			resize: true,
			visual: true,
			focus: false,
			upload: 'upload.php',
			uploadParams: '',
			uploadFunction: false,
			width: false,
			height: false,
			autoclear: true,
			autoformat: true,
			overlay: true,
			colors: Array(
				'#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646',
				'#f2f2f2', '#7f7f7f', '#ddd9c3', '#c6d9f0', '#dbe5f1', '#f2dcdb', '#ebf1dd', '#e5e0ec', '#dbeef3', '#fdeada',
				'#d8d8d8', '#595959', '#c4bd97', '#8db3e2', '#b8cce4', '#e5b9b7', '#d7e3bc', '#ccc1d9', '#b7dde8', '#fbd5b5',
				'#bfbfbf', '#3f3f3f', '#938953', '#548dd4', '#95b3d7', '#d99694', '#c3d69b', '#b2a2c7', '#b7dde8', '#fac08f',
				'#a5a5a5', '#262626', '#494429', '#17365d', '#366092', '#953734', '#76923c', '#5f497a', '#92cddc', '#e36c09',
				'#7f7f7f', '#0c0c0c', '#1d1b10', '#0f243e', '#244061', '#632423', '#4f6128', '#3f3151', '#31859b', '#974806'),
			path: '',
			pathCss: 'css/',
			css: ['blank.css']
		}, options);
		
		this.$el = $(el);
	};

	// Functionality
	Construct.prototype = {
	
		init: function()
		{	
			this.cssUrl = Array();
			

			// get redactor css path
			if (this.opts.path == '')
			{
				path = '';
				$("script").each(function(i,s)
				{
					if (s.src && s.src.match(/redactor\.js/)) path = s.src.replace(/redactor\.js/, '');
				});
				this.opts.path = path;
			}
			if (this.opts.pathCss.substr(0,1) != '/') this.opts.pathCss = this.opts.path + this.opts.pathCss;
			for (key in this.opts.css)
			{
				if (this.opts.css[key].substr(0,1) != '/') this.cssUrl[key] = this.opts.pathCss + this.opts.css[key];
				else this.cssUrl[key] = this.opts.css[key];
			}
			
			// lang
			$('head').append($('<script type="text/javascript" src="' + this.opts.path + 'langs/' + this.opts.lang + '.js"></script>')); 									

			// sizes and id
	   		this.frameID = this.$el.attr('id');
	   		this.width = this.$el.css('width');
	   		this.height = this.$el.css('height');    		
	   		
	   		// overlay
	   		if ($('#redactor_imp_modal_overlay').size() == 0)
	   		{
		   		this.overlay = $('<div id="redactor_imp_modal_overlay" style="display: none;"></div>');
		   		$('body').prepend(this.overlay);
		   	}
	   		
	   		// create container
			this.box = $('<div id="imp_redactor_box_' + this.frameID + '" style="width: ' + this.width + ';" class="imp_redactor_box"></div>');
	
	 		 // create iframe
			this.frame = $('<iframe frameborder="0" marginheight="0" marginwidth="0" vspace="0" hspace="0" scrolling="auto"  id="imp_redactor_frame_' + this.frameID + '" style="height: ' + this.height + ';" class="imp_redactor_frame"></iframe>');
	   	
			this.$el.hide();	   	
	   	
			// append
			$(this.box).insertAfter(this.$el).append(this.frame).append(this.$el);

 			// toolbar
			$('head').append($('<script type="text/javascript" src="' + this.opts.path + 'toolbars/' + this.opts.toolbar + '.js"></script>')); 						
	   		this.toolbar = $('<ul id="imp_redactor_toolbar_' + this.frameID + '" class="imp_redactor_toolbar"></ul>');
			$(this.box).prepend(this.toolbar);
			this.buildToolbar();


			// resizer
			if (this.opts.resize)
			{
				this.resizer = $('<div id="imp_redactor_resize' + this.frameID + '" class="imp_redactor_resize"><div></div></div>');
				$(this.box).append(this.resizer);
	
	           $(this.resizer).mousedown(function(e) { this.initResize(e) }.bind(this));
			}
			
			
			// enable	
	   		this.enable(this.$el.val());

			$(this.doc).click(function() { this.hideAllDropDown() }.bind(this));

			$(this.doc).bind('paste', function(e)
			{ 
				if (this.opts.autoclear) setTimeout(function () { this.clearWord(); }.bind(this), 1000);
				else this.syncCode();
					
			}.bind(this));

			
			// doc events
   			$(this.doc).keydown(function(e)
		    {
		        if (e.ctrlKey || e.metaKey) isCtrl = true;
		        
		        if (this.opts.autoclear) 
		        {
		        	if (e.keyCode == 86 && isCtrl) { setTimeout(function () { this.clearWord(); }.bind(this), 1000); }	
		        }
		        	        
		        if (e.keyCode == 9) { this.execCommand('indent', false); return false; }
		        if (e.keyCode == 66 && isCtrl) { this.execCommand('bold', 'bold'); return false; }
		        if (e.keyCode == 73 && isCtrl) { this.execCommand('italic', 'italic'); return false; }	 
		               
		    }.bind(this)).keyup(function(e)
		    {
		        isCtrl = false;			        
		        this.syncCode();		        	        
		    }.bind(this));
			
			
			// autosave	
			if (this.opts.autosave)	
			{	
				setInterval(function()
				{
					var html = this.getHtml();
					$.post(this.opts.autosave, { data: html });
				}.bind(this), this.opts.saveInterval*1000);
				
			}			

			// focus
			if (this.opts.focus) this.frame.get(0).contentWindow.focus();
		},
		
		/* 	
			API 
		*/
		setHtml: function(html)
		{
			this.doc.open();
			this.doc.write(this.getEditorDoc(html));
			this.doc.close();
			this.docObserve();
		},
		getHtml: function()
		{
			return this.doc.body.innerHTML;
		},
		getCode: function()
		{
			if (this.opts.visual)
			{
				this.formatHtml();
				var html = this.getHtml();
				html = this.tidyUp(html);
				
				return html;
			}
			else
			{
				return this.$el.val();
			}
		},			
		focus: function()
		{
			this.frame.get(0).contentWindow.focus();	
		},	
		
		
		/* 	
			Enable 
		*/	
		enable: function(html)
		{				
	   		this.doc = this.contentDocumentFrame(this.frame);
	   		
			// flash replace
			html = html.replace(/\<object([\w\W]*?)\<\/object\>/gi, '<p class="redactor_video_box"><object$1</object></p>');	   		
	   		
			this.doc.open();
			this.doc.write(this.getEditorDoc(html));
			this.doc.close();

			this.designMode();		
		},
		getEditorDoc: function(html)
		{
			css = '';
			for (key in this.cssUrl)
			{
				css += '<link media="all" type="text/css" href="' + this.cssUrl[key] + '" rel="stylesheet">';
			}

	    	var frameHtml = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n';
			frameHtml += '<html><head>' + css + '</head><body>';
			frameHtml += html;
			frameHtml += '</body></html>';
			return frameHtml;
		},	
		contentDocumentFrame: function(frame)
		{	
			frame = frame.get(0);
	
			if (frame.contentDocument) return frame.contentDocument;
			else if (frame.contentWindow && frame.contentWindow.document) return frame.contentWindow.document;
			else if (frame.document) return frame.document;
			else return null;
		},
		designMode: function()
		{
			if (this.doc)
			{
				this.doc.designMode = 'on';
				this.frame.load(function()
				{ 				
					if ($.browser.msie) $(this.doc.body).css('padding', '0');
					
					this.docObserve();			
	   				this.doc.designMode = 'on'; 
	   			}.bind(this));
			}
		},
		
		/* 
			SYNC Code and HTML
		*/
		syncCode: function()
		{
			var html = this.getHtml();
			html = this.tidyUp(html);
	
			html = html.replace(/\%7B/gi, '{');
			html = html.replace(/\%7D/gi, '}');
	
			html = html.replace(/<hr class="redactor_cut">/gi, '<!--more-->');
			html = html.replace(/<hr class=redactor_cut>/gi, '<!--more-->');
	
			this.$el.val(html);
		},	
		
		/*
			Format on submit form 
		*/
		formSets: function()
		{
			var oldOnsubmit = null;		
	
			var theForm = $(this.box).parents('form');
			if (theForm.length == 0) return false;
	
			oldOnsubmit = theForm.get(0).onsubmit;
	
			if (typeof theForm.get(0).onsubmit != "function")
			{
				theForm.get(0).onsubmit = function()
				{
	          		if (this.opts.visual)
					{
						this.paragraphise();
						this.syncCode();
						
						return true;
					}
				}.bind(this)
			}
			else
			{
				theForm.get(0).onsubmit = function()
				{
	            	if (this.opts.visual)
					{
						this.paragraphise();
						this.syncCode();
	
						return oldOnsubmit();
					}
				}.bind(this)
			}
	
			return true;
		},					
			
		/*
			Tidy and format
		*/	
		clearWord: function()
		{
			
			
			var html = this.getHtml();
			html = CleanWHtml(html);			
			
	
			
			html = this.tidyUp(html);	
			this.setHtml(html);
			
			this.paragraphise();			
			
			this.formatHtml(html);			
			
		},		
		tidyUp: function(html)
		{
			if (typeof($) == 'undefined') return html;
			
			if ($.browser.msie)
			{
		      	var match = html.match(/<(.*?)>/gi);
				$.each(match, function(i,s)
				{
					html = html.replace(s, s.toLowerCase());
				}) 
			}
	
			html = html.replace(/<p><br><\/p>/gi, '');
			
			var re= new RegExp('<font[^><]*>|<\/font[^><]*>','g')
			html = html.replace(re,'');
					
			if ($.browser.mozilla) html = this.convertSpan(html);
			
			return html;
		},
		convertSpan: function(html)
		{
			html = html.replace(/\<span(.*?)style="font-weight: bold;"\>([\w\W]*?)\<\/span\>/gi, "<b>$2</b>");
			html = html.replace(/\<span(.*?)style="font-style: italic;"\>([\w\W]*?)\<\/span\>/gi, "<i>$2</i>");
			html = html.replace(/\<span(.*?)style="font-weight: bold; font-style: italic;"\>([\w\W]*?)\<\/span\>/gi, "<i><b>$2</b></i>");
			html = html.replace(/\<span(.*?)style="font-style: italic; font-weight: bold;"\>([\w\W]*?)\<\/span\>/gi, "<b><i>$2</i></b>");
	
			return html;
	  	},
		formatHtml: function(html)
		{

			if (typeof(html) == 'undefined') var html = this.getHtml();
			this.cleanHTML(html);
		},
		finishTabifier: function(code)
		{
			code=code.replace(/\n\s*\n/g, "\n");  //blank lines
			code=code.replace(/^[\s\n]*/, ''); // leading space
			code=code.replace(/[\s\n]*$/, ''); // trailing space
		
			this.$el.val(code);
			LOOP_LEVEL=0;
		},
		cleanHTML: function(code)
		{
			
			var i=0;
			var point=0, start=null, end=null, tag='', out='', cont='';
			this.cleanAsync(code, i, point, start, end, tag, out, cont);
			
		},		
		cleanAsync: function(code, i, point, start, end, tag, out, cont)
		{
			var iStart=i;
			for (; i<code.length && i<iStart+LOOP_SIZE; i++)
			{
				point = i;
		
			//if no more tags, copy and exit
			if (-1 == code.substr(i).indexOf('<'))
			{
				out+=code.substr(i);
				this.finishTabifier(out);
				return;
			}

			//copy verbatim until a tag
			while ('<'!=code.charAt(point)) point++;
			if (i!=point) {
				cont=code.substr(i, point-i);
				if (!cont.match(/^\s+$/)) {
					if ('\n'==out.charAt(out.length-1)) {
						out+=tabs();
					} else if ('\n'==cont.charAt(0)) {
						out+='\n'+tabs();
						cont=cont.replace(/^\s+/, '');
					}
					cont=cont.replace(/\s+/g, ' ');
					out+=cont;
				} if (cont.match(/\n/)) {
					out+='\n'+tabs();
				}
			}
			start=point;

			//find the end of the tag
			while ('>'!=code.charAt(point)) point++;
			tag=code.substr(start, point-start);
			i=point;

			//if this is a special tag, deal with it!
			if ('!--'==tag.substr(1,3)) {
				if (!tag.match(/--$/)) {
					while ('-->'!=code.substr(point, 3)) point++;
					point+=2;
					tag=code.substr(start, point-start);
					i=point;
				}
				if ('\n'!=out.charAt(out.length-1)) out+='\n';
				out+=tabs();
				out+=tag+'>\n';
			} else if ('!'==tag[1]) {
				out=placeTag(tag+'>', out);
			} else if ('?'==tag[1]) {
				out+=tag+'>\n';
			} else if (t=tag.match(/^<(script|style)/i)) {
				t[1]=t[1].toLowerCase();
				tag=cleanTag(tag);
				out=placeTag(tag, out);
				end=String(code.substr(i+1)).toLowerCase().indexOf('</'+t[1]);
				if (end) {
					cont=code.substr(i+1, end);
					i+=end;
					out+=cont;
				}
			} else {
				tag=cleanTag(tag);
				out=placeTag(tag, out);
			}
		}


			if (i<code.length) setTimeout(function() { this.cleanAsync(code, i, point, start, end, tag, out, cont) }.bind(this), 0);
			else this.finishTabifier(out);
		},	  				
			

		/*
			Paragraphise
		*/
		paragraphise: function()
		{
			if (this.opts.autoformat === false) return true;
			if (this.opts.visual)
			{
				var theBody = this.doc.body;
	
				/* Remove all text nodes containing just whitespace */
				for (var i = 0; i < theBody.childNodes.length; i++)
				{
					if (theBody.childNodes[i].nodeName.toLowerCase() == "#text" && theBody.childNodes[i].data.search(/^\s*$/) != -1)
					{
						theBody.removeChild(theBody.childNodes[i]);
						i--;
					}
				}
	
				var removedElements = new Array();
				for (var i = 0; i < theBody.childNodes.length; i++)
				{
					if (theBody.childNodes[i].nodeName.isInlineName())
					{
						removedElements.push(theBody.childNodes[i].cloneNode(true));
						theBody.removeChild(theBody.childNodes[i]);	
						i--;
					}
					else if (theBody.childNodes[i].nodeName.toLowerCase() == "br")
					{
						if (i + 1 < theBody.childNodes.length)
						{
							if (theBody.childNodes[i + 1].nodeName.toLowerCase() == "br")
							{
								while (i < theBody.childNodes.length && theBody.childNodes[i].nodeName.toLowerCase() == "br")
								{
									theBody.removeChild(theBody.childNodes[i]);
								}
	
								if (removedElements.length > 0)
								{
									this.insertNewParagraph(removedElements, theBody.childNodes[i]);
									removedElements = new Array();
								}
							}
							else if (!theBody.childNodes[i + 1].nodeName.isInlineName()) theBody.removeChild(theBody.childNodes[i]);
							else if (removedElements.length > 0)
							{
								removedElements.push(theBody.childNodes[i].cloneNode(true));	
								theBody.removeChild(theBody.childNodes[i]);
							}
							else theBody.removeChild(theBody.childNodes[i]);
							i--;
						}
						else theBody.removeChild(theBody.childNodes[i]);
					}
					else if (removedElements.length > 0)
					{
						this.insertNewParagraph(removedElements, theBody.childNodes[i]);
						removedElements = new Array();
					}
				}
	
				if (removedElements.length > 0) this.insertNewParagraph(removedElements);
			}
	
			return true;
		},
		insertNewParagraph: function(elementArray, succeedingElement)
		{
			var theBody = this.doc.getElementsByTagName("body")[0];
			var theParagraph = this.doc.createElement("p");
	
			for (var i = 0; i < elementArray.length; i++) theParagraph.appendChild(elementArray[i]);
	
			if (typeof(succeedingElement) != "undefined") theBody.insertBefore(theParagraph, succeedingElement);
			else theBody.appendChild(theParagraph);
	
			return true;
		},

		/*
			Selection
		*/			
		get_selection: function ()
		{
			if (this.frame.get(0).contentWindow.getSelection) return this.frame.get(0).contentWindow.getSelection();
			else if (this.frame.get(0).contentWindow.document.selection) return this.frame.contentWindow.get(0).document.selection.createRange();
		},		
			
		/*
			Exec
		*/		
		execCommand: function(cmd, param)
		{		
			if (this.opts.visual)
			{
				if (this.doc)
				{
	    			try
		    		{
	    				this.frame.get(0).contentWindow.focus();
		    		

		    			if (cmd == 'inserthtml' && jQuery.browser.msie) this.doc.selection.createRange().pasteHTML(param);
		    			else   			
						{
							this.doc.execCommand(cmd, false, param);
							if (param == "blockquote" || param == 'pre')
							{
	    			    		this.doc.body.appendChild(this.doc.createElement("BR"));
						    }					
						}
					}
					catch (e) { }
					
					this.syncCode();		
				}
			}
		},
		
		/*
			Fullscreen
		*/		
		fullscreen: function()
		{	
			if (this.opts.fullscreen === false)
			{
				this.addSelButton('fullscreen');					
				this.opts.fullscreen = true;
				if (this.resizer) this.resizer.hide();	
				
				this.height = this.frame.css('height');
				this.width = (this.box.width() - 2) + 'px';
				
				var html = this.getHtml();

				this.box.css({ position: 'absolute', top: 0, left: 0, zIndex: 10000 }).after('<span id="fullscreen_' + this.frameID +  '"></span>');
				
				$(document.body).prepend(this.box).css('overflow', 'hidden');

				this.enable(html);
								
				this.fullScreenResize();				
				$(window).resize(function() { this.fullScreenResize(); }.bind(this));
				$(document).scrollTop(0,0);
			}
			else
			{
				this.opts.fullscreen = false;
						
				this.removeSelButton('fullscreen');					

				$(window).unbind('resize', function() { this.fullScreenResize(); }.bind(this));	
				$(document.body).css('overflow', '');		

	
				if (this.resizer) this.resizer.show();			
				
				var html = this.getHtml();	
				
				
				this.box.css({ position: 'relative', top: 'auto', left: 'auto', zIndex: 1, width: this.width });
				
				$('#fullscreen_' + this.frameID).after(this.box).remove();			

				this.enable(html);
				
				this.frame.css('height', this.height);						
				this.$el.css('height', this.height);									
		
			}
		},
		fullScreenResize: function()
		{
			if (this.opts.fullscreen === false) return;
			
			var height = $(window).height() - 42;
			
			this.box.width($(window).width() - 2);
			this.frame.height(height);		
			this.$el.height(height);	
		},
		
		/*
			Toggle
		*/
		toggle: function()
		{
			if (this.opts.visual)
			{
				this.addSelButton('html');
				
				this.frame.hide();
	
				this.paragraphise();
	
				
				var html = this.getHtml();
								
				html = this.tidyUp(html);
				html = html.replace(/\%7B/gi, '{');
				html = html.replace(/\%7D/gi, '}');
	
	
				// flash replace
				html = html.replace(/<p(.*?)class="redactor_video_box"(.*?)>([\w\W]*?)\<\/p>/gi, "$3");

				// cut replace	
				html = html.replace(/<hr class="redactor_cut">/gi, '<!--more-->');
				html = html.replace(/<hr class=redactor_cut>/gi, '<!--more-->');
				
				this.formatHtml(html);
	
				
				this.$el.show().focus();
	
				this.opts.visual = false;
			}
			else
			{
				this.removeSelButton('html');
				this.$el.hide();
	
				var html = this.$el.val();
				
				// cut replace
				html = html.replace(/<!--more-->/gi, '<hr class="redactor_cut">');
	
				// flash replace
				html = html.replace(/\<object([\w\W]*?)\<\/object\>/gi, '<p class="redactor_video_box"><object$1</object></p>');
	
				this.doc.body.innerHTML = html;
				
				this.frame.show();
				this.focus();
				
				this.opts.visual = true;
				this.docObserve();
			}
		},		
		
		docObserve: function()
		{
			$(this.doc).find('body').find('img').click(function(e) { this.imageEdit(e); }.bind(this));
			$(this.doc).find('body').find('table').click(function(e) { this.showTable(true, e); }.bind(this));
		},			
		
		/*
			Video
		*/
		showVideo: function()
		{
			RedactorActive = this;
			this.modalInit(RLANG.video, this.opts.path + 'plugins/video.html', 600, 360);
		},	
		insertVideo: function()
		{
			var data = $('#redactor_insert_video_area').val();
			if (RedactorActive.opts.visual) data = '<div class="redactor_video_box">' + data + '</div>';
	
			RedactorActive.execCommand('inserthtml', data);
			this.modalClose();
			
		},	

		
		/*
			Charmap
		*/		
		showCharmap: function()
		{
			RedactorActive = this;
			
			var handler = function()
			{
				this.renderCharMapHTML('#redactor_charmap');
			}.bind(this);
			
			this.modalInit(RLANG.charmap, this.opts.path + 'plugins/char.html', 600, 420, handler);
	
	
		},
		renderCharMapHTML: function (element)
		{
			var _self = this;
			for (var i=0; i<charmap.length; i++)
			{
				if (charmap[i][2]==true)
				{

					var click_func = charmap[i][0];
					var a = $('<a href="javascript:void(null);" id="redactor_charmap_' + i + '" title="' + charmap[i][3] + '" rel="' + charmap[i][0] + '">' + charmap[i][1] + '</a>').click(function (e) { this.insert_char(e) }.bind(this));
					$(element).append(a);
	
	
				}
			 }
	
		},
		insert_char: function (e)
		{
			var chr = $(e.target).attr('rel');
			RedactorActive.execCommand('inserthtml', chr);
			this.modalClose();
		},		
		
		/*
			Cut
		*/
		setCut: function()
		{
			this.execCommand('inserthtml', '<hr class="redactor_cut" />');
		},				
		
		/*
			Image
		*/	
		imageEdit: function(e)
		{
			var handler = function()
			{
				var $el = $(e.target);
				var src = $el.attr('src');		
				$('#redactor_image_edit_src').attr('href', src);
				$('#redactor_image_edit_delete').click(function() { this.deleteImage(e.target);  }.bind(this));
				$('#redactorSaveBtn').click(function() { this.imageSave(e.target);  }.bind(this));

				$('#redactor_file_alt').val($el.attr('alt'));
				
				var float = $el.css('float');
				if (float == 'none') float = 0;
				
				$('#redactor_form_image_align').val(float);

			}.bind(this);		
		
			RedactorActive = this;		
			this.modalInit(RLANG.image, this.opts.path + 'plugins/image_edit.html', 350, 290, handler);
		},
		imageSave: function(el)
		{
			$(el).attr('alt', $('#redactor_file_alt').val());
	
			var style = '';
			if ($('#redactor_form_image_align') != 0)
			{
				var float = $('#redactor_form_image_align').val();
				
				if (float == 'left') $(el).css({ float: 'left', marginRight: '10px', marginBottom: '10px' });
				else if (float == 'right')  $(el).css({ float: 'right', marginLeft: '10px', marginBottom: '10px' });
			}
			else $(el).css({ float: 'none', margin: 0 });

			this.modalClose();
		},
		deleteImage: function(el)
		{
			$(el).remove();
			this.modalClose();
		},		
		showImage: function()
		{
			this.spanid = Math.floor(Math.random() * 99999);
			if (jQuery.browser.msie)
			{
				this.execCommand('inserthtml', '<span id="span' + this.spanid + '"></span>');
			}
			
			var handler = function()
			{
				var params = '';

				if (this.opts.uploadFunction) var params = this.opts.uploadFunction();
				this.uploadInit('redactorInsertImageForm', { url: this.opts.upload + params, trigger: 'redactorUploadBtn', success: function() {
					this.imageUploadCallback();
				}.bind(this)  });			

			}.bind(this);
			
		
			RedactorActive = this;
			this.modalInit(RLANG.image, this.opts.path + 'plugins/image.html', 450, 330, handler);
		},
		imageUploadCallback: function(data)
		{
			if ($('#redactor_file_link').val() != '') data = $('#redactor_file_link').val();
			var alt = $('#redactor_file_alt').val();
	
			var style = '';
			if ($('#redactor_form_image_align') != 0)
			{
				var float = $('#redactor_form_image_align').val();
				
				if (float == 'left') style = 'style="float: left; margin-right: 10px; margin-bottom: 10px;"';
				else if (float == 'right') style = 'style="float: right; margin-left: 10px; margin-bottom: 10px;"';
				
				var html = '<img alt="' + alt + '" src="' + data + '" ' + style + ' />';
			}
			else
			{
				var html = '<p><img alt="' + alt + '" src="' + data + '" /></p>'; 
			}
		
			RedactorActive.frame.get(0).contentWindow.focus();
			
			if ($.browser.msie)
			{		
				$(RedactorActive.doc.getElementById('span' + RedactorActive.spanid)).after(html);
				$(RedactorActive.doc.getElementById('span' + RedactorActive.spanid)).remove();
			}	
			else
			{
				RedactorActive.execCommand('inserthtml', html);
			}
	
			this.modalClose();
			this.docObserve();			
	
		},				
		
		/*
			Table
		*/
		showTable: function(edit, e)
		{		
			RedactorActive = this;
			
			var handler = function()
			{				
				if (edit === true) 
				{
					RedactorTable = $(e.target).parent().parent().parent()
					var table_tmp = RedactorTable.clone();
					
					if ($("tbody",table_tmp).size() == 0)
					{
						var html = $('<div>').append(table_tmp.html($('<tbody>').append(table_tmp.html()))).html();
					}
					else var html = $('<div>').append(table_tmp).html();
					$('#imp_redactor_table_box').html($(html));
					$('#imp_modal_link_delete_table').show();

				}
				else
				{
					$('#imp_modal_link_delete_table').hide();
				}
			
				this.tableGrid();
				
			}.bind(this);
			
			this.modalInit(RLANG.table, this.opts.path + 'plugins/table.html', 840, 460, handler, true);
		},
		insertTable: function()
		{			
			var html = this.getTableCode();
			
			if (RedactorTable !== false)
			{
				RedactorTable = $(RedactorTable).after(html).remove();				
				RedactorTable = false;
			}
			else RedactorActive.execCommand('inserthtml', html);
			
			this.docObserve();			
			this.modalClose();
		},
		
		/*
			Table funcs
		*/	
		deleteTable: function()
		{
			if (RedactorTable !== false) 
			{
				$(RedactorTable).remove();
				RedactorTable = false;
				this.docObserve();					
			}
			this.modalClose();
		},	
		tableGrid: function()
		{
			$table = $('#imp_redactor_table_box table');
			$tbody = $("tbody",$table);
			$thead = $("thead",$table);	
			if ($thead.size() == 0) $thead = false;
			$table_tr = $table.find('tr');
		 	$table_td = $table.find('td');
		 	
			this.resizeTDWidth($table.width());		 
			this.setFocus();	
			this.resizeTD();		
		},
		setFocus: function()
		{
			var _self = this;
			$table_td.each(function(i, s)
			{	
					
				var tr = $(s).parent();
			
				$(s).attr({ 'contenteditable': true }).click(function()
				{ 
					_self.overTR(s, tr); 
				}.bind(this));
			});
		},		
		overTR: function(td, tr)
		{
			$current_tr = tr;
			$current_td = td;
		},		
		getTableCode: function()
		{
			var table_tmp = $table.clone();
			
			table_tmp.find('td').removeAttr('contenteditable');	
			table_tmp.find('thead').find('td').each(function()
			{
				$(this).html($(this).text());
			});
			
			var html = $('<div>').append(table_tmp).html();	
			
			return html;
		},
		resizeTD: function()
		{	
			if ($thead !== false)
			{
				var tds = $thead.find('td');
				var size = tds.size()-1;
				twidth = $table.width();
				
				tds.each(function(i,s)
				{
					if (i == size) return true;	
					$(s).html($('<div class="imp_td_resize">' + $(s).html() + '<span class="imp_td_resize_drag"></span></div>'));
				});
				
				$('.imp_td_resize_drag').mousedown(function(e) { this.initTDResize(e) }.bind(this));				
			}
		},	
		resizeTDWidth: function(twidth)
		{
			if ($thead !== false)
			{		
				$thead.find('td').each(function()
				{
					var width = $(this).width()/(twidth/100);				
					$(this).css('width', width + '%');		
				});
			}
		},
		initTDResize: function(e)
		{
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			
			this.stopResizeHdl = function (e) { this.stopTDResize(e) }.bind(this);
			this.startResizeHdl = function (e) { this.startTDResize(e) }.bind(this);
			this.resizeHdl =  function (e) { this.resizeMoveTD(e) }.bind(this);
			
			
			this.splitter = e.target;
			this.element_resize = $($(e.target).parent());
			
			$(document).mousedown(this.startResizeHdl);
			$(document).mouseup(this.stopResizeHdl);
			$(this.splitter).mouseup(this.stopResizeHdl);
	
			this.null_point = e.pageX;
			this.w_new = this.element_resize.width();
		},		
		startTDResize: function()
		{			
			$(document).mousemove(this.resizeHdl);
		},		
		resizeMoveTD: function(e)
		{
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;

			if (e.pageX < this.null_point)
			{
				s_new = this.w_new - (this.null_point - e.pageX) - 12;
			}
			else s_new = this.w_new + (e.pageX - this.null_point);

			if (s_new >= 80) 
			{
		
				this.element_resize.width(s_new);	
	
				var parent = this.element_resize.parent();
				var target = parent.next();
				var parent_width = parent.width()/(twidth/100);
				
				var s_width = s_new/(twidth/100);		
				var target_width = target.width()/(twidth/100);
				
				parent.css('width',  s_width + '%');
				target.css('width',  (target_width + (parent_width-s_width)) + '%');				
			}	
		},		
		stopTDResize: function(e)
		{
			$(document).unbind('mousemove', this.resizeHdl);
			$(document).unbind('mousedown', this.startResizeHdl);
			$(document).unbind('mouseup', this.stopResizeHdl);
			$(this.splitter).unbind('mouseup', this.stopResizeHdl);

			this.resizeTDWidth(twidth);
			this.element_resize.css('width', '100%');	
		},		
		
		addHead: function()
		{
			if ($table.find('thead').size() != 0) this.deleteHead();
			else
			{
				var tr = $tbody.find('tr').first().clone();
				tr.find('td').html('Head');
				$thead = $('<thead>');
				$thead.append(tr);
				$table.prepend($thead);
				
				this.tableGrid();
			}
		},		
		deleteHead: function()
		{
			$($thead).remove();	
			$thead = false;	
			this.tableGrid();	
		},		
		addRow: function()
		{	
			if ($current_tr !== false)
			{
				var tag = $($current_tr).parent().get(0).tagName;
				
				if (tag != 'THEAD')
				{
					var new_tr = $($current_tr).clone();
					new_tr.find('td').html('&nbsp;');
					$current_tr.after(new_tr);
				}
				else
				{
					var new_tr = $tbody.find('tr').first().clone();
					new_tr.find('td').html('&nbsp;');
					$tbody.prepend(new_tr);
				}
			}
			else
			{
				var tmp_tr = $tbody.find('tr').last();
				var new_tr = $(tmp_tr).clone();	
				new_tr.find('td').html('&nbsp;');	
				$tbody.append(new_tr);
			}	
			
			this.tableGrid();
		},
		deleteRow: function()
		{
			if ($current_tr !== false)
			{
				$($current_tr).remove();
				this.tableGrid();
			}
		},
		addCell: function()
		{
			if ($current_td !== false)
			{
				var index = $($current_td).attr('cellIndex');
			
				$table_tr.each(function(i,s)
				{	
					var current = $(s).find('td').eq(index);
					
					if ($(current).parent().parent().get(0).tagName != 'THEAD') var html = '&nbsp;';
					else var html = 'Head';		
								
					var td = current.clone();	
					td.html(html);
					$(current).after(td);
				});
			}
			else
			{
				$table_tr.each(function(i,s)
				{
					var td = $(s).find('td').last().clone();	
					
					if ($(s).parent().parent().get(0).tagName != 'THEAD') var html = ' ';
					else var html = 'Head';
					
					td.html(html);
					$(s).append(td);
				});
			}	
			
			this.tableGrid();
		},
		deleteCell: function()
		{
			if ($current_td !== false)
			{
				var index = $($current_td).attr('cellIndex');
				
				$table_tr.each(function()
				{	
					$(this).find('td').eq(index).remove();
		
				});		
					
				this.tableGrid();
			}
		},

		
		
		
		/*
			Link
		*/				
		showLink: function()
		{
			RedactorActive = this;

			var handler = function()
			{
				var sel = this.get_selection();
				if ($.browser.msie)
				{
						var temp = sel.htmlText.match(/href="(.*?)"/gi);
						if (temp != null)
						{
							temp = new String(temp);
							temp = temp.replace(/href="(.*?)"/gi, '$1');
						}

  					 	var text = sel.text;
						if (temp != null) var url = temp;
						else  var url = '';
						var title = '';
				}
				else
				{
					if (sel.anchorNode.parentNode.tagName == 'A')
					{
						var url = sel.anchorNode.parentNode.href;
						var text = sel.anchorNode.parentNode.text;
						var title = sel.anchorNode.parentNode.title;
						if (sel.toString() == '') this.insert_link_node = sel.anchorNode.parentNode

					}
					else
					{
					 	var text = sel.toString();
						var url = '';
						var title = '';
					}
				}

				$('#redactor_link_url').val(url);
				$('#redactor_link_text').val(text);
				$('#redactor_link_title').val(title);			
			}.bind(this);

			this.modalInit(RLANG.link, this.opts.path + 'plugins/link.html', 400, 300, handler);
	
		},	
		insertLink: function()
		{
			var value = $('#redactor_link_text').val();
			if (value == '') return true;
			
			var title = $('#redactor_link_title').val();
			if (title != '') title = ' title="' + $('#redactor_link_title').val() + '"';			
			
			if ($('#redactor_link_id_url').get(0).checked)  var mailto = '';
			else var mailto = 'mailto:';
			
			var a = '<a href="' + mailto + $('#redactor_link_url').val() + '"' + title +'>' + value + '</a> ';
	
			if (a)
			{
				if (this.insert_link_node)
				{
					$(this.insert_link_node).text(value);
					$(this.insert_link_node).attr('href', $('#redactor_link_url').val());
					
					var title = $('#redactor_link_title').val();
					if (title != '') $(this.insert_link_node).attr('title', title);
	
					return true;
				}
				else
				{
					RedactorActive.frame.get(0).contentWindow.focus();
					RedactorActive.execCommand('inserthtml', a);
				}
			}
			this.modalClose();
		},
		
		/*
			Color
		*/
		showFgcolor: function(e)
		{
			if (this.opts.visual)
			{
				$(e.target).addClass('redactor_colortooltip');			
			
				RedactorColorMode = 'ForeColor';
				RedactorActive = this;
				this.colorPicker(e);
			}
		},
		showHilite: function(e)
		{
			if (this.opts.visual)
			{
				$(e.target).addClass('redactor_colortooltip');
			
				if ($.browser.msie) var mode = 'BackColor';
				else var mode = 'hilitecolor';
				
				RedactorColorMode = mode;
				RedactorActive = this;
				this.colorPicker(e);
			}
		},	
		
	
		/*
			Colorpicker
		*/		
		colorPicker: function(e)
		{			
			this.dialogOpen = false;
			
	
			if ($('#cmts_colorpicker_redactor').length) this.colorPickertoggle(e);
			else this.colorPickerbuild(e);			
		
		},
		colorPickerbuild: function(e)
		{
			this.dialog = $('<div>').attr('id', 'cmts_colorpicker_redactor').css({ display: 'none', position: 'absolute', 'border': '1px solid #ddd', padding: '4px', background: '#fff', zIndex: 10000 });
			var swatchTable = $('<div>').css({'overflow': 'hidden',  'width': '190px'});
	
			if ($.browser.msie) this.dialog.css('border', '1px solid #ddd');
	
			var len = this.opts.colors.length;
			for (var i = 0; i < len; ++i)
			{
				var color = this.opts.colors[i];
				
				var swatch = $('<div title="' + color + '"></div>').css({'width': '15px', 'float': 'left', cursor: 'pointer', 'height': '15px', 'fontSize': '1px', 'border': '2px solid #fff', 'backgroundColor': color, 'padding': '0'});		
				$(swatch).appendTo(swatchTable).click(function(e) { this.colorPickerset(e); }.bind(this));
			}
	
			$(swatchTable).appendTo(this.dialog);	
			$('body').append(this.dialog);

			this.colorPickershow(e);
		},
		colorPickerset: function(e)
		{	
			var color = $(e.target).attr('title');		

			RedactorActive.execCommand(RedactorColorMode, color);
	
			this.colorPickerhide(e);
		},
		colorPickertoggle: function(e)
		{			
			if (!this.dialogOpen) this.colorPickershow(false);
			else this.colorPickerhide(false);
		},
		colorPickershow: function(e)
		{	
			$('#cmts_colorpicker_redactor').css({ top: ($('#imp_redactor_toolbar_' + this.frameID).offset().top + 36) + 'px', left: e.clientX  + 'px',  display: '' }).fadeIn();	
			$(document).click( function(e) { this.colorPickerhide(e); }.bind(this));	
			$(this.doc).click( function() { this.colorPickerhide(false); }.bind(this));					
			this.dialogOpen = true;
		},
		colorPickerhide: function(e)
		{	
			if (e !== false && $(e.target).hasClass('redactor_colortooltip')) return false;
		
		
			$('#cmts_colorpicker_redactor').fadeOut();
			$(document).unbind('click', function(e) { this.colorPickerhide(e); }.bind(this));		
			$(this.doc).unbind('click', function() { this.colorPickerhide(false); }.bind(this));		
			this.dialogOpen = false;
		},				
		
		/*
			Toolbar
		*/
		buildToolbar: function()
		{	

			$.each(RTOOLBAR, 
	   			function (i, s)
	   			{
	   				if (s.name == 'separator')
	   				{
						var li = $('<li class="separator"></li>');
		   				$(this.toolbar).append(li);	   			
	   				}
	   				else
	   				{
	   			
						var a = $('<a href="javascript:void(null);" class="imp_btn imp_btn_' + s.name + '" title="' + s.title + '"></a>');
						
						if (typeof(s.func) == 'undefined') a.click(function() { this.execCommand(s.exec, s.name); }.bind(this));
						else if (s.func != 'show') a.click(function(e) { this[s.func](e); }.bind(this));
						
						var li = $('<li class="imp_li_btn imp_li_btn_' + s.name + '"></li>');
						$(li).append(a);   						   						
		   				$(this.toolbar).append(li);
	
						// toolbar drop down
						if (typeof(s.dropdown) != 'undefined')
						{
							var ul = $('<ul class="imp_redactor_drop_down imp_redactor_drop_down' + this.frameID + '" id="imp_redactor_drop_down' + this.frameID + '_' + s.name + '" style="display: none;"></ul>');
							
							if ($.browser.msie) ul.css({ borderLeft: '1px solid #ddd',  borderRight: '1px solid #ddd',  borderBottom: '1px solid #ddd' });
										
							$.each(s.dropdown,
		   						function (x, d)
								{
									if (typeof(d.style) == 'undefined') d.style = '';
									var ul_li = $('<li></li>');
									var ul_li_a = $('<a href="javascript:void(null);" style="' + d.style + '">' + d.title + '</a>');
									$(ul_li).append(ul_li_a); 
									$(ul).append(ul_li);
									
									if (typeof(d.func) == 'undefined') $(ul_li_a).click(function() { this.execCommand(d.exec, d.name); }.bind(this));
									else $(ul_li_a).click(function(e) { this[d.func](e); }.bind(this));
									  									
								}.bind(this)
							);
	
							$('#imp_redactor_toolbar_' + this.frameID).after(ul);
			
							
							this.hdlHideDropDown = function(e) { this.hideDropDown(e, ul, s.name) }.bind(this);
							this.hdlShowDropDown = function(e) { this.showDropDown(e, ul, s.name) }.bind(this);
							this.hdlShowerDropDown = function(e) { this.showerDropDown(e, ul, s.name) }.bind(this);   	
	
							a.click(this.hdlShowDropDown).mouseover(this.hdlShowerDropDown);  							
	
							$(document).click(this.hdlHideDropDown);
						}
						else a.mouseover(function() { this.hideAllDropDown() }.bind(this));	
						
					}
	   			}.bind(this)
	   		);		
		},
		
	

		/*
			DropDown
		*/
		showedDropDown: false,
		showDropDown: function(e, ul, name)
		{
		
			if (this.showedDropDown) this.hideAllDropDown();
			else
			{
				this.showedDropDown = true;
				this.showingDropDown(e, ul, name);
			}		
				
		},
		showingDropDown: function(e, ul, name)
		{
			this.hideAllDropDown();
			 		
	   		this.addSelButton(name);
	   		
			var left = $('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn_' + name).position().left;
			$(ul).css('left', left + 'px').show();	   		
	
		},
		showerDropDown: function(e, ul, name)
		{
			if (this.showedDropDown) this.showingDropDown(e, ul, name);
		},
		hideAllDropDown: function()
		{
			$('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn').removeClass('act');
	   		$('ul.imp_redactor_drop_down' + this.frameID).hide();
		},
		hideDropDown: function(e, ul, name)
		{
			if (!$(e.target).parent().hasClass('act'))
			{
				this.showedDropDown = false;
				this.hideAllDropDown();
			
			}	
		
			$(document).unbind('click', this.hdlHideDropDown);
			$(this.doc).unbind('click', this.hdlHideDropDown);
			
		},
		addSelButton: function(name)
		{
			var element = $('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn_' + name);
			element.addClass('act');
		},
		removeSelButton: function(name)
		{
			var element = $('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn_' + name);
			element.removeClass('act');
		},	
		toggleSelButton: function(name)
		{
			$('#imp_redactor_toolbar_' + this.frameID + ' li.imp_li_btn_' + name).toggleClass('act');
		},
			
	
		/*
			Resizer
		*/
		initResize: function(e)
		{	
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			
			this.splitter = e.target;
	
			if (this.opts.visual)
			{
				this.element_resize = this.frame;
				this.element_resize.get(0).style.visibility = 'hidden';
				this.element_resize_parent = this.$el;
			}
			else
			{
				this.element_resize = this.$el;
				this.element_resize_parent = this.frame;
			}
	
			this.stopResizeHdl = function (e) { this.stopResize(e) }.bind(this);
			this.startResizeHdl = function (e) { this.startResize(e) }.bind(this);
			this.resizeHdl =  function (e) { this.resize(e) }.bind(this);
	
			$(document).mousedown(this.startResizeHdl);
			$(document).mouseup(this.stopResizeHdl);
			$(this.splitter).mouseup(this.stopResizeHdl);
	
			this.null_point = false;
			this.h_new = false;
			this.h = this.element_resize.height();
		},
		startResize: function()
		{
			$(document).mousemove(this.resizeHdl);
		},
		resize: function(e)
		{
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			
			var y = e.pageY;
			if (this.null_point == false) this.null_point = y;
			if (this.h_new == false) this.h_new = this.element_resize.height();
	
			var s_new = (this.h_new + y - this.null_point) - 10;
	
			if (s_new <= 30) return true;
	
			if (s_new >= 0)
			{
				this.element_resize.get(0).style.height = s_new + 'px';
				this.element_resize_parent.get(0).style.height = s_new + 'px';
			}
	
		},
		stopResize: function(e)
		{
			$(document).unbind('mousemove', this.resizeHdl);
			$(document).unbind('mousedown', this.startResizeHdl);
			$(document).unbind('mouseup', this.stopResizeHdl);
			$(this.splitter).unbind('mouseup', this.stopResizeHdl);
			
			this.element_resize.get(0).style.visibility = 'visible';
		},
		
		
		modalInit: function(title, url, width, height, handler, scroll)
		{
			if (this.opts.overlay) 
			{
				$('#redactor_imp_modal_overlay').show();
				$('#redactor_imp_modal_overlay').click(function() { this.modalClose(); }.bind(this));
			}
			
			if ($('#redactor_imp_modal').size() == 0)
			{
				this.modal = $('<div id="redactor_imp_modal" style="display: none;"><div id="redactor_imp_modal_close"></div><div id="redactor_imp_modal_header"></div><div id="redactor_imp_modal_inner"></div></div>');
				$('body').append(this.modal);
			}
			
			$('#redactor_imp_modal_close').click(function() { this.modalClose(); }.bind(this));
			$(document).keyup(function(e) { if( e.keyCode == 27) this.modalClose(); }.bind(this));
			$(this.doc).keyup(function(e) { if( e.keyCode == 27) this.modalClose(); }.bind(this));			

			$.ajax({
				url: url,
				success: function(data)
				{		

					// parse lang
					$.each(RLANG, function(i,s)
					{
						var re = new RegExp("%RLANG\." + i + "%","gi");
						data = data.replace(re, s);						
					});
					
					$('#redactor_imp_modal_inner').html(data);
					$('#redactor_imp_modal_header').html(title);
					
					if (height === false) theight = 'auto';
					else theight = height + 'px';
					
					$('#redactor_imp_modal').css({ width: width + 'px', height: theight, marginTop: '-' + height/2 + 'px', marginLeft: '-' + width/2 + 'px' }).fadeIn('fast');					

					if (scroll === true)
					{					
						$('#imp_redactor_table_box').height(height-$('#redactor_imp_modal_header').outerHeight()-130).css('overflow', 'auto');						
					}
					
					if (typeof(handler) == 'function') handler();
				}.bind(this)
			});
		},
		modalClose: function()
		{

			$('#redactor_imp_modal_close').unbind('click', function() { this.modalClose(); }.bind(this));
			$('#redactor_imp_modal').fadeOut(function()
			{
				$('#redactor_imp_modal_inner').html('');			
				
				if (this.opts.overlay) 
				{
					$('#redactor_imp_modal_overlay').hide();		
					$('#redactor_imp_modal_overlay').unbind('click', function() { this.modalClose(); }.bind(this));					
				}			
				
				$(document).unbind('keyup', function(e) { if( e.keyCode == 27) this.modalClose(); }.bind(this));
				$(this.doc).unbind('keyup', function(e) { if( e.keyCode == 27) this.modalClose(); }.bind(this));
				
			}.bind(this));

		},
		


		/*
			Upload
		*/	
		uploadInit: function(element, options)
		{
			/*
				Options
			*/
			this.uploadOptions = {
				url: false,
				success: false,
				start: false,
				trigger: false,
				auto: false,
				input: false
			};
	  
			$.extend(this.uploadOptions, options);
	
	
			/*
				Test input or form
			*/		
			if ($('#' + element).get(0).tagName == 'INPUT')
			{
				this.uploadOptions.input = $('#' + element);
				this.element = $($('#' + element).get(0).form);
			}
			else
			{
				this.element = $('#' + element);
			}
			
	
			this.element_action = this.element.attr('action');
	
			/*
				Auto or trigger
			*/
			if (this.uploadOptions.auto)
			{
				this.element.submit(function(e) { return false; });
				this.uploadSubmit();
			}
			else if (this.uploadOptions.trigger)
			{
				$('#' + this.uploadOptions.trigger).click(function() { this.uploadSubmit(); }.bind(this)); 
			}
		},
		uploadSubmit : function()
		{
			this.uploadForm(this.element, this.uploadFrame());
		},	
		uploadFrame : function()
		{
			this.id = 'f' + Math.floor(Math.random() * 99999);
		
			var d = document.createElement('div');
			var iframe = '<iframe style="display:none" src="about:blank" id="'+this.id+'" name="'+this.id+'"></iframe>';
			d.innerHTML = iframe;
			document.body.appendChild(d);
	
			/*
				Start
			*/
			if (this.uploadOptions.start) this.uploadOptions.start();
	
			$('#' + this.id).load(function () { this.uploadLoaded() }.bind(this));
	
			return this.id;
		},
		uploadForm : function(f, name)
		{
			if (this.uploadOptions.input)
			{
				var formId = 'redactorUploadForm' + this.id;
				var fileId = 'redactorUploadFile' + this.id;
				this.form = $('<form  action="' + this.uploadOptions.url + '" method="POST" target="' + name + '" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');	
	
				var oldElement = this.uploadOptions.input;
				var newElement = $(oldElement).clone();
				$(oldElement).attr('id', fileId);
				$(oldElement).before(newElement);
				$(oldElement).appendTo(this.form);
				$(this.form).css('position', 'absolute');
				$(this.form).css('top', '-1200px');
				$(this.form).css('left', '-1200px');
				$(this.form).appendTo('body');	
				
				this.form.submit();
			}
			else
			{
				f.attr('target', name);
				f.attr('method', 'POST');
				f.attr('enctype', 'multipart/form-data');		
				f.attr('action', this.uploadOptions.url);
	
				this.element.submit();
			}
	
		},
		uploadLoaded : function()
		{
			var i = $('#' + this.id);
			
			
			
			if (i.contentDocument) var d = i.contentDocument;
			else if (i.contentWindow) var d = i.contentWindow.document;
			else var d = window.frames[this.id].document;
			
			if (d.location.href == "about:blank") return true;
	
	
			/*
				Success
			*/
			this.imageUploadCallback(d.body.innerHTML);
	
			this.element.attr('action', this.element_action);
			this.element.attr('target', '');
			//this.element.unbind('submit');
			
			//if (this.uploadOptions.input) $(this.form).remove();
		}
				
	};




	String.prototype.isInlineName = function()
	{
		var inlineList = new Array("#text", "a", "em", "font", "span", "strong", "u");
		var theName = this.toLowerCase();
		
		for (var i = 0; i < inlineList.length; i++)
		{
			if (theName == inlineList[i])
			{
				return true;
			}
		}
		
		return false;
	};
	
	
	// bind
	Function.prototype.bind = function(object)
	{
	    var method = this; var oldArguments = $.makeArray(arguments).slice(1);
	    return function (argument)
	    {
	        if (argument == new Object) { method = null; oldArguments = null; }
	        else if (method == null) throw "Attempt to invoke destructed method reference.";
	        else { var newArguments = $.makeArray(arguments); return method.apply(object, oldArguments.concat(newArguments)); }
	    };
	};	
	
	
})(jQuery);



function tabs() {
	var s='';
	for (var j=0; j<LOOP_LEVEL; j++) s+='\t';
	return s;
}

function cleanTag(tag) {
	var tagout='';
	tag=tag.replace(/\n/g, ' ');       //remove newlines
	tag=tag.replace(/[\s]{2,}/g, ' '); //collapse whitespace
	tag=tag.split(' ');
	for (var j=0; j<tag.length; j++) {
		if (-1==tag[j].indexOf('=')) {
			//if this part doesn't have an equal sign, just lowercase it and copy it
			tagout+=tag[j].toLowerCase()+' ';
		} else {
			//otherwise lowercase the left part and...
			var k=tag[j].indexOf('=');
			var tmp=[tag[j].substr(0, k), tag[j].substr(k+1)];

			tagout+=tmp[0].toLowerCase()+'=';
			var x=tmp[1].charAt(0);
			if ("'"==x || '"'==x) {
				//if the right part starts with a quote, find the rest of its parts
				tagout+=tmp[1];
				while(x!=String(tag[j]).charAt(String(tag[j]).length-1)) {
					tagout+=' '+tag[++j];
				}
				tagout+=' ';
			} else {
				//otherwise put quotes around it
				tagout+="'"+tmp[1]+"' ";
			}
		}
	}
	tag=tagout.replace(/\s*$/, '>');
	return tag;
}

/////////////// The below variables are only used in the placeTag() function
/////////////// but are declared global so that they are read only once
//opening and closing tag on it's own line but no new indentation level
var ownLine=['area', 'body', 'head', 'hr', 'i?frame', 'link', 'meta', 'noscript', 'style', 'table', 'tbody', 'thead', 'tfoot'];

//opening tag, contents, and closing tag get their own line
//(i.e. line before opening, after closing)
var contOwnLine=['li', 'dt', 'dt', 'h[1-6]', 'option', 'script'];

//line will go before these tags
var lineBefore=new RegExp('^<(/?'+ownLine.join('|/?')+'|'+contOwnLine.join('|')+')[ >]');

//line will go after these tags
lineAfter=new RegExp('^<(br|/?'+ownLine.join('|/?')+'|/'+contOwnLine.join('|/')+')[ >]');

//inside these tags (close tag expected) a new indentation level is created
var newLevel=['blockquote', 'div', 'dl', 'fieldset', 'form', 'frameset', 'map', 'ol', 'p', 'pre', 'select', 'td', 'th', 'tr', 'ul'];
newLevel=new RegExp('^</?('+newLevel.join('|')+')[ >]');
function placeTag(tag, out) {
	var nl=tag.match(newLevel);
	if (tag.match(lineBefore) || nl) {
		out=out.replace(/\s*$/, '');
		out+="\n";
	}

	if (nl && '/'==tag.charAt(1)) LOOP_LEVEL--;
	if ('\n'==out.charAt(out.length-1)) out+=tabs();
	if (nl && '/'!=tag.charAt(1)) LOOP_LEVEL++;

	out+=tag;
	if (tag.match(lineAfter) || tag.match(newLevel)) {
		out=out.replace(/ *$/, '');
		out+="\n";
	}
	return out;
}



function CleanWHtml(html)
{ 
	var s = html.replace(/\r/g, '\n').replace(/\n/g, ' ');
	
	//s = s.replace(/<font(.*?)>([\\w\\W]*?)<\/font>/gi, '$2');
	
	var rs = [];
	rs.push(/<!--.+?-->/g); // Comments
	rs.push(/<title>.+?<\/title>/g); // Title
	rs.push(/<(meta|link|.?o:|.?style|.?div|.?head|.?html|body|.?body|.?span|!\[)[^>]*?>/g); // Unnecessary tags
	rs.push(/ v:.*?=".*?"/g); // Weird nonsense attributes
	rs.push(/ style=".*?"/g); // Styles
	rs.push(/ class=".*?"/g); // Classes
	rs.push(/(&nbsp;){2,}/g); // Redundant &nbsp;s
	rs.push(/<p>(\s|&nbsp;)*?<\/p>/g); // Empty paragraphs
	$.each(rs, function() {
	    s = s.replace(this, '');
	});
	
	s = s.replace(/\s+/g, ' ');
	
	return s;


}
