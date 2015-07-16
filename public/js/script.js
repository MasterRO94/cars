(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var button, email, form, passw, submit;

form = $('#user-auth-form');

email = form.find('input[name="email"]');

passw = form.find('input[name="password"]');

button = $('#user-auth-button');

submit = function() {
  var pattern;
  pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
  if (pattern.test(email.val())) {
    if (passw.val() !== '') {
      return form.submit();
    } else {
      return passw.blink();
    }
  } else {
    return email.blink();
  }
};

button.click(submit);

form.keypress(function(e) {
  if (e.which === 13) {
    return submit();
  }
});

},{}],2:[function(require,module,exports){
Array.prototype.have = function(i) {
  if (this.indexOf(i) === -1) {
    return false;
  } else {
    return true;
  }
};

Array.prototype.remove = function(i) {
  return this.splice(this.indexOf(i), 1);
};

Array.prototype["in"] = function(i) {
  var a, j, len;
  for (j = 0, len = this.length; j < len; j++) {
    a = this[j];
    if (a.id === i) {
      return true;
    }
  }
  return false;
};

Array.prototype.last = function() {
  return this[this.length - 1];
};

String.prototype.excerpt = function() {
  var i;
  i = this.indexOf('.');
  return this.slice(0, i + 1);
};

$.fn.blink = function() {
  return this.stop(true).animate({
    backgroundColor: '#f3df6d'
  }, 300, function() {
    return $(this).stop(true).animate({
      backgroundColor: 'white'
    }, 300);
  });
};

$.fn.preload = function(command) {
  if (command === 'start') {
    this.data('text', this.html());
    this.html('');
    this.addClass('preloader-start');
  }
  if (command === 'stop') {
    this.removeClass('preloader-start');
    this.addClass('preloader-end');
  }
  if (command === 'reset') {
    this.removeClass('preloader-end');
    return this.html(this.data('text'));
  }
};

$('.sticky').stick_in_parent({
  offset_top: 25
});

$.HandlebarsFactory = function(id) {
  if ($(id).get(0)) {
    return Handlebars.compile($(id).html());
  } else {
    return function() {};
  }
};

},{}],3:[function(require,module,exports){
var CompanyCollection, CompanyList, CompanyModel, CompanyView, companies,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

CompanyModel = (function(superClass) {
  extend(CompanyModel, superClass);

  function CompanyModel() {
    return CompanyModel.__super__.constructor.apply(this, arguments);
  }

  CompanyModel.prototype.defaults = {
    address: '',
    about: '',
    excerpt: '',
    logo: '',
    name: '',
    phone: '',
    tags: []
  };

  return CompanyModel;

})(Backbone.Model);

CompanyCollection = (function(superClass) {
  extend(CompanyCollection, superClass);

  function CompanyCollection() {
    return CompanyCollection.__super__.constructor.apply(this, arguments);
  }

  CompanyCollection.prototype.model = CompanyModel;

  return CompanyCollection;

})(Backbone.Collection);

CompanyView = (function(superClass) {
  extend(CompanyView, superClass);

  function CompanyView() {
    this.render = bind(this.render, this);
    return CompanyView.__super__.constructor.apply(this, arguments);
  }

  CompanyView.prototype.className = 'company-preview';

  CompanyView.prototype.popup = $('#company-main-popup');

  CompanyView.prototype.popupTemplate = $.HandlebarsFactory('#company-template');

  CompanyView.prototype.template = $.HandlebarsFactory('#company-preview-template');

  CompanyView.prototype.initialize = function() {
    var src;
    src = $.parseHTML(this.popupTemplate({
      logo: this.model.get('logo'),
      name: this.model.get('name'),
      about: this.model.get('about'),
      address: this.model.get('address'),
      phone: this.model.get('phone'),
      tags: this.model.get('tags')
    }));
    return this.$el.magnificPopup({
      type: 'inline',
      closeBtnInside: true,
      items: {
        src: '#company-main-popup'
      },
      callbacks: {
        open: (function(_this) {
          return function() {
            _this.popup.append(src);
            return _this.popup.find('.company-popup_close').click(function() {
              return $.magnificPopup.instance.close();
            });
          };
        })(this),
        close: (function(_this) {
          return function() {
            return _this.popup.html('');
          };
        })(this)
      }
    });
  };

  CompanyView.prototype.render = function() {
    this.$el.html(this.template({
      logo: this.model.get('logo'),
      address: this.model.get('address'),
      excerpt: this.model.get('excerpt'),
      name: this.model.get('name')
    }));
    return this.$el;
  };

  CompanyView.prototype.fillModel = function() {};

  return CompanyView;

})(Backbone.View);

CompanyList = (function(superClass) {
  extend(CompanyList, superClass);

  function CompanyList() {
    this.updateCollection = bind(this.updateCollection, this);
    this.showMore = bind(this.showMore, this);
    return CompanyList.__super__.constructor.apply(this, arguments);
  }

  CompanyList.prototype.home = $('body').data('home');

  CompanyList.prototype.data = {
    spec: 0,
    make: 0,
    skip: 5
  };

  CompanyList.prototype.showMoreBtn = $('#show-more-found-companies');

  CompanyList.prototype.initialize = function() {
    this.data.make = this.$el.data('make');
    this.url = 'api/get-companies-by-make';
    if (this.$el.data('spec')) {
      this.data.spec = this.$el.data('spec');
      this.url = 'api/get-companies-by-make-and-spec';
    }
    this.collection = new CompanyCollection;
    this.fillCollection();
    if (this.showMoreBtn) {
      return this.showMoreBtn.click(this.showMore);
    }
  };

  CompanyList.prototype.fillCollection = function() {
    return this.$el.children('.company-preview').each((function(_this) {
      return function(i, el) {
        var m, tags, v;
        tags = [];
        $(el).children('.company-preview_data').children('div').each(function(i, el) {
          return tags.push($(el).data('tag'));
        });
        m = new CompanyModel({
          logo: $(el).children('.company-preview_logo').css('background-image'),
          address: $(el).find('.company-preview_address').html(),
          name: $(el).find('.company-preview_name').html(),
          excerpt: $(el).find('.company-preview_excerpt').html(),
          phone: $(el).children('.company-preview_data').data('phone'),
          about: $(el).children('.company-preview_data').data('about'),
          tags: tags
        });
        v = new CompanyView({
          model: m,
          el: el
        });
        v.fillModel();
        return _this.collection.add(m);
      };
    })(this));
  };

  CompanyList.prototype.showMore = function() {
    return this.get();
  };

  CompanyList.prototype.get = function() {
    return $.ajax(this.home + "/" + this.url, {
      data: this.data
    }).done((function(_this) {
      return function(comps) {
        _this.updateCollection(comps);
        return _this.skip += 5;
      };
    })(this));
  };

  CompanyList.prototype.updateCollection = function(comps) {
    var comp, i, j, len, m;
    console.log(comps);
    if (comps.length <= 5) {
      this.showMoreBtn.hide();
    }
    for (i = j = 0, len = comps.length; j < len; i = ++j) {
      comp = comps[i];
      if (i < 5) {
        m = new CompanyModel({
          address: comp.address,
          about: comp.about,
          excerpt: comp.about.excerpt(),
          logo: "url(" + comp.logo + ")",
          name: comp.name,
          phone: comp.phone,
          tags: comp.tags
        });
        this.collection.add(m);
      }
    }
    return this.render();
  };

  CompanyList.prototype.render = function() {
    this.$el.html('');
    return this.collection.each((function(_this) {
      return function(model) {
        var v;
        v = new CompanyView({
          model: model
        });
        return _this.$el.append(v.render());
      };
    })(this));
  };

  return CompanyList;

})(Backbone.View);

companies = new CompanyList({
  el: '#catalog-companies'
});

},{}],4:[function(require,module,exports){
var MainMakes, MakeCollection, MakeList, MakeModel, MakeView, SpecMakes, TypeList, makes, specmakes, types,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TypeList = require('../inc/TypeList');

MakeModel = (function(superClass) {
  extend(MakeModel, superClass);

  function MakeModel() {
    return MakeModel.__super__.constructor.apply(this, arguments);
  }

  MakeModel.prototype.defaults = {
    id: 0
  };

  return MakeModel;

})(Backbone.Model);

MakeCollection = (function(superClass) {
  extend(MakeCollection, superClass);

  function MakeCollection() {
    return MakeCollection.__super__.constructor.apply(this, arguments);
  }

  MakeCollection.prototype.model = MakeModel;

  MakeCollection.prototype.active = true;

  return MakeCollection;

})(Backbone.Collection);

MakeView = (function(superClass) {
  extend(MakeView, superClass);

  function MakeView() {
    this.show = bind(this.show, this);
    this.hide = bind(this.hide, this);
    return MakeView.__super__.constructor.apply(this, arguments);
  }

  MakeView.prototype.initialize = function() {
    this.model.on('hide', this.hide);
    return this.model.on('show', this.show);
  };

  MakeView.prototype.hide = function() {
    return this.$el.css('display', 'none');
  };

  MakeView.prototype.show = function() {
    return this.$el.css('display', 'block');
  };

  return MakeView;

})(Backbone.View);

MakeList = (function(superClass) {
  extend(MakeList, superClass);

  function MakeList() {
    this.showIfActive = bind(this.showIfActive, this);
    this.changed = bind(this.changed, this);
    return MakeList.__super__.constructor.apply(this, arguments);
  }

  MakeList.prototype.home = $('body').data('home');

  MakeList.prototype.active = 0;

  MakeList.prototype.empty = $('.makes_empty');

  MakeList.prototype.initialize = function() {
    var i, j, len, li, ref, results, self;
    if (this.$el.length === 0) {
      return;
    }
    self = this;
    this.deps = {};
    this.collection = new MakeCollection;
    this.options.types.on('changed', this.changed);
    this.fillCollection();
    ref = this.options.types.$el.children();
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      li = ref[i];
      i = i + 1;
      results.push((function(i) {
        return setTimeout(function() {
          return self.get(i);
        }, 1000);
      })(i));
    }
    return results;
  };

  MakeList.prototype.fillCollection = function() {
    return this.$el.children('li').each((function(_this) {
      return function(i, li) {
        var m, v;
        m = new MakeModel({
          id: $(li).data('id')
        });
        _this.collection.add(m);
        return v = new MakeView({
          model: m,
          el: li
        });
      };
    })(this));
  };

  MakeList.prototype.changed = function(id) {
    if (id === 0) {
      this.reset();
      return this.active = 0;
    } else if (this.deps[id] === void 0) {
      return this.active = id;
    } else {
      return this.updateCollection(id);
    }
  };

  MakeList.prototype.updateCollection = function(id) {
    if (this.deps[id].length === 0) {
      this.empty.show();
    } else {
      this.empty.hide();
    }
    return this.collection.each((function(_this) {
      return function(model) {
        if (_this.deps[id].have(model.get('id'))) {
          return model.trigger('show');
        } else {
          return model.trigger('hide');
        }
      };
    })(this));
  };

  MakeList.prototype.reset = function() {
    this.empty.hide();
    return this.collection.each(function(model) {
      return model.trigger('show');
    });
  };

  MakeList.prototype.showIfActive = function(id) {
    if (this.active !== 0 && this.active === id) {
      return this.changed(this.active);
    }
  };

  return MakeList;

})(Backbone.View);

MainMakes = (function(superClass) {
  extend(MainMakes, superClass);

  function MainMakes() {
    return MainMakes.__super__.constructor.apply(this, arguments);
  }

  MainMakes.prototype.url = 'api/get-makes-by-type-has-comps';

  MainMakes.prototype.get = function(i) {
    return $.ajax(this.home + "/" + this.url, {
      data: {
        id: i
      }
    }).done((function(_this) {
      return function(makes) {
        var j, len, make;
        _this.deps[i] = [];
        for (j = 0, len = makes.length; j < len; j++) {
          make = makes[j];
          _this.deps[i].push(make.id);
        }
        return _this.showIfActive(i);
      };
    })(this));
  };

  return MainMakes;

})(MakeList);

SpecMakes = (function(superClass) {
  extend(SpecMakes, superClass);

  function SpecMakes() {
    return SpecMakes.__super__.constructor.apply(this, arguments);
  }

  SpecMakes.prototype.url = 'api/live-makes';

  SpecMakes.prototype.get = function(i) {
    return $.ajax(this.home + "/" + this.url, {
      data: {
        type: i,
        spec: this.$el.data('current')
      }
    }).done((function(_this) {
      return function(ids) {
        _this.deps[i] = ids;
        return _this.showIfActive(i);
      };
    })(this));
  };

  return SpecMakes;

})(MakeList);

types = new TypeList({
  el: '#catalog-types'
});

setTimeout(function() {
  return types.click();
}, 400);

makes = new MainMakes({
  el: '#catalog-makes',
  types: types
});

specmakes = new SpecMakes({
  el: '#catalog-specmakes',
  types: types
});

},{"../inc/TypeList":9}],5:[function(require,module,exports){
var MakeModel, Makes, MakesCollection, MakesList, ModelsList,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ModelsList = require('./ModelsList');

MakeModel = (function(superClass) {
  extend(MakeModel, superClass);

  function MakeModel() {
    return MakeModel.__super__.constructor.apply(this, arguments);
  }

  MakeModel.prototype.defaults = {
    id: 0,
    title: '',
    visible: true
  };

  return MakeModel;

})(Backbone.Model);

MakesCollection = (function(superClass) {
  extend(MakesCollection, superClass);

  function MakesCollection() {
    return MakesCollection.__super__.constructor.apply(this, arguments);
  }

  MakesCollection.prototype.model = MakeModel;

  MakesCollection.prototype.resetVisible = function() {
    return this.each(function(model) {
      return model.set('visible', true);
    });
  };

  return MakesCollection;

})(Backbone.Collection);

MakesList = (function(superClass) {
  extend(MakesList, superClass);

  function MakesList() {
    this.destroy = bind(this.destroy, this);
    this.selectChanged = bind(this.selectChanged, this);
    return MakesList.__super__.constructor.apply(this, arguments);
  }

  MakesList.prototype.template = $.HandlebarsFactory('#create-company-make-template');

  MakesList.prototype.className = 'create-company_makes-models_item';

  MakesList.prototype.initialize = function() {
    this.makes = new MakesCollection(this.options.makes);
    this.render();
    this.$el.find('.create-company_make').children('.popup_redx').click((function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
    this.select = this.$el.find('.create-company_make').children('select');
    this.select.change(this.selectChanged);
    return this.modelslist = new ModelsList({
      el: this.$el.children('.create-company_models'),
      typeId: parseInt(this.select.val())
    });
  };

  MakesList.prototype.selectChanged = function(e) {
    this.modelslist.update(parseInt(e.target.value));
    return this.trigger('selectChanged', e.target.value, this);
  };

  MakesList.prototype.destroy = function() {
    this.trigger('destroy', this);
    return this.remove();
  };

  MakesList.prototype.updateOptions = function(makes) {
    var selected;
    selected = parseInt(this.select.val());
    this.select.children().remove();
    makes.each((function(_this) {
      return function(make) {
        var opt;
        opt = $('<option class="popup_option"></option>');
        opt.val(make.get('id'));
        opt.html(make.get('title'));
        if (selected === parseInt(opt.val()) || make.get('visible')) {
          _this.select.append(opt);
        }
        if (selected === parseInt(opt.val())) {
          return opt.attr('selected', 'selected');
        }
      };
    })(this));
    return this.select.selectBox('refresh');
  };

  MakesList.prototype.initSelectbox = function() {
    return this.select.selectBox();
  };

  MakesList.prototype.render = function() {
    return this.$el.html(this.template({
      makes: this.makes.toJSON()
    }));
  };

  return MakesList;

})(Backbone.View);

Makes = (function(superClass) {
  extend(Makes, superClass);

  function Makes() {
    this.getMakes = bind(this.getMakes, this);
    this.typeUpdated = bind(this.typeUpdated, this);
    this.updateMakesCollection = bind(this.updateMakesCollection, this);
    this.destroyMakesList = bind(this.destroyMakesList, this);
    this.add = bind(this.add, this);
    return Makes.__super__.constructor.apply(this, arguments);
  }

  Makes.prototype.home = $('body').data('home');

  Makes.prototype.url = 'api/get-makes-by-type';

  Makes.prototype.makesCollection = new MakesCollection;

  Makes.prototype.makesListArray = [];

  Makes.prototype.active = false;

  Makes.prototype.initialize = function() {
    this.options.types.on('changed', this.typeUpdated);
    return this.$el.find('.popup_plus-sign:first').click(this.add);
  };

  Makes.prototype.add = function() {
    var makeslist;
    if (!this.active) {
      this.options.types.error();
      return;
    }
    if (this.makesCollection.where({
      visible: true
    }).length === 0) {
      return;
    }
    makeslist = new MakesList({
      makes: this.makesCollection.where({
        visible: true
      })
    });
    this.makesListArray.push(makeslist);
    makeslist.on('destroy', this.destroyMakesList);
    makeslist.on('selectChanged', this.updateMakesCollection);
    this.renderAddMakesList();
    return this.updateMakesCollection();
  };

  Makes.prototype.destroyMakesList = function(makeslist) {
    this.makesListArray.remove(makeslist);
    return this.updateMakesCollection();
  };

  Makes.prototype.updateMakesCollection = function() {
    var i, j, len, len1, makeslist, model, ref, ref1, results;
    this.makesCollection.resetVisible();
    ref = this.makesListArray;
    for (i = 0, len = ref.length; i < len; i++) {
      makeslist = ref[i];
      model = this.makesCollection.get(makeslist.select.val());
      model.set('visible', false);
    }
    ref1 = this.makesListArray;
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      makeslist = ref1[j];
      results.push(makeslist.updateOptions(this.makesCollection));
    }
    return results;
  };

  Makes.prototype.typeUpdated = function(id) {
    this.reset();
    return this.getMakes(id);
  };

  Makes.prototype.reset = function() {
    var i, len, makeslist, ref;
    this.makesCollection.reset();
    ref = this.makesListArray;
    for (i = 0, len = ref.length; i < len; i++) {
      makeslist = ref[i];
      makeslist.remove();
    }
    return this.makesListArray = [];
  };

  Makes.prototype.getMakes = function(id) {
    return $.ajax(this.home + "/" + this.url, {
      data: {
        id: id
      }
    }).done((function(_this) {
      return function(makes) {
        _this.makesCollection.add(makes);
        _this.active = true;
        return _this.add();
      };
    })(this));
  };

  Makes.prototype.renderAddMakesList = function() {
    var makeslist;
    makeslist = this.makesListArray.last();
    this.$el.append(makeslist.el);
    return makeslist.initSelectbox();
  };

  Makes.prototype.get = function() {
    var i, len, makeslist, obj, ref, result;
    result = [];
    ref = this.makesListArray;
    for (i = 0, len = ref.length; i < len; i++) {
      makeslist = ref[i];
      obj = {};
      obj.id = parseInt(makeslist.select.val());
      obj.models = makeslist.modelslist.get();
      result.push(obj);
    }
    return result;
  };

  return Makes;

})(Backbone.View);

module.exports = Makes;

},{"./ModelsList":6}],6:[function(require,module,exports){
var Model, ModelView, ModelsCollection, ModelsList,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Model = (function(superClass) {
  extend(Model, superClass);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  Model.prototype.defaults = {
    id: 0,
    title: '',
    visible: true
  };

  return Model;

})(Backbone.Model);

ModelsCollection = (function(superClass) {
  extend(ModelsCollection, superClass);

  function ModelsCollection() {
    return ModelsCollection.__super__.constructor.apply(this, arguments);
  }

  ModelsCollection.prototype.model = Model;

  ModelsCollection.prototype.resetVisible = function() {
    return this.each(function(model) {
      return model.set('visible', true);
    });
  };

  return ModelsCollection;

})(Backbone.Collection);

ModelView = (function(superClass) {
  extend(ModelView, superClass);

  function ModelView() {
    this.destroy = bind(this.destroy, this);
    this.selectChanged = bind(this.selectChanged, this);
    this.initSelectbox = bind(this.initSelectbox, this);
    return ModelView.__super__.constructor.apply(this, arguments);
  }

  ModelView.prototype.template = $.HandlebarsFactory('#create-company-model-template');

  ModelView.prototype.className = 'create-company_model popup_field';

  ModelView.prototype.initialize = function() {
    this.models = new ModelsCollection(this.options.models);
    this.render();
    this.$el.children('.popup_redx').click((function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
    this.select = this.$el.children('select');
    return this.select.change(this.selectChanged);
  };

  ModelView.prototype.initSelectbox = function() {
    return this.select.selectBox();
  };

  ModelView.prototype.selectChanged = function(e) {
    return this.trigger('selectChanged', e.target.value, this);
  };

  ModelView.prototype.updateOptions = function(models) {
    var selected;
    selected = parseInt(this.select.val());
    this.select.children().remove();
    models.each((function(_this) {
      return function(model) {
        var opt;
        opt = $('<option class="popup_option"></option>');
        opt.val(model.get('id'));
        opt.html(model.get('title'));
        if (selected === parseInt(opt.val()) || model.get('visible')) {
          _this.select.append(opt);
        }
        if (selected === parseInt(opt.val())) {
          return opt.attr('selected', 'selected');
        }
      };
    })(this));
    return this.select.selectBox('refresh');
  };

  ModelView.prototype.destroy = function() {
    this.trigger('destroy', this);
    return this.remove();
  };

  ModelView.prototype.render = function() {
    return this.$el.html(this.template({
      models: this.models.toJSON()
    }));
  };

  return ModelView;

})(Backbone.View);

ModelsList = (function(superClass) {
  extend(ModelsList, superClass);

  function ModelsList() {
    this.destroy = bind(this.destroy, this);
    this.updateModelsCollection = bind(this.updateModelsCollection, this);
    this.destroyMakesList = bind(this.destroyMakesList, this);
    this.add = bind(this.add, this);
    return ModelsList.__super__.constructor.apply(this, arguments);
  }

  ModelsList.prototype.template = $.HandlebarsFactory('#create-company-models-list-template');

  ModelsList.prototype.home = $('body').data('home');

  ModelsList.prototype.url = 'api/get-models-by-make';

  ModelsList.prototype.initialize = function() {
    this.modelsCollection = new ModelsCollection;
    this.modelsArray = [];
    this.typeId = this.options.typeId;
    this.getModels();
    this.render();
    return this.$el.find('.popup_plus-sign').click(this.add);
  };

  ModelsList.prototype.add = function() {
    var modelview;
    if (this.modelsCollection.where({
      visible: true
    }).length === 0) {
      return;
    }
    modelview = new ModelView({
      models: this.modelsCollection.where({
        visible: true
      })
    });
    this.modelsArray.push(modelview);
    this.renderAddModel();
    this.updateModelsCollection();
    modelview.on('destroy', this.destroyMakesList);
    return modelview.on('selectChanged', this.updateModelsCollection);
  };

  ModelsList.prototype.destroyMakesList = function(modelview) {
    this.modelsArray.remove(modelview);
    return this.updateModelsCollection();
  };

  ModelsList.prototype.updateModelsCollection = function() {
    var i, j, len, len1, model, modelview, ref, ref1, results;
    this.modelsCollection.resetVisible();
    ref = this.modelsArray;
    for (i = 0, len = ref.length; i < len; i++) {
      modelview = ref[i];
      model = this.modelsCollection.get(modelview.select.val());
      model.set('visible', false);
    }
    ref1 = this.modelsArray;
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      modelview = ref1[j];
      results.push(modelview.updateOptions(this.modelsCollection));
    }
    return results;
  };

  ModelsList.prototype.update = function(id) {
    var i, len, model, ref;
    this.typeId = id;
    this.modelsCollection.reset();
    ref = this.modelsArray;
    for (i = 0, len = ref.length; i < len; i++) {
      model = ref[i];
      model.remove();
    }
    this.modelsArray = [];
    return this.getModels();
  };

  ModelsList.prototype.getModels = function() {
    return $.ajax(this.home + "/" + this.url, {
      data: {
        id: this.typeId
      }
    }).done((function(_this) {
      return function(d) {
        return _this.modelsCollection.add(d);
      };
    })(this));
  };

  ModelsList.prototype.destroy = function() {
    return this.remove();
  };

  ModelsList.prototype.render = function() {
    return this.$el.append(this.$el.html(this.template));
  };

  ModelsList.prototype.renderAddModel = function() {
    var model;
    model = this.modelsArray.last();
    this.$el.append(model.el);
    return model.initSelectbox();
  };

  ModelsList.prototype.get = function() {
    var i, len, model, ref, result;
    result = [];
    if (this.modelsArray.length === 0) {
      return 0;
    } else {
      ref = this.modelsArray;
      for (i = 0, len = ref.length; i < len; i++) {
        model = ref[i];
        result.push(parseInt(model.select.val()));
      }
      return result;
    }
  };

  return ModelsList;

})(Backbone.View);

module.exports = ModelsList;

},{}],7:[function(require,module,exports){
var Avatar,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Avatar = (function() {
  Avatar.prototype.home = $('body').data('home');

  function Avatar(id, input, url) {
    var self;
    this.url = url;
    this.send = bind(this.send, this);
    self = this;
    this.coords = {};
    this.id = $(id);
    this.input = $(input);
    this.popup = $('#avatar-popup');
    this.template = $.HandlebarsFactory('#avatar-template');
    this.id.click((function(_this) {
      return function() {
        return _this.input.click();
      };
    })(this));
    this.input.change(function() {
      return self.readFile(this.files);
    });
  }

  Avatar.prototype.readFile = function(fileList) {
    var img, r;
    img = fileList[0];
    if (img.type.search('image') === -1) {
      alert('это не картинка');
      return;
    }
    r = new FileReader;
    r.onloadend = (function(_this) {
      return function() {
        var src;
        src = r.result;
        _this.src = src;
        return _this.showPopup(src);
      };
    })(this);
    return r.readAsDataURL(img);
  };

  Avatar.prototype.adjustPopup = function(img) {
    if (img.naturalWidth > 780) {
      return this.popup.css('width', '780px');
    } else if (img.naturalWidth > 300) {
      return this.popup.css('width', img.naturalWidth + 'px');
    } else {
      return this.popup.css('width', '300px');
    }
  };

  Avatar.prototype.showErrorPopup = function() {
    this.popup.html('<span class="popup_error">Картинка должна быть не меньше 115px и не больше 7000px по ширине и высоте</span>');
    this.input.val('');
    return $.magnificPopup.open({
      items: {
        src: this.popup
      }
    });
  };

  Avatar.prototype.showPopup = function(src) {
    var img;
    this.popup.html(this.template({
      src: src
    }));
    img = this.popup.find('img');
    return img.load((function(_this) {
      return function() {
        var imgHeight, imgWidth;
        if (img[0].naturalHeight < 115 || img[0].naturalHeight > 7000) {
          _this.showErrorPopup();
          return;
        }
        if (img[0].naturalWidth < 115 || img[0].naturalWidth > 7000) {
          _this.showErrorPopup();
          return;
        }
        _this.adjustPopup(img[0]);
        imgWidth = img[0].naturalWidth;
        imgHeight = img[0].naturalHeight;
        img.Jcrop({
          aspectRatio: 1 / 1,
          minSize: [115, 115],
          boxWidth: 780,
          boxHeight: $(document).height() - 300,
          setSelect: [imgWidth * 0.25, imgHeight * 0.07, imgWidth * 0.75, imgHeight * 0.75],
          onSelect: function(c) {
            return _this.coords = {
              x: c.x,
              y: c.y,
              w: c.w,
              h: c.h
            };
          }
        });
        return $.magnificPopup.open({
          items: {
            src: _this.popup
          },
          closeOnBgClick: false,
          callbacks: {
            open: function() {
              _this.button = _this.popup.find('.popup_button');
              return _this.button.click(_this.send);
            },
            close: function() {
              return _this.input.val('');
            }
          }
        });
      };
    })(this));
  };

  Avatar.prototype.updateAva = function(src) {
    return this.id.children('img').attr('src', src);
  };

  Avatar.prototype.send = function() {
    var popup;
    popup = $.magnificPopup.instance.st.closeOnBgClick = true;
    this.button.preload('start');
    return $.ajax(this.home + "/" + this.url, {
      headers: {
        'X-CSRF-TOKEN': $('body').data('csrf')
      },
      method: 'POST',
      data: {
        src: this.src,
        coords: this.coords
      }
    }).done((function(_this) {
      return function(response) {
        setTimeout(function() {
          return _this.updateAva(response);
        }, 800);
        _this.button.preload('stop');
        return setTimeout(function() {
          return $.magnificPopup.instance.close();
        }, 1000);
      };
    })(this));
  };

  return Avatar;

})();

module.exports = Avatar;

},{}],8:[function(require,module,exports){
var SelectView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SelectView = (function(superClass) {
  extend(SelectView, superClass);

  function SelectView() {
    return SelectView.__super__.constructor.apply(this, arguments);
  }

  SelectView.prototype.home = $('body').data('home');

  SelectView.prototype.initialize = function() {
    return this.$el.selectBox();
  };

  SelectView.prototype.events = {
    'change': 'selected'
  };

  SelectView.prototype.selected = function() {
    if (this.options.c) {
      this.options.c.reset();
    }
    if (this.options.c) {
      return this.options.c.store(this.$el.val());
    }
  };

  SelectView.prototype.reset = function() {
    this.$el.find('option:not(:first)').remove();
    this.$el.selectBox('refresh');
    if (this.options.c) {
      return this.options.c.reset();
    }
  };

  SelectView.prototype.error = function() {
    return this.$el.selectBox('control').blink();
  };

  SelectView.prototype.render = function() {
    var html, options, temp;
    temp = $.HandlebarsFactory('#options-template');
    options = temp(this.options.json);
    html = $.parseHTML(options);
    this.$el.find('option:first').after(html);
    return this.$el.selectBox('refresh');
  };

  SelectView.prototype.store = function(id) {
    var self;
    self = this;
    return $.ajax(this.home + "/" + this.options.url, {
      data: {
        id: id
      }
    }).done(function(d) {
      self.options.json = d;
      console.log(d);
      return self.render();
    });
  };

  SelectView.prototype.get = function() {
    return this.$el.val();
  };

  return SelectView;

})(Backbone.View);

module.exports = SelectView;

},{}],9:[function(require,module,exports){
var TypeList, TypeModel, TypeView, TypesCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TypeModel = (function(superClass) {
  extend(TypeModel, superClass);

  function TypeModel() {
    return TypeModel.__super__.constructor.apply(this, arguments);
  }

  TypeModel.prototype.defaults = {
    id: 0
  };

  return TypeModel;

})(Backbone.Model);

TypesCollection = (function(superClass) {
  extend(TypesCollection, superClass);

  function TypesCollection() {
    return TypesCollection.__super__.constructor.apply(this, arguments);
  }

  TypesCollection.prototype.model = TypeModel;

  return TypesCollection;

})(Backbone.Collection);

TypeView = (function(superClass) {
  extend(TypeView, superClass);

  function TypeView() {
    this.deactivate = bind(this.deactivate, this);
    this.activate = bind(this.activate, this);
    this.changeState = bind(this.changeState, this);
    return TypeView.__super__.constructor.apply(this, arguments);
  }

  TypeView.prototype.initialize = function() {
    this["class"] = 'type_item--active';
    this.model.on('deactivate', this.deactivate);
    this.model.on('click', this.activate);
    return this.state = false;
  };

  TypeView.prototype.events = {
    'click': 'changeState'
  };

  TypeView.prototype.changeState = function() {
    if (this.state) {
      this.deactivate();
      return this.model.trigger('pass');
    } else {
      return this.activate();
    }
  };

  TypeView.prototype.activate = function() {
    this.model.trigger('activate', this.model);
    this.$el.addClass(this["class"]);
    return this.state = true;
  };

  TypeView.prototype.deactivate = function() {
    this.$el.removeClass(this["class"]);
    return this.state = false;
  };

  return TypeView;

})(Backbone.View);

TypeList = (function(superClass) {
  extend(TypeList, superClass);

  function TypeList() {
    this.pass = bind(this.pass, this);
    this.deactivate = bind(this.deactivate, this);
    return TypeList.__super__.constructor.apply(this, arguments);
  }

  TypeList.prototype.initialize = function() {
    this.activeId = 0;
    this.collection = new TypesCollection;
    this.collection.on('activate', this.deactivate);
    this.collection.on('pass', this.pass);
    return this.fillCollection();
  };

  TypeList.prototype.fillCollection = function() {
    return this.$el.children('li').each((function(_this) {
      return function(i, li) {
        var id, m, v;
        id = $(li).data('id');
        m = new TypeModel({
          id: id
        });
        v = new TypeView({
          model: m,
          el: li
        });
        return _this.collection.add(m);
      };
    })(this));
  };

  TypeList.prototype.deactivate = function(model) {
    this.activeId = model.get('id');
    this.collection.each((function(_this) {
      return function(m) {
        if (m !== model) {
          return m.trigger('deactivate');
        }
      };
    })(this));
    return this.trigger('changed', this.activeId);
  };

  TypeList.prototype.pass = function() {
    this.activeId = 0;
    return this.trigger('changed', this.activeId);
  };

  TypeList.prototype.click = function() {
    if (this.collection.length) {
      return this.collection.at(0).trigger('click');
    }
  };

  return TypeList;

})(Backbone.View);

module.exports = TypeList;

},{}],10:[function(require,module,exports){
require('./base');

require('./popups/index');

require('./main-live-search');

require('./catalog/catalog-live');

require('./catalog/catalog-companies');

require('./auth');

require('./user-profile');

require('./mention');

require('./logout');

},{"./auth":1,"./base":2,"./catalog/catalog-companies":3,"./catalog/catalog-live":4,"./logout":11,"./main-live-search":12,"./mention":13,"./popups/index":16,"./user-profile":19}],11:[function(require,module,exports){
var button, form;

form = $('#user-logout-form');

button = $('#user-logout-button');

button.click(function() {
  return form.submit();
});

},{}],12:[function(require,module,exports){
var CompanyCollection, CompanyList, CompanyModel, CompanyView, MakeCollection, MakeList, MakeModel, MakeView, SpecCollection, SpecList, SpecModel, SpecView, TypeList, companies, makes, specs, types,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TypeList = require('./inc/TypeList');

SpecModel = (function(superClass) {
  extend(SpecModel, superClass);

  function SpecModel() {
    return SpecModel.__super__.constructor.apply(this, arguments);
  }

  SpecModel.prototype.defaults = {
    id: 0
  };

  return SpecModel;

})(Backbone.Model);

SpecCollection = (function(superClass) {
  extend(SpecCollection, superClass);

  function SpecCollection() {
    return SpecCollection.__super__.constructor.apply(this, arguments);
  }

  SpecCollection.prototype.model = SpecModel;

  return SpecCollection;

})(Backbone.Collection);

SpecView = (function(superClass) {
  extend(SpecView, superClass);

  function SpecView() {
    this.deactivate = bind(this.deactivate, this);
    this.activate = bind(this.activate, this);
    this.changeState = bind(this.changeState, this);
    return SpecView.__super__.constructor.apply(this, arguments);
  }

  SpecView.prototype.initialize = function() {
    this.state = false;
    this["class"] = 'parts--active';
    return this.model.on('deactivate', this.deactivate);
  };

  SpecView.prototype.events = {
    'click': 'changeState'
  };

  SpecView.prototype.changeState = function() {
    if (this.state) {
      this.model.trigger('pass');
      return this.deactivate();
    } else {
      return this.activate();
    }
  };

  SpecView.prototype.activate = function() {
    if (this.options.list.active) {
      this.$el.addClass(this["class"]);
      this.state = true;
      return this.model.trigger('active', this.model);
    } else {
      return this.options.list.trigger('error');
    }
  };

  SpecView.prototype.deactivate = function() {
    this.$el.removeClass(this["class"]);
    return this.state = false;
  };

  return SpecView;

})(Backbone.View);

SpecList = (function(superClass) {
  extend(SpecList, superClass);

  function SpecList() {
    this.pass = bind(this.pass, this);
    this.fromTypes = bind(this.fromTypes, this);
    this.error = bind(this.error, this);
    this.deactivate = bind(this.deactivate, this);
    return SpecList.__super__.constructor.apply(this, arguments);
  }

  SpecList.prototype.initialize = function() {
    this.active = false;
    this.ids = {
      type: 0,
      spec: 0
    };
    this.collection = new SpecCollection;
    this.collection.on('pass', this.pass);
    this.collection.on('active', this.deactivate);
    this.on('error', this.error);
    this.options.types.on('changed', this.fromTypes);
    return this.fillCollection();
  };

  SpecList.prototype.deactivate = function(model) {
    this.ids.spec = model.get('id');
    this.collection.each((function(_this) {
      return function(m) {
        if (m !== model) {
          return m.trigger('deactivate');
        }
      };
    })(this));
    return this.trigger('changed', this.ids);
  };

  SpecList.prototype.error = function() {
    return console.log('choose type');
  };

  SpecList.prototype.fromTypes = function(id) {
    if (id) {
      this.active = true;
      this.ids.type = id;
      if (this.ids.spec !== 0) {
        return this.trigger('changed', this.ids);
      }
    } else {
      this.active = false;
      this.trigger('changed', 0);
      this.ids.spec = 0;
      return this.collection.each((function(_this) {
        return function(model) {
          return model.trigger('deactivate');
        };
      })(this));
    }
  };

  SpecList.prototype.pass = function() {
    this.ids.spec = 0;
    return this.trigger('changed', this.ids);
  };

  SpecList.prototype.fillCollection = function() {
    return this.$el.children('li').each((function(_this) {
      return function(i, li) {
        var id, m, v;
        id = $(li).data('id');
        m = new SpecModel({
          id: id
        });
        v = new SpecView({
          model: m,
          el: li,
          list: _this
        });
        return _this.collection.add(m);
      };
    })(this));
  };

  return SpecList;

})(Backbone.View);

MakeModel = (function(superClass) {
  extend(MakeModel, superClass);

  function MakeModel() {
    return MakeModel.__super__.constructor.apply(this, arguments);
  }

  MakeModel.prototype.defaults = {
    id: 0,
    title: '',
    active: false
  };

  return MakeModel;

})(Backbone.Model);

MakeCollection = (function(superClass) {
  extend(MakeCollection, superClass);

  function MakeCollection() {
    return MakeCollection.__super__.constructor.apply(this, arguments);
  }

  MakeCollection.prototype.model = MakeModel;

  return MakeCollection;

})(Backbone.Collection);

MakeView = (function(superClass) {
  extend(MakeView, superClass);

  function MakeView() {
    this.changeState = bind(this.changeState, this);
    this.show = bind(this.show, this);
    this.hide = bind(this.hide, this);
    return MakeView.__super__.constructor.apply(this, arguments);
  }

  MakeView.prototype.initialize = function() {
    this["class"] = 'makes--active';
    this.model.on('hide', this.hide);
    return this.model.on('show', this.show);
  };

  MakeView.prototype.hide = function() {
    this.$el.css('display', 'none');
    return this.deactivate();
  };

  MakeView.prototype.show = function() {
    return this.$el.css('display', 'block');
  };

  MakeView.prototype.events = {
    'click': 'changeState'
  };

  MakeView.prototype.changeState = function() {
    if (!this.model.get('active')) {
      return this.activate();
    } else {
      return this.deactivate();
    }
  };

  MakeView.prototype.activate = function() {
    this.$el.addClass(this["class"]);
    return this.model.set('active', true);
  };

  MakeView.prototype.deactivate = function() {
    this.$el.removeClass(this["class"]);
    return this.model.set('active', false);
  };

  return MakeView;

})(Backbone.View);

MakeList = (function(superClass) {
  extend(MakeList, superClass);

  function MakeList() {
    this.updateIds = bind(this.updateIds, this);
    this.changed = bind(this.changed, this);
    this.error = bind(this.error, this);
    return MakeList.__super__.constructor.apply(this, arguments);
  }

  MakeList.prototype.url = 'api/live-makes';

  MakeList.prototype.home = $('body').data('home');

  MakeList.prototype.ids = [];

  MakeList.prototype.parentIds = {};

  MakeList.prototype.button = $('#show-found-orgs');

  MakeList.prototype.makesElement = $('.makes.makes--live');

  MakeList.prototype.empty = $('.makes_empty');

  MakeList.prototype.initialize = function() {
    this.on('error', this.error);
    this.options.specs.on('changed', this.changed);
    this.collection = new MakeCollection;
    this.collection.on('change', this.updateIds);
    return this.fillCollection();
  };

  MakeList.prototype.error = function() {
    return console.log('please chose make');
  };

  MakeList.prototype.fillCollection = function() {
    return this.$el.children('li').each((function(_this) {
      return function(i, li) {
        var id, m, title, v;
        id = $(li).data('id');
        title = $(li).children('span').html().trim();
        m = new MakeModel({
          id: id,
          title: title
        });
        v = new MakeView({
          model: m,
          el: li
        });
        return _this.collection.add(m);
      };
    })(this));
  };

  MakeList.prototype.changed = function(ids) {
    this.parentIds = ids;
    if (ids === 0 || ids.spec === 0) {
      this.hide();
      this.trigger('hideComps');
      return;
    }
    return this.getMakes(ids);
  };

  MakeList.prototype.getMakes = function(ids) {
    var self;
    console.log(ids, 'selected');
    self = this;
    return $.ajax(this.home + "/" + this.url, {
      data: ids
    }).done((function(_this) {
      return function(rids) {
        if (rids.length === 0) {
          _this.empty.show();
          _this.button.hide();
          _this.trigger('hideComps');
        } else {
          _this.empty.hide();
          _this.button.css('display', 'flex');
        }
        return self.updateCollection(rids);
      };
    })(this));
  };

  MakeList.prototype.hide = function() {
    this.makesElement.hide();
    return this.button.hide();
  };

  MakeList.prototype.show = function() {
    return this.makesElement.show();
  };

  MakeList.prototype.updateCollection = function(ids) {
    console.log(ids, 'received');
    this.show();
    return this.collection.each(function(model) {
      if (ids.have(model.get('id'))) {
        return model.trigger('show');
      } else {
        return model.trigger('hide');
      }
    });
  };

  MakeList.prototype.updateIds = function(model) {
    if (model.get('active')) {
      this.ids.push(model.get('id'));
    } else {
      this.ids.remove(model.get('id'));
    }
    this.parentIds.makes = this.ids;
    return this.trigger('changed', this.parentIds);
  };

  return MakeList;

})(Backbone.View);

CompanyModel = (function(superClass) {
  extend(CompanyModel, superClass);

  function CompanyModel() {
    return CompanyModel.__super__.constructor.apply(this, arguments);
  }

  CompanyModel.prototype.defaults = {
    address: '',
    about: '',
    excerpt: '',
    logo: '',
    name: '',
    phone: '',
    tags: ''
  };

  return CompanyModel;

})(Backbone.Model);

CompanyView = (function(superClass) {
  extend(CompanyView, superClass);

  function CompanyView() {
    return CompanyView.__super__.constructor.apply(this, arguments);
  }

  CompanyView.prototype.template = $.HandlebarsFactory('#company-template');

  CompanyView.prototype.popup = $('#company-main-popup');

  CompanyView.prototype.initialize = function() {
    var src;
    src = $.parseHTML(this.template({
      logo: this.model.get('logo'),
      name: this.model.get('name'),
      about: this.model.get('about'),
      address: this.model.get('address'),
      phone: this.model.get('phone'),
      tags: this.model.get('tags')
    }));
    return this.$el.magnificPopup({
      type: 'inline',
      closeBtnInside: true,
      items: {
        src: '#company-main-popup'
      },
      callbacks: {
        open: (function(_this) {
          return function() {
            _this.popup.append(src);
            return _this.popup.find('.company-popup_close').click(function() {
              return $.magnificPopup.instance.close();
            });
          };
        })(this),
        close: (function(_this) {
          return function() {
            return _this.popup.html('');
          };
        })(this)
      }
    });
  };

  return CompanyView;

})(Backbone.View);

CompanyCollection = (function(superClass) {
  extend(CompanyCollection, superClass);

  function CompanyCollection() {
    return CompanyCollection.__super__.constructor.apply(this, arguments);
  }

  CompanyCollection.prototype.model = CompanyModel;

  return CompanyCollection;

})(Backbone.Collection);

CompanyList = (function(superClass) {
  extend(CompanyList, superClass);

  function CompanyList() {
    this.updateCollection = bind(this.updateCollection, this);
    this.getMore = bind(this.getMore, this);
    this.makesChanged = bind(this.makesChanged, this);
    this.showMe = bind(this.showMe, this);
    this.hideMe = bind(this.hideMe, this);
    return CompanyList.__super__.constructor.apply(this, arguments);
  }

  CompanyList.prototype.url = 'api/get-companies-by-makes-and-specs';

  CompanyList.prototype.home = $('body').data('home');

  CompanyList.prototype.button = $('#show-found-orgs');

  CompanyList.prototype.template = $.HandlebarsFactory('#found-template');

  CompanyList.prototype.initialize = function() {
    this.toSkip = 0;
    this.active = false;
    this.collection = new CompanyCollection;
    this.ids = [];
    this.options.makes.on('changed', this.makesChanged);
    this.button.on('click', this.showMe);
    return this.options.makes.on('hideComps', this.hideMe);
  };

  CompanyList.prototype.hideMe = function() {
    return this.$el.html('');
  };

  CompanyList.prototype.showMe = function() {
    this.active = true;
    if (this.ids.length === 0) {
      this.options.makes.trigger('error');
      return;
    }
    $('html, body').animate({
      scrollTop: this.$el.offset().top
    }, 500);
    return this.render();
  };

  CompanyList.prototype.render = function() {
    this.$el.html(this.template({
      companies: this.collection.toJSON()
    }));
    this.$el.find('.company-preview').each((function(_this) {
      return function(i, el) {
        var v;
        return v = new CompanyView({
          model: _this.collection.at(i),
          el: el
        });
      };
    })(this));
    this.showMore = this.$el.find('.found_more');
    if (!this.more) {
      return this.showMore.hide();
    } else {
      return this.showMore.click(this.getMore);
    }
  };

  CompanyList.prototype.makesChanged = function(ids) {
    this.ids = ids;
    this.hideMe();
    this.toSkip = 0;
    this.active = false;
    return this.get();
  };

  CompanyList.prototype.get = function() {
    return $.ajax(this.home + "/" + this.url, {
      data: {
        type: this.ids.type,
        makes: this.ids.makes,
        spec: this.ids.spec,
        skip: this.toSkip
      }
    }).done((function(_this) {
      return function(comps) {
        _this.fillCollection(JSON.parse(comps));
        return console.log(JSON.parse(comps).length);
      };
    })(this));
  };

  CompanyList.prototype.fillCollection = function(c) {
    var comp, i, j, len, m;
    this.collection.reset();
    for (i = j = 0, len = c.length; j < len; i = ++j) {
      comp = c[i];
      if (i < 5) {
        m = new CompanyModel({
          address: comp.address,
          about: comp.about,
          excerpt: comp.about.excerpt(),
          logo: "url(" + comp.logo + ")",
          name: comp.name,
          phone: comp.phone,
          tags: comp.tags
        });
        this.collection.add(m);
      } else {
        console.log(comp);
        this.more = true;
      }
    }
    if (this.active) {
      return this.render();
    }
  };

  CompanyList.prototype.getMore = function() {
    this.toSkip += 5;
    this.more = false;
    return $.ajax(this.home + "/" + this.url, {
      data: {
        type: this.ids.type,
        makes: this.ids.makes,
        spec: this.ids.spec,
        skip: this.toSkip
      }
    }).done((function(_this) {
      return function(comps) {
        return _this.updateCollection(JSON.parse(comps));
      };
    })(this));
  };

  CompanyList.prototype.updateCollection = function(c) {
    var comp, i, j, len, m;
    for (i = j = 0, len = c.length; j < len; i = ++j) {
      comp = c[i];
      if (i < 5) {
        m = new CompanyModel({
          address: comp.address,
          about: comp.about,
          excerpt: comp.about.excerpt(),
          logo: "url(" + comp.logo + ")",
          name: comp.name,
          phone: comp.phone,
          tags: comp.tags
        });
        this.collection.add(m);
      } else {
        console.log(comp);
        this.more = true;
      }
    }
    return this.render();
  };

  return CompanyList;

})(Backbone.View);

types = new TypeList({
  el: '#main-type-list'
});

specs = new SpecList({
  el: '#parts-list',
  types: types
});

makes = new MakeList({
  el: '#main-makes-list',
  specs: specs
});

companies = new CompanyList({
  el: '#found',
  makes: makes
});

},{"./inc/TypeList":9}],13:[function(require,module,exports){
var Counter, Votes, dislikes, likes, mention_photos,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

mention_photos = $('#mention_photos');

mention_photos.photosetGrid({
  gutter: '3px',
  highresLinks: true,
  onComplete: function() {
    return mention_photos.find('a').magnificPopup({
      type: 'image',
      closeBtnInside: false,
      gallery: {
        enabled: true
      }
    });
  }
});

Counter = (function() {
  Counter.prototype.home = $('body').data('home');

  Counter.prototype.id = $('.mention_rate:first').data('id');

  Counter.prototype.url = 'api/feedback/vote';

  function Counter(el, elInfo, _class) {
    this.el = el;
    this.elInfo = elInfo;
    this["class"] = _class;
    this.send = bind(this.send, this);
    this.minus = bind(this.minus, this);
    this.plus = bind(this.plus, this);
    this.toggle = bind(this.toggle, this);
    this.pass = bind(this.pass, this);
    this.span = this.el.children('span');
    this.count = this.el.data('count');
    this.active = this.el.data('active');
    if (this.active) {
      this.el.addClass(this["class"]);
    }
    this.el.click(this.pass);
  }

  Counter.prototype.pass = function() {
    return this.click(this);
  };

  Counter.prototype.updateInfo = function() {
    return this.elInfo.html(this.count);
  };

  Counter.prototype.toggle = function() {
    if (this.active) {
      this.minus();
      this.active = 0;
      this.el.removeClass(this["class"]);
    } else {
      this.plus();
      this.active = 1;
      this.el.addClass(this["class"]);
    }
    return this.updateInfo();
  };

  Counter.prototype.plus = function() {
    return this.span.html(++this.count);
  };

  Counter.prototype.minus = function() {
    return this.span.html(--this.count);
  };

  Counter.prototype.send = function(type) {
    return $.ajax(this.home + "/" + this.url, {
      headers: {
        'X-CSRF-TOKEN': $('body').data('csrf')
      },
      method: 'POST',
      data: {
        id: this.id,
        active: this.active,
        type: type
      }
    }).done((function(_this) {
      return function(response) {
        return console.log(response);
      };
    })(this)).error(function() {
      return console.log('error');
    });
  };

  return Counter;

})();

Votes = (function() {
  function Votes(likes1, dislikes1) {
    this.likes = likes1;
    this.dislikes = dislikes1;
    this.dislikesClick = bind(this.dislikesClick, this);
    this.likesClick = bind(this.likesClick, this);
    this.likes.click = this.likesClick;
    this.dislikes.click = this.dislikesClick;
  }

  Votes.prototype.likesClick = function(e) {
    e.toggle();
    if (this.dislikes.active) {
      this.dislikes.toggle();
    }
    return e.send('likes');
  };

  Votes.prototype.dislikesClick = function(e) {
    e.toggle();
    if (this.likes.active) {
      this.likes.toggle();
    }
    return e.send('dislikes');
  };

  return Votes;

})();

likes = new Counter($('#mention-likes'), $('#mention-likes-info'), 'mention_likes--active');

dislikes = new Counter($('#mention-dislikes'), $('#mention-dislikes-info'), 'mention_dislikes--active');

new Votes(likes, dislikes);

},{}],14:[function(require,module,exports){
var AddLogo, MakesList, SelectType, SelectView, about, address, logo, logolabel, makes, name, phone, specs, submit, types,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SelectView = require('../inc/SelectView');

MakesList = require('../create-company/MakesList');

$('#create-company-button').magnificPopup({
  type: 'inline',
  closeBtnInside: true
});

specs = $('#create-company-spec');

specs.selectBox();

name = $('#create-company-name');

address = $('#create-company-address');

phone = $('#create-company-phone');

about = $('#create-company-about');

logolabel = $('#create-company-logo-label');

logolabel.css('padding', '10px');

logolabel.css('margin-bottom', '0');

autosize(about);

AddLogo = (function() {
  function AddLogo(btn, input, container) {
    this.check = bind(this.check, this);
    var self;
    self = this;
    this.btn = $(btn);
    this.input = $(input);
    this.container = $(container);
    this.input.change(function() {
      return self.check(this.files);
    });
    this.src = '';
    this.btn.click(function() {
      return self.input.click();
    });
  }

  AddLogo.prototype.check = function(files) {
    var file;
    file = files[0];
    if (file.type.search('image') === -1) {
      return this.error();
    } else {
      return this.read(file);
    }
  };

  AddLogo.prototype.error = function() {
    return alert('это не картинка');
  };

  AddLogo.prototype.append = function(src) {
    var img;
    this.container.html('');
    img = new Image;
    img.src = src;
    console.log(img);
    return this.container.html(img);
  };

  AddLogo.prototype.get = function() {
    return this.src;
  };

  AddLogo.prototype.read = function(file) {
    var r, src;
    src = '';
    r = new FileReader;
    r.onloadend = (function(_this) {
      return function() {
        src = r.result;
        _this.src = src;
        return _this.append(src);
      };
    })(this);
    return r.readAsDataURL(file);
  };

  return AddLogo;

})();

logo = new AddLogo('#create-company-logo-btn', '#create-company-logo', '#create-company-logo-html');

SelectType = (function(superClass) {
  extend(SelectType, superClass);

  function SelectType() {
    return SelectType.__super__.constructor.apply(this, arguments);
  }

  SelectType.prototype.initialize = function() {
    var self;
    self = this;
    this.$el.selectBox();
    return this.$el.change(function() {
      return self.trigger('changed', $(this).val());
    });
  };

  SelectType.prototype.error = function() {
    return this.$el.selectBox('control').blink();
  };

  SelectType.prototype.get = function() {
    return this.$el.val();
  };

  return SelectType;

})(Backbone.View);

types = new SelectType({
  el: '#create-company-type'
});

makes = new MakesList({
  el: '#create-company_makes-models',
  types: types
});

submit = $('#create-company-submit');

submit.click(function() {
  var result;
  result = {};
  if (types.get() != null) {
    result.type = parseInt(types.get());
  } else {
    types.error();
    return;
  }
  if (specs.val() != null) {
    result.spec = parseInt(specs.val());
  } else {
    specs.selectBox('control').blink();
    return;
  }
  result.makesmodels = makes.get();
  if (name.val() === '') {
    name.blink();
    return;
  } else {
    result.name = name.val();
  }
  if (address.val() === '') {
    address.blink();
    return;
  } else {
    result.address = address.val();
  }
  if (phone.val() === '') {
    phone.blink();
    return;
  } else {
    result.phone = phone.val();
  }
  if (about.val() === '') {
    about.blink();
    return;
  } else {
    result.about = about.val();
  }
  if (logo.get() !== '') {
    result.logo = logo.get();
  } else {
    logolabel.blink();
    return;
  }
  $(this).preload('start');
  return $.ajax(($('body').data('home')) + "/api/company/create", {
    headers: {
      'X-CSRF-TOKEN': $('body').data('csrf')
    },
    method: 'POST',
    data: result
  }).done((function(_this) {
    return function(response) {
      $(_this).preload('stop');
      return setTimeout(function() {
        $.magnificPopup.instance.close();
        return location.href = response;
      }, 1000);
    };
  })(this));
});

},{"../create-company/MakesList":5,"../inc/SelectView":8}],15:[function(require,module,exports){
var AddPhotos, Image, ImageCollection, ImageView, ImagesView, List, ListCollection, ListModel, ListView, SelectView, imageCollection, imagesView, make, minuses, model, pluses, quill, type,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SelectView = require('../inc/SelectView');

$('#feedback').magnificPopup({
  type: 'inline',
  closeBtnInside: true
});

model = new SelectView({
  el: '#feedback-model',
  url: 'api/get-models-by-make'
});

make = new SelectView({
  el: '#feedback-make',
  c: model,
  url: 'api/get-makes-by-type'
});

type = new SelectView({
  el: '#feedback-type',
  c: make
});

Image = (function(superClass) {
  extend(Image, superClass);

  function Image() {
    return Image.__super__.constructor.apply(this, arguments);
  }

  Image.prototype.defaults = {
    src: ''
  };

  return Image;

})(Backbone.Model);

ImageCollection = (function(superClass) {
  extend(ImageCollection, superClass);

  function ImageCollection() {
    return ImageCollection.__super__.constructor.apply(this, arguments);
  }

  ImageCollection.prototype.model = Image;

  return ImageCollection;

})(Backbone.Collection);

ImageView = (function(superClass) {
  extend(ImageView, superClass);

  function ImageView() {
    this.destroy = bind(this.destroy, this);
    this.clean = bind(this.clean, this);
    return ImageView.__super__.constructor.apply(this, arguments);
  }

  ImageView.prototype.className = 'feedback_photo';

  ImageView.prototype.template = $.HandlebarsFactory('#photos-template');

  ImageView.prototype.initialize = function() {
    var self;
    self = this;
    this.model.on('clean', this.clean);
    this.render();
    return this.$el.find('.popup_redx:first').click(function() {
      return self.destroy();
    });
  };

  ImageView.prototype.clean = function() {
    return this.$el.remove();
  };

  ImageView.prototype.destroy = function() {
    this.model.destroy();
    return this.clean();
  };

  ImageView.prototype.render = function() {
    return this.$el.html(this.template({
      src: this.model.get('src')
    }));
  };

  return ImageView;

})(Backbone.View);

ImagesView = (function(superClass) {
  extend(ImagesView, superClass);

  function ImagesView() {
    this.added = bind(this.added, this);
    return ImagesView.__super__.constructor.apply(this, arguments);
  }

  ImagesView.prototype.initialize = function() {
    return this.collection.on('add', this.added);
  };

  ImagesView.prototype.added = function(m) {
    this.clean();
    return this.render();
  };

  ImagesView.prototype.clean = function() {
    return this.collection.each((function(_this) {
      return function(image) {
        return image.trigger('clean');
      };
    })(this));
  };

  ImagesView.prototype.render = function() {
    return this.collection.each((function(_this) {
      return function(image) {
        var view;
        view = new ImageView({
          model: image
        });
        return _this.options.plus.before(view.el);
      };
    })(this));
  };

  ImagesView.prototype.get = function() {
    var r;
    r = [];
    this.collection.each(function(image) {
      return r.push(image.get('src'));
    });
    return r;
  };

  return ImagesView;

})(Backbone.View);

imageCollection = new ImageCollection;

imagesView = new ImagesView({
  collection: imageCollection,
  el: '#feedback-photos',
  plus: $('#feedback-plus')
});

AddPhotos = (function() {
  function AddPhotos(input, plus) {
    var self;
    self = this;
    this.input = $(input);
    this.plus = $(plus);
    this.input.change(function() {
      return self.check(this.files);
    });
    this.plus.click(function() {
      return self.input.click();
    });
  }

  AddPhotos.prototype.check = function(files) {
    var file, i, j, len, results;
    results = [];
    for (i = j = 0, len = files.length; j < len; i = ++j) {
      file = files[i];
      if (file.type.search('image') !== -1) {
        results.push(this.read(file));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  AddPhotos.prototype.read = function(file) {
    var r, src;
    src = '';
    r = new FileReader;
    if (imageCollection.length < 10) {
      r.onloadend = function() {
        return imageCollection.add(new Image({
          src: r.result
        }));
      };
    }
    return r.readAsDataURL(file);
  };

  return AddPhotos;

})();

new AddPhotos('#feedback-input', '#feedback-plus');

quill = new Quill('#feedback-editor', {
  theme: 'snow'
});

quill.addModule('toolbar', {
  container: '#feedback-editor-toolbar'
});

ListModel = (function(superClass) {
  extend(ListModel, superClass);

  function ListModel() {
    return ListModel.__super__.constructor.apply(this, arguments);
  }

  ListModel.prototype.defaults = {
    text: ''
  };

  return ListModel;

})(Backbone.Model);

ListCollection = (function(superClass) {
  extend(ListCollection, superClass);

  function ListCollection() {
    return ListCollection.__super__.constructor.apply(this, arguments);
  }

  ListCollection.prototype.model = ListModel;

  return ListCollection;

})(Backbone.Collection);

ListView = (function(superClass) {
  extend(ListView, superClass);

  function ListView() {
    this.clean = bind(this.clean, this);
    this.error = bind(this.error, this);
    return ListView.__super__.constructor.apply(this, arguments);
  }

  ListView.prototype.template = $.HandlebarsFactory('#plus-minus-template');

  ListView.prototype.initialize = function() {
    var self;
    self = this;
    this.render();
    this.model.on('clean', this.clean);
    this.model.on('error', this.error);
    this.$el.find('.popup_redx').click((function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
    return this.$el.children('input').keyup(function() {
      return self.model.set('text', $(this).val());
    });
  };

  ListView.prototype.error = function() {
    return this.$el.children('input').blink();
  };

  ListView.prototype.render = function() {
    return this.$el.html(this.template({
      text: this.model.get('text')
    }));
  };

  ListView.prototype.destroy = function() {
    this.model.destroy();
    return this.clean();
  };

  ListView.prototype.clean = function() {
    return this.$el.remove();
  };

  return ListView;

})(Backbone.View);

List = (function(superClass) {
  extend(List, superClass);

  function List() {
    this.add = bind(this.add, this);
    return List.__super__.constructor.apply(this, arguments);
  }

  List.prototype.initialize = function() {
    return this.options.add.on('click', this.add);
  };

  List.prototype.add = function() {
    this.collection.add(new ListModel);
    this.clean();
    return this.render();
  };

  List.prototype.clean = function() {
    return this.collection.each(function(item) {
      return item.trigger('clean');
    });
  };

  List.prototype.addFirst = function() {
    var v;
    v = new ListView({
      model: this.collection.at(0),
      className: this.options["class"]
    });
    return this.$el.children('div:first').after(v.el);
  };

  List.prototype.render = function() {
    return this.collection.each((function(_this) {
      return function(item) {
        var v;
        v = new ListView({
          model: item,
          className: _this.options["class"]
        });
        return _this.$el.append(v.el);
      };
    })(this));
  };

  List.prototype.get = function() {
    var r;
    r = [];
    this.collection.each(function(model) {
      return r.push(model);
    });
    return r;
  };

  List.prototype.getText = function() {
    var r;
    r = [];
    this.collection.each(function(model) {
      return r.push(model.get('text'));
    });
    return r;
  };

  return List;

})(Backbone.View);

pluses = new List({
  add: $('#feedback-add-plus'),
  el: '#feedback-pluses',
  "class": 'feedback_plus',
  collection: new ListCollection
});

minuses = new List({
  add: $('#feedback-add-minus'),
  el: '#feedback-minuses',
  "class": 'feedback_minus',
  collection: new ListCollection
});

$('#add-feedback').click(function() {
  var header, j, k, len, len1, minus, plus, ref, ref1, result;
  result = {};
  if (type.get() != null) {
    result.type = parseInt(type.get());
  } else {
    type.error();
    return;
  }
  if (make.get() != null) {
    result.make = parseInt(make.get());
  } else {
    make.error();
    return;
  }
  if (model.get() != null) {
    result.model = parseInt(model.get());
  } else {
    model.error();
    return;
  }
  if (imagesView.get().length !== 0) {
    result.images = imagesView.get();
  }
  header = $('#feedback-header');
  if (header.val() === '') {
    header.blink();
  } else {
    result.header = header.val();
  }
  if (quill.getLength() === 1) {
    $('#feedback-editor').blink();
  } else {
    result.content = quill.getHTML();
  }
  if (pluses.get().length !== 0) {
    ref = pluses.get();
    for (j = 0, len = ref.length; j < len; j++) {
      plus = ref[j];
      if (plus.get('text').length === 0) {
        plus.trigger('error');
        return false;
      }
    }
    result.pluses = pluses.getText();
  }
  if (minuses.get().length !== 0) {
    ref1 = minuses.get();
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      minus = ref1[k];
      if (minus.get('text').length === 0) {
        minus.trigger('error');
        return false;
      }
    }
    result.minuses = minuses.getText();
  }
  $(this).preload('start');
  return $.ajax(($('body').data('home')) + "/api/feedback/create", {
    headers: {
      'X-CSRF-TOKEN': $('body').data('csrf')
    },
    method: 'POST',
    data: result
  }).done((function(_this) {
    return function(response) {
      console.log(response);
      $(_this).preload('stop');
      setTimeout(function() {
        return $.magnificPopup.instance.close();
      }, 1000);
      return setTimeout(function() {
        return $(_this).preload('reset');
      }, 1500);
    };
  })(this));
});

},{"../inc/SelectView":8}],16:[function(require,module,exports){
require('./search');

require('./sign-up');

require('./feedback');

require('./create-company');

},{"./create-company":14,"./feedback":15,"./search":17,"./sign-up":18}],17:[function(require,module,exports){
var SelectView, make, model, type;

SelectView = require('../inc/SelectView');

$('#search').magnificPopup({
  type: 'inline',
  closeBtnInside: true
});

model = new SelectView({
  el: '#search-model',
  url: 'api/get-models-by-make'
});

make = new SelectView({
  el: '#search-make',
  c: model,
  url: 'api/get-makes-by-type'
});

type = new SelectView({
  el: '#search-type',
  c: make
});

autosize($('#search-more'));

},{"../inc/SelectView":8}],18:[function(require,module,exports){
var button, email, form, passw, submit;

$('#sign-up').magnificPopup({
  type: 'inline',
  closeBtnInside: true
});

$('#footer-sign-up').magnificPopup({
  type: 'inline',
  closeBtnInside: true
});

$.fn.highlight = function() {
  return $(this).animate({
    backgroundColor: '#f3df6d',
    color: '#fff'
  }, 1000);
};

form = $('#sign-up-form');

button = $('#sign-up-button');

if (form) {
  submit = function() {
    var pattern;
    pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
    if (pattern.test(email.val())) {
      if (passw.val() !== '') {
        return form.submit();
      } else {
        return passw.blink();
      }
    } else {
      return email.blink();
    }
  };
  email = form.find('input[name="email"]');
  passw = form.find('input[name="password"]');
  button.click(submit);
  form.keypress(function(e) {
    if (e.which === 13) {
      return submit();
    }
  });
}

},{}],19:[function(require,module,exports){
var Avatar, FieldCollection, FieldModel, FieldSet, FieldView, collection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Avatar = require('./inc/Avatar');

$('#profile-pen').magnificPopup({
  type: 'inline',
  closeBtnInside: true
});

FieldModel = (function(superClass) {
  extend(FieldModel, superClass);

  function FieldModel() {
    return FieldModel.__super__.constructor.apply(this, arguments);
  }

  FieldModel.prototype.defaults = {
    value: '',
    newvalue: '',
    name: '',
    title: '',
    state: 'same',
    elToRefresh: ''
  };

  return FieldModel;

})(Backbone.Model);

FieldCollection = (function(superClass) {
  extend(FieldCollection, superClass);

  function FieldCollection() {
    return FieldCollection.__super__.constructor.apply(this, arguments);
  }

  FieldCollection.prototype.model = FieldModel;

  return FieldCollection;

})(Backbone.Collection);

FieldView = (function(superClass) {
  extend(FieldView, superClass);

  function FieldView() {
    this.error = bind(this.error, this);
    this.update = bind(this.update, this);
    this.updateModel = bind(this.updateModel, this);
    return FieldView.__super__.constructor.apply(this, arguments);
  }

  FieldView.prototype.className = 'popup_field';

  FieldView.prototype.template = $.HandlebarsFactory('#popup-field-template');

  FieldView.prototype.initialize = function() {
    this.render();
    this.model.on('error', this.error);
    this.model.on('update', this.update);
    if (this.model.get('name') === 'about') {
      this.input = this.$el.children('textarea');
    } else {
      this.input = this.$el.children('input');
    }
    if (this.input.val() === '') {
      this.model.set('state', 'empty');
    }
    return this.input.keyup(this.updateModel);
  };

  FieldView.prototype.updateModel = function() {
    this.model.set('newvalue', this.input.val());
    if (this.model.get('value') === this.model.get('newvalue')) {
      return this.model.set('state', 'same');
    } else if (this.model.get('newvalue') === '') {
      return this.model.set('state', 'empty');
    } else {
      return this.model.set('state', 'ready');
    }
  };

  FieldView.prototype.update = function() {
    var el;
    el = this.model.get('elToRefresh');
    if (this.model.get('newvalue') !== '') {
      this.model.set('value', this.model.get('newvalue'));
    }
    this.model.set('state', 'same');
    return el.html(this.model.get('value'));
  };

  FieldView.prototype.error = function() {
    return this.$el.children('input, textarea').blink();
  };

  FieldView.prototype.render = function() {
    if (this.model.get('value')) {
      this.$el.html(this.template({
        label: this.model.get('title'),
        value: this.model.get('value'),
        input: this.model.get('name') === 'about' ? false : true
      }));
    } else {
      this.$el.html(this.template({
        label: this.model.get('title'),
        input: this.model.get('name') === 'about' ? false : true
      }));
    }
    return this.$el;
  };

  return FieldView;

})(Backbone.View);

FieldSet = (function(superClass) {
  extend(FieldSet, superClass);

  function FieldSet() {
    this.saveChanges = bind(this.saveChanges, this);
    return FieldSet.__super__.constructor.apply(this, arguments);
  }

  FieldSet.prototype.url = 'api/user/edit';

  FieldSet.prototype.home = $('body').data('home');

  FieldSet.prototype.button = $('#edit-profile-button');

  FieldSet.prototype.initialize = function() {
    this.render();
    return this.button.click(this.saveChanges);
  };

  FieldSet.prototype.saveChanges = function() {
    var data, pass;
    pass = true;
    data = {};
    this.collection.each(function(field) {
      if (field.get('state') === 'empty') {
        field.trigger('error');
        return pass = false;
      } else if (field.get('newvalue') !== '') {
        return data[field.get('name')] = field.get('newvalue');
      }
    });
    if (pass) {
      return this.post(data);
    }
  };

  FieldSet.prototype.updateModels = function() {
    return this.collection.each(function(model) {
      return model.trigger('update');
    });
  };

  FieldSet.prototype.post = function(data) {
    return $.ajax(this.home + "/" + this.url, {
      headers: {
        'X-CSRF-TOKEN': $('body').data('csrf')
      },
      method: 'POST',
      data: data
    }).done((function(_this) {
      return function(response) {
        console.log(response);
        _this.updateModels();
        return $.magnificPopup.instance.close();
      };
    })(this));
  };

  FieldSet.prototype.render = function() {
    return this.collection.each((function(_this) {
      return function(field) {
        var v;
        v = new FieldView({
          model: field
        });
        return _this.button.before(v.el);
      };
    })(this));
  };

  return FieldSet;

})(Backbone.View);

new Avatar('#user-ava', '#user-ava-file', 'api/user/avatar');

collection = new FieldCollection;

collection.add(new FieldModel({
  name: 'name',
  value: $.trim($('#edit-profile-name').children('span:first').html()),
  title: 'Имя',
  elToRefresh: $('#edit-profile-name').children('span:first')
}));

collection.add(new FieldModel({
  name: 'address',
  value: $.trim($('#edit-profile-address').html()),
  title: 'Адрес',
  elToRefresh: $('#edit-profile-address')
}));

collection.add(new FieldModel({
  name: 'phone',
  value: $.trim($('#edit-profile-phone').html()),
  title: 'Телефон',
  elToRefresh: $('#edit-profile-phone')
}));

collection.add(new FieldModel({
  name: 'about',
  value: $.trim($('#edit-profile-about').html()),
  title: 'О себе',
  elToRefresh: $('#edit-profile-about')
}));

new FieldSet({
  collection: collection
});

},{"./inc/Avatar":7}]},{},[10]);
