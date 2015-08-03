@extends('layouts.main')

@section('body')

	<div class="profile">
		
		<div class="container">
			
			<div class="profile_left">

				@if($user->confirmed)

					<div class="profile-info">

						<div class="profile-info_header">
						
							<div class="profile-info_toogler">

								<div class="profile-info_profile profile-info_toogler--active">
									Мой профиль
								</div>
								
								<div id="create-company-button" class="profile-info_company" 
								href="{{ $user->is_ready() ? '#create-company' : '#fill-up-profile-popup' }}">
									Создать компанию
								</div>

							</div>

							<div class="profile_settings">
								<span class="profile_settings-icon"></span>
								Настройки
							</div>

						</div>
						
						<div class="profile-info_body">

							<div class="profile-info_left">
								
								<div class="profile-info_logo" id="user-ava">
									<img
									src="{{ $user->ava ? 
									URL::to('/') . '/' . $user->ava : 
									URL::to('/') . '/img/noavatar.png' }}" alt="">
								</div>
								
								<input type="file" style="display:none" id="user-ava-file">

								<div id="avatar-popup" class="popup mfp-hide popup--avatar"></div>
							
							</div>
							
							<div class="profile-info_right">
								
								<h3 id="profile-user-name" class="profile-info_name">
									<span>{{ $user->name }}</span>
									<span id="profile-user-pen" href="#edit-user-profile-popup" class="profile-info_pen">
									</span>
								</h3>
							{{-- 
								<div id="edit-profile-address" class="profile-info_address">
									{{ $user->address }}
								</div>
							
								<div id="edit-profile-phone" class="profile-info_phone">
									{{ $user->phone }}
								</div>

								<div id="edit-profile-about" class="profile-info_about">
									{{ $user->about }}
								</div> --}}
							
							</div>

						</div>

					</div>

				@else

					<div class="profile_verify">

						Подтвердите свою почту. 
						На вашу почту (
							<a href="http://{{ $user->email_provider() }}">{{ $user->email }}</a>
						) было выслано письмо.
						<br>
						<br>
						Нажмите <a href="{{ route('user-repeat-message') }}">сюда</a> что бы отправить письмо еще раз если оно не пришло либо ссылка в письме не работает.

					</div>

				@endif

				@if(count($user->requests))

					<div class="requests">
						
						<div class="requests_header">
							
							<div class="requests_toogler">

								<div class="requests_received requests_toogler--active">Исходящие запросы</div>

							</div>

						</div>

						@include('parts.sent-requests')

					</div>

				@endif


			</div>

			<div class="profile_right">
				
				@include('inc.search')

				@include('inc.feedback')

			</div>

		</div>

	</div>

	@include('popups.create-company')

	@include('popups.edit-profile', [
		'id' => 'edit-user-profile-popup', 
		'button_id' => 'edit-user-profile-button'
	])

	@include('templates.popup-field-template')

	@include('templates.avatar-template')

@stop