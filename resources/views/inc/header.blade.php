<div class="header">
	
	<div class="container">
		
		<div class="header_box">
			<a href="/" title="На главную страницу Комтранс">
				<div class="header_logo"></div>
			</a>	
		</div>

		<div class="header_title">
			<span>Новый, бесплатный</span>
			справочник коммерческих организаций<br>
			по обслуживанию автомобилей и продаже запчастей.
		</div>

		<div class="header_user-box">

			@if(Auth::check())
			
				<a class="header_user-info" href="{{ route('profile') }}">

					<div class="header_user-info_arrow"></div>
			
					<div class="header_user-info_names">

						@if(Auth::user()->name)
							
							<h5>{{ Auth::user()->name }}</h5>

						@else

							<h5>{{ Auth::user()->email }}</h5>

						@endif

						@if(Auth::user()->company)

							<h5 class="header_user-info_company-name">{{ Auth::user()->company->title }}</h5>
							
						@endif

					</div>

					@if(Auth::user()->company && Auth::user()->company->status)
						<div class="header_user-info_ava" 
						style="background-image:url({{ URL::to('/') . '/' . Auth::user()->company->logo }})">
						</div>
					@elseif(Auth::user()->ava)
						<div class="header_user-info_ava" 
						style="background-image:url({{ URL::to('/') . '/' . Auth::user()->ava }})">
						</div>
					@else
						<div class="header_user-info_ava" 
						style="background-image:url({{ URL::to('/') }}/img/noavatar.png)"></div>
					@endif
			
				</a>
			
			@else
				
			<div id="user-auth" class="header_inputs">

				<input name="email" class="header_login" type="email" placeholder="Почта">
				
				<input name="password" class="header_pass" type="password" placeholder="Пароль">

				<div id="user-auth-button" class="header_submit-arrow">Вход</div>

			</div>
			
			@endif

		</div>

	</div>

</div>