<script id="admin-makes-template" type="text/x-handlebars-template">

	<div class="make-icon" style="background-image:url({{icon}})">
	</div>
	<input type="file" id="make-icon-input">

	<div class="popup_field">
								
		<div class="popup_label">Имя</div>

		<input type="text" class="popup_input make-title" value="{{title}}">

	</div>


    <div class="popup_field">

        <div class="popup_label">Meta Title</div>

        <input type="text" class="popup_input make-meta_title" value="{{meta_title}}">

    </div>

	<div class="popup_field">
								
		<div class="popup_label">Url</div>

		<input type="text" class="popup_input make-url" value="{{url}}">

	</div>

	<div class="popup_field">
								
		<div class="popup_label">Советская</div>

		<select class="make-soviet" style="width:50px">
			<option value="0">Нет</option>
			<option value="1">Да</option>
		</select>

	</div>


    <div class="popup_field">
        <div class="popup_label">Описание</div>
        <textarea class="ckeditor make-description">{{description}}</textarea>
    </div>

	<div class="popup_field">
								
		<div class="popup_label">Модели</div>

		<div id="new-model" style="width:130px" class="btn btn-primary navbar-btn">
			<i class="fa fa-plus"></i>
			Новая модель
		</div>

		<table id="admin-models" class="table-striped table table-hover">

			<thead>
				<tr style="position:relative">
					<th style="width:30px">№</th>
					<th>Имя</th>
					<th>Описание</th>
					<th>Url</th>
					<th style="width:200px">Тип</th>
					<th style="width:90px"></th>
				</tr>
			</thead>

			{{#each models}}

				<tr class="model"
				data-id="{{id}}"
				data-title="{{title}}"
				data-url="{{url}}"
                data-description="{{description}}"
				data-type-id="{{type_id}}"
				data-type-title="{{type_title}}">
					<td>{{id}}</td>
					<td>{{title}}</td>
					<td>{{description}}</td>
					<td>{{url}}</td>
					<td>{{type_title}}</td>
					<td>
						<div class="btn btn-default btn-sm edit-model">
							<i class="fa fa-pencil"></i>
						</div>
						<div class="btn btn-danger btn-sm delete-model">
							<i class="fa fa-times"></i>
						</div>
					</td>
				</tr>

			{{/each}}

		</table>

	</div>

	<div id="admin-edit-button" class="popup_button">
		{{buttonText}}
	</div>

</script>