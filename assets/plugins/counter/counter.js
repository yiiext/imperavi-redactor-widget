if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.counter = function()
{
	return {
		init: function()
		{
			if (!this.opts.counterCallback) return;

			this.$editor.on('keyup.redactor-limiter', $.proxy(function(e)
			{
				var words = 0, characters = 0, spaces = 0;
				var text = this.$editor.text();

				if (text !== '')
				{
					var arrWords = text.split(' ');
					var arrSpaces = text.match(/\s/g);

					if (arrWords) words = arrWords.length;
					if (arrSpaces) spaces = arrSpaces.length;

					characters = text.length;

				}

				this.core.setCallback('counter', { words: words, characters: characters, spaces: spaces });


			}, this));
		}
	};
};