<div class="footer">
	
	<div class="container">
		
		<div class="left">
			
			<ul>
				<li>Информация</li>
				<li>О клубе</li>
				<li>Вступить</li>
				<li>Контакты</li>
				<li>Сотрудничество</li>
			</ul>

			<ul>
				<li>Каталог</li>
				<li>Компании</li>
				<li>Запчасти</li>
				<li>Услуги</li>
				<li>Поиск</li>
			</ul>

			<ul>
				<li>Клуб</li>
				<li>Новости</li>
				<li>Общение</li>
				<li>Клубные карты</li>
			</ul>

			<div class="clear-fix"></div>

			<h5>
				2015 Komtrans club. Все права защищены.
			</h5>

		</div>

		<div class="right">
			
			<h5>
				Зарегистрируйся и найди любые запчасти бесплатно
			</h5>

			@if(Auth::guest())
				<div id="footer-sign-up" href="#sign-up-popup" class="footer_sign-up-button">
					Регистрация
				</div>
			@endif

			<div class="footer_logo">
				
			</div>

		</div>


	</div>

</div>