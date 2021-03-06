@extends('layouts.main')

@section('body')

	<div class="contacts">

		<div class="wide-image"></div>
		
		<div class="container">
			
			<div class="contacts_content">
				<div class="contacts_header">
					Для ваших вопросов и предложений работает<br>служба технической поддержки:
				</div>

				<div>
					<div class="popup_field">
						<label class="popup_label">Представтесь</label>
						<input id="contacts-name" type="text" class="popup_input">
					</div>
					<div class="popup_field">
						<label class="popup_label">E-mail</label>
						<input id="contacts-email" type="text" class="popup_input">
					</div>
					<div class="popup_field">
						<label class="popup_label">Сообщение</label>
						<textarea id="contacts-text" cols="50" rows="10" class="popup_textarea contacts_textarea"></textarea>
					</div>
				</div>

				<div class="popup_button" id="contacts-submit">
					Отправить
				</div>
			</div>

		</div>

	</div>

@stop