<?php

// Home
Breadcrumbs::register('home', function($breadcrumbs)
{
	$breadcrumbs->push('Главная', route('home'));
});
// Home > Catalog
Breadcrumbs::register('catalog', function($breadcrumbs, $c)
{
	$breadcrumbs->parent('home');

	$breadcrumbs->push('Каталог', route('catalog'));

// Home > Catalog > Make
	if(isset($c['nospecs'])){
        if(isset($c['type'])){
            // Home > Catalog > Type > Make
            $breadcrumbs->push($c['type']->title, route('catalog'));
        }
        if(isset($c['model'])){
            $breadcrumbs->push($c['nospecs']->title, route('catalog-nospecs', ['make' => $c['nospecs']->name, 'type' => $c['type']->name]));
            $breadcrumbs->push($c['model']->title);
        } else {
            $breadcrumbs->push($c['nospecs']->title);
        }
	}

// Home > Catalog > Spec
	if(isset($c['spec'])){

		$breadcrumbs->push($c['spec']->title, route('specs', $c['spec']->name));

// Home > Catalog > Spec > Make
		if(isset($c['make'])) {
            // Home > Catalog > Spec > Type > Make
            if(isset($c['type'])){
                $breadcrumbs->push($c['type']->title, route('specs', $c['spec']->name));
            }

            if(isset($c['model'])){
                $breadcrumbs->push($c['make']->title, route('make', ['make' => $c['make']->name, 'spec' => $c['spec']->name, 'type' => $c['type']->name]));
                $breadcrumbs->push($c['model']->title);
            } else {
                $breadcrumbs->push($c['make']->title);
            }
		}

	}

});

// Home > Feed
BreadCrumbs::register('feed', function($breadcrumbs, $f){

	$breadcrumbs->parent('home');

	$breadcrumbs->push('Отзывы', route('feedback'));

// Home > Feed > Make
	if(isset($f['make'])){

		$breadcrumbs->push($f['make']->title, route('feedback-make', 
			[ 'make' => $f['make']->name, 'type' => $f['type']->name ]));

// Home > Feed > Make > Model
		if(isset($f['model'])){

			$breadcrumbs->push($f['model']->title, route('feedback-model', 
				[ 'model' => $f['model']->name, 'make' => $f['make']->name, 'type' => $f['type']->name ]));

			if(isset($f['mention'])) {

				$breadcrumbs->push('');

			}

		}

	}

});


// Home > Catalog > Specs
// Breadcrumbs::register('specs', function($breadcrumbs,)
// {
//     $breadcrumbs->parent('home');
//     $breadcrumbs->push('Specs', route('specs', ));
// });

// // Home > Blog > [Category]
// Breadcrumbs::register('category', function($breadcrumbs, $category)
// {
//     $breadcrumbs->parent('blog');
//     $breadcrumbs->push($category->title, route('category', $category->id));
// });

// // Home > Blog > [Category] > [Page]
// Breadcrumbs::register('page', function($breadcrumbs, $page)
// {
//     $breadcrumbs->parent('category', $page->category);
//     $breadcrumbs->push($page->title, route('page', $page->id));
// });