var RTOOLBAR = {
	html: { name: 'html', title: RLANG.html, func: 'toggle' },	
	fullscreen: { name: 'fullscreen', title: RLANG.fullscreen, func: 'fullscreen' },
	styles: 
	{
		name: 'styles', title: RLANG.styles, func: 'show', 
		dropdown: 
		{
			p: 			{exec: 'formatblock', name: 'p', title: RLANG.paragraph},
			blockquote: {exec: 'formatblock', name: 'blockquote', title: RLANG.quote},
			code: 		{exec: 'formatblock', name: 'pre', title: RLANG.code},
			h2: 		{exec: 'formatblock', name: 'h2', title: RLANG.header1, style: 'font-size: 18px;'},
			h3: 		{exec: 'formatblock', name: 'h3', title: RLANG.header2, style: 'font-size: 14px; font-weight: bold;'}																	
		}
	},
	format: 
	{
		name: 'format', title: RLANG.format, func: 'show',
		dropdown: 
		{
			bold: 		  {exec: 'bold', name: 'bold', title: RLANG.bold, style: 'font-weight: bold;'},
			italic: 	  {exec: 'italic', name: 'italic', title: RLANG.italic, style: 'font-style: italic;'},
			superscript:  {exec: 'superscript', name: 'superscript', title: RLANG.superscript},
			strikethrough:  {exec: 'StrikeThrough', name: 'StrikeThrough', title: RLANG.strikethrough, style: 'text-decoration: line-through !important;'},
			fgcolor: 	  {name: 'fgcolor', title: RLANG.fontcolor, func: 'showFgcolor'},
			hilite: 	  {name: 'hilite', title: RLANG.backcolor, func: 'showHilite'},
			removeformat: {exec: 'removeformat', name: 'removeformat', title: RLANG.removeformat}
			//clearWord: {func: 'clearWord', name: 'clearWord', title: RLANG.cleanstyles}
		}						
	},
	lists: 	
	{
		name: 'lists', title: RLANG.lists, func: 'show',
		dropdown: 
		{
			ul: 	 {exec: 'insertunorderedlist', name: 'insertunorderedlist', title: '&bull; ' + RLANG.unorderedlist},
			ol: 	 {exec: 'insertorderedlist', name: 'insertorderedlist', title: '1. ' + RLANG.orderedlist},
			outdent: {exec: 'outdent', name: 'outdent', title: '< ' + RLANG.outdent},
			indent:  {exec: 'indent', name: 'indent', title: '> ' + RLANG.indent}
		}			
	},
	align: 	
	{
		name: 'align', title: RLANG.align, func: 'show',
		dropdown: 
		{
			JustifyLeft: 	 {exec: 'JustifyLeft', name: 'JustifyLeft', title: RLANG.align_left},					
			JustifyCenter: 	 {exec: 'JustifyCenter', name: 'JustifyCenter', title: RLANG.align_center},
			JustifyRight: {exec: 'JustifyRight', name: 'JustifyRight', title: RLANG.align_right}
		}		
	},				
	image: { name: 'image', title: RLANG.image, func: 'showImage' },
	table: { name: 'table', title: RLANG.table, func: 'showTable' },
	video: { name: 'video', title: RLANG.video, func: 'showVideo' },
	//charmap: { name: 'charmap', title: RLANG.charmap, func: 'showCharmap' },	
	link: 
	{
		name: 'link', title: RLANG.link, func: 'show',
		dropdown: 
		{
			link: 	{name: 'link', title: RLANG.link_insert, func: 'showLink'},
			unlink: {exec: 'unlink', name: 'unlink', title: RLANG.unlink}
		}			
	}
};