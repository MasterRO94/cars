Array.prototype.have = (i) ->
	if @indexOf(i) is -1 then return false else true

Array.prototype.remove = (i) ->
	@splice(@indexOf(i), 1)

Array.prototype.in = (i) ->
	for a in @
		if a.id is i then return true
	false

Array.prototype.last = ->
	@[@length - 1]

String.prototype.excerpt = ->
	i = @.indexOf '.'
	@slice 0, i+1

$.fn.blink = ->
	@stop(true).animate
		backgroundColor: '#f3df6d'
	, 300, ->
		$(@).stop(true).animate
			backgroundColor: 'white'
		, 300

$.fn.preload = (command) ->
	if command is 'start'
		@data 'text', @html()
		@html ''
		@addClass 'preloader-start'

	if command is 'stop'
		@removeClass 'preloader-start'
		@addClass 'preloader-end'

	if command is 'reset'
		@removeClass 'preloader-end'
		@removeClass 'preloader-start'
		@html @data 'text'

$('.sticky').stick_in_parent
	offset_top: 5

$.alert = (msg, reload) ->

	$.magnificPopup.open
		type: 'inline'
		closeBtnInside: true
		items:
			src: '#alert-popup'

		callbacks:
			open: ->
				content = @content.children '.popup_content'
				content.prepend "<p class='alert-message'>#{msg}</p>"

				content.find('.popup_button').click =>
					$.magnificPopup.instance.close()

			close: ->
				@content.children('.popup_content').children('.alert-message').html('')
				
				if reload
					location.reload()


$.HandlebarsFactory = (id) ->
	if $(id).get 0
		return Handlebars.compile $(id).html()
	else
		return ->