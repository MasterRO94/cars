class SelectView extends Backbone.View

	home: $('body').data('home')

	initialize: ->
		do @$el.selectBox

	events:
		'change' : 'selected'

	selected: ->
		do @options.c.reset if @options.c
		@options.c.options.parent  = @ if @options.c
		@options.c.store @$el.val() if @options.c

	reset: ->
		# remove native options
		@$el.find('option:not(:first)').remove()

		# refresh selectbox
		@$el.selectBox 'refresh'

		# reset on children
		do @options.c.reset if @options.c

	error: ->
		@$el.selectBox('control').blink()
		
	render: ->
		temp = $.HandlebarsFactory '#options-template'

		options = temp @options.json

		html = $.parseHTML(options)

		@$el.find('option:first').after(html)

		@$el.selectBox 'refresh'

	store: (id) ->
		self = @
		$.ajax "#{@home}/#{@options.url}",
			data:
				id: id
		.done (d) ->
			if(typeof self.options.type isnt "undefined")
				console.log d
				type = self.options.parent.options.parent.$el.val()
				for key, i in d
					if parseInt i.type, 10 != parseInt type, 10
						d.splice(key, 1);
				console.log d
			self.options.json = d
			do self.render

	get: ->
		@$el.val()

module.exports = SelectView