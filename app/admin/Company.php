<?php

Admin::model(App\Company::class)->title('Компании')
->as('companies')
->with(['makes.models', 'user', 'models', 'ctype'])
->denyCreating()
->columns(function ()
{
	
	Column::status();

	Column::string('id', '№');
	Column::string('name', 'Название');

	Column::string('user.name', 'Пользователь');

	Column::lists('makes.title', 'Марки');
	Column::lists('models.title', 'Модели');

})->form(function ()
{

	FormItem::select('status', 'Статус')
	->list([1 => 'Подтвержден', 2 => 'Отклонен']);

	FormItem::select('ctype_id', 'Форма собственности')->list(\App\CType::class);

	FormItem::text('name', 'Название');

	FormItem::textarea('about', 'О компании');

	FormItem::text('phone', 'Телефон');

	FormItem::text('address', 'Адрес');

});