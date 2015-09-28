<div class="footer">
	
	<div class="container">

		
		<div class="footer_menu">

			<ul class="footer_list">
				<li>
					<a href="{{ route('home') }}">Главная</a>
				</li>
				<li>
					<a href="{{ route('catalog') }}">Каталог</a>
				</li>
				<li>
					<a href="{{ route('feedback') }}">Отзывы</a>
				</li>
				<li>
					<a href="/page/pravila">Правила</a>
				</li>
				<li>
					<a href="{{ route('contacts') }}">Обратная связь</a>
				</li>
				
			</ul>

		</div>

		@if(Auth::guest())
		
			<div class="footer_sign-up-block">

				<h5>
					Поиск товаров и услуг для грузового автотранспорта доступен только авторизованным членам клуба.
				</h5>

				<div id="footer-sign-up" href="#sign-up-popup" class="footer_sign-up-button">
					Регистрация
				</div>

			</div>

		@endif


		
		<div class="footer_copyright">
			
			<div class="footer_copyright--text">
				
				<h5 class="footer_rights">&copy; 2015г. клуб "Комтранс". Все права защищены.</h5>

			</div>
			
			<div class="footer_copyright--logo">
				
				<div class="footer_logo"></div>

			</div>
		</div>



	</div>

</div>