var RTOOLBAR = {
	html: 	{name: 'html', title: RLANG.html, func: 'toggle'},
	styles: 
	{
		name: 'styles', title: RLANG.styles, func: 'show', 
		dropdown: 
		{
			p: 			{exec: 'formatblock', name: 'p', title: RLANG.paragraph},
			blockquote: {exec: 'formatblock', name: 'blockquote', title: RLANG.quote},
			code: 		{exec: 'formatblock', name: 'pre', title: RLANG.code}
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
	//image: 	{name: 'image', title: 'Картинка', func: 'showImage'},
	table: { name: 'table', title: RLANG.table, func: 'showTable' },
	link: 
	{
		name: 'link', title: RLANG.link, func: 'show',
		dropdown: 
		{
			link: 	{name: 'link', title: RLANG.link_insert, func: 'showLink'},
			unlink: {exec: 'unlink', name: 'unlink', title: RLANG.unlink}
		}			
	}
}