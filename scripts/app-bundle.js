define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      this.router = router;
      config.title = "Fun With Aurelia";
      config.map([{ route: '', redirect: 'contacts' }, { route: 'contacts', name: 'contacts', moduleId: 'contact-list', nav: true, title: 'Contacts' }, { route: 'contacts/new', name: 'contact-creation',
        moduleId: 'contact-edition', title: 'New contact' }, { route: 'contacts/:id', name: 'contact-details',
        moduleId: 'contact-details' }, { route: 'contacts/:id/edit', name: 'contact-edition',
        moduleId: 'contact-edition' }, { route: 'contacts/:id/photo', name: 'contact-photo',
        moduleId: 'contact-photo' }]);
      config.mapUnknownRoutes('not-found');
    };

    return App;
  }();
});
define('contact-details',['exports', 'aurelia-framework', './contact-gateway'], function (exports, _aureliaFramework, _contactGateway) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactDetails = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ContactDetails = exports.ContactDetails = (_dec = (0, _aureliaFramework.inject)(_contactGateway.ContactGateway), _dec(_class = function () {
    function ContactDetails(contactGateway) {
      _classCallCheck(this, ContactDetails);

      this.contactGateway = contactGateway;
    }

    ContactDetails.prototype.activate = function activate(params, config) {
      var _this = this;

      return this.contactGateway.getById(params.id).then(function (contact) {
        _this.contact = contact;
        config.navModel.setTitle(contact.fullName);
      });
    };

    ContactDetails.prototype.tryDelete = function tryDelete() {
      var _this2 = this;

      if (confirm('Do you want to delete this contact?')) {
        this.contactGateway.delete(this.contact.id).then(function () {
          _this2.router.navigateToRoute('contacts');
        });
      }
    };

    return ContactDetails;
  }()) || _class);
});
define('contact-edition',['exports', 'aurelia-framework', './contact-gateway', './models', 'aurelia-router', 'aurelia-validation'], function (exports, _aureliaFramework, _contactGateway, _models, _aureliaRouter, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactEdition = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ContactEdition = exports.ContactEdition = (_dec = (0, _aureliaFramework.inject)(_contactGateway.ContactGateway, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController), _aureliaRouter.Router), _dec(_class = function () {
    function ContactEdition(contactGateway, validationController, router) {
      _classCallCheck(this, ContactEdition);

      this.contactGateway = contactGateway;
      this.router = router;
      this.validationController = validationController;
    }

    ContactEdition.prototype.activate = function activate(params, config) {
      var _this = this;

      this.isNew = params.id === undefined;
      if (this.isNew) {
        this.contact = new _models.Contact();
      } else {
        return this.contactGateway.getById(params.id).then(function (contact) {
          _this.contact = contact;
          config.navModel.setTitle(contact.fullName);
        });
      }
    };

    ContactEdition.prototype.save = function save() {
      var _this2 = this;

      this.validationController.validate().then(function (errors) {
        console.log(errors);
        if (errors.length > 0) {
          return;
        }
        if (_this2.isNew) {
          _this2.contactGateway.create(_this2.contact).then(function () {
            return _this2.router.navigateToRoute('contacts');
          });
        } else {
          _this2.contactGateway.update(_this2.contact.id, _this2.contact).then(function () {
            return _this2.router.navigateToRoute('contact-details', { id: _this2.contact.id });
          });
        }
      });
    };

    return ContactEdition;
  }()) || _class);
});
define('contact-gateway',['exports', 'aurelia-framework', 'aurelia-fetch-client', './models', './environment'], function (exports, _aureliaFramework, _aureliaFetchClient, _models, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactGateway = undefined;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ContactGateway = exports.ContactGateway = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
    function ContactGateway(httpClient) {
      _classCallCheck(this, ContactGateway);

      this.httpClient = httpClient.configure(function (config) {
        config.useStandardConfiguration().withBaseUrl(_environment2.default.contactsUrl);
      });
    }

    ContactGateway.prototype.getAll = function getAll() {
      return this.httpClient.fetch('contacts').then(function (response) {
        return response.json();
      }).then(function (dto) {
        return dto.map(_models.Contact.fromObject);
      });
    };

    ContactGateway.prototype.getById = function getById(id) {
      return this.httpClient.fetch('contacts/' + id).then(function (response) {
        return response.json();
      }).then(_models.Contact.fromObject);
    };

    ContactGateway.prototype.create = function create(contact) {
      return this.httpClient.fetch('contacts', { method: 'POST', body: (0, _aureliaFetchClient.json)(contact) });
    };

    ContactGateway.prototype.update = function update(id, contact) {
      return this.httpClient.fetch('contacts/' + id, { method: 'PUT', body: (0, _aureliaFetchClient.json)(contact) });
    };

    ContactGateway.prototype.updatePhoto = function updatePhoto(id, file) {
      return this.httpClient.fetch('contacts/' + id + '/photo', {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });
    };

    ContactGateway.prototype.delete = function _delete(id) {
      return this.httpClient.fetch('contacts/' + id, { method: 'DELETE' });
    };

    return ContactGateway;
  }()) || _class);
});
define('contact-list',['exports', 'aurelia-framework', './contact-gateway'], function (exports, _aureliaFramework, _contactGateway) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ContactList = exports.ContactList = (_dec = (0, _aureliaFramework.inject)(_contactGateway.ContactGateway), _dec(_class = function () {
    function ContactList(contactGateway) {
      _classCallCheck(this, ContactList);

      this.contacts = [];

      this.contactGateway = contactGateway;
    }

    ContactList.prototype.activate = function activate() {
      var _this = this;

      return this.contactGateway.getAll().then(function (contacts) {
        _this.contacts.splice(0);
        _this.contacts.push.apply(_this.contacts, contacts);
      });
    };

    return ContactList;
  }()) || _class);
});
define('contact-photo',['exports', 'aurelia-framework', 'aurelia-router', './contact-gateway'], function (exports, _aureliaFramework, _aureliaRouter, _contactGateway) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactPhoto = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ContactPhoto = exports.ContactPhoto = (_dec = (0, _aureliaFramework.inject)(_contactGateway.ContactGateway, _aureliaRouter.Router), _dec(_class = function () {
    function ContactPhoto(contactGateway, router) {
      _classCallCheck(this, ContactPhoto);

      this.contactGateway = contactGateway;
      this.router = router;
    }

    ContactPhoto.prototype.activate = function activate(params, config) {
      var _this = this;

      return this.contactGateway.getById(params.id).then(function (contact) {
        _this.contact = contact;
        config.navModel.setTitle(_this.contact.fullName);
      });
    };

    ContactPhoto.prototype.save = function save() {
      var _this2 = this;

      if (this.photo && this.photo.length > 0) {
        this.contactGateway.updatePhoto(this.contact.id, this.photo.item(0)).then(function () {
          _this2.router.navigateToRoute('contact-details', { id: _this2.contact.id });
        });
      }
    };

    return ContactPhoto;
  }()) || _class);
});
define('environment',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true,
    contactsUrl: 'http://localhost:8000/'
  };
});
define('main',['exports', './environment', 'aurelia-logging', 'aurelia-logging-console'], function (exports, _environment, _aureliaLogging, _aureliaLoggingConsole) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  var LogManager = _interopRequireWildcard(_aureliaLogging);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('validation').feature('resources');

    LogManager.addAppender(new _aureliaLoggingConsole.ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.info);

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('models',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Contact = exports.SocialProfile = exports.Address = exports.EmailAddress = exports.PhoneNumber = undefined;

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var PhoneNumber = exports.PhoneNumber = function () {
    function PhoneNumber() {
      _classCallCheck(this, PhoneNumber);

      this.type = 'Home';
      this.number = '';

      _aureliaValidation.ValidationRules.ensure('type').required().maxLength(25).ensure('number').required().maxLength(25).on(this);
    }

    PhoneNumber.fromObject = function fromObject(src) {
      return Object.assign(new PhoneNumber(), src);
    };

    return PhoneNumber;
  }();

  var EmailAddress = exports.EmailAddress = function () {
    function EmailAddress() {
      _classCallCheck(this, EmailAddress);

      this.type = 'Home';
      this.address = '';

      _aureliaValidation.ValidationRules.ensure('type').required().maxLength(25).ensure('address').required().maxLength(250).email().on(this);
    }

    EmailAddress.fromObject = function fromObject(src) {
      return Object.assign(new EmailAddress(), src);
    };

    return EmailAddress;
  }();

  var Address = exports.Address = function () {
    function Address() {
      _classCallCheck(this, Address);

      this.type = 'Home';
      this.number = '';
      this.street = '';
      this.postalCode = '';
      this.city = '';
      this.state = '';
      this.country = '';

      _aureliaValidation.ValidationRules.ensure('type').required().maxLength(25).ensure('number').required().maxLength(100).ensure('street').required().maxLength(100).ensure('postalCode').required().maxLength(25).ensure('city').required().maxLength(100).ensure('state').maxLength(100).ensure('country').required().maxLength(100).on(this);
    }

    Address.fromObject = function fromObject(src) {
      return Object.assign(new Address(), src);
    };

    return Address;
  }();

  var SocialProfile = exports.SocialProfile = function () {
    function SocialProfile() {
      _classCallCheck(this, SocialProfile);

      this.type = 'GitHub';
      this.username = '';

      _aureliaValidation.ValidationRules.ensure('type').required().maxLength(25).ensure('username').required().maxLength(100).on(this);
    }

    SocialProfile.fromObject = function fromObject(src) {
      return Object.assign(new SocialProfile(), src);
    };

    return SocialProfile;
  }();

  var Contact = exports.Contact = function () {
    function Contact() {
      _classCallCheck(this, Contact);

      this.firstName = '';
      this.lastName = '';
      this.company = '';
      this.birthday = '';
      this.phoneNumbers = [];
      this.emailAddresses = [];
      this.addresses = [];
      this.socialProfiles = [];
      this.note = '';

      _aureliaValidation.ValidationRules.ensure('firstName').maxLength(100).ensure('lastName').maxLength(100).ensure('company').maxLength(100).ensure('birthday').satisfies(function (value, obj) {
        return value === null || value === undefined || value === '' || !isNaN(Date.parse(value));
      }).withMessage('${$displayName} must be a valid date.').ensure('note').maxLength(2000).on(this);
    }

    Contact.fromObject = function fromObject(src) {
      var contact = Object.assign(new Contact(), src);
      contact.phoneNumbers = contact.phoneNumbers.map(PhoneNumber.fromObject);
      contact.emailAddresses = contact.emailAddresses.map(EmailAddress.fromObject);
      contact.addresses = contact.addresses.map(Address.fromObject);
      contact.socialProfiles = contact.socialProfiles.map(SocialProfile.fromObject);
      return contact;
    };

    Contact.prototype.addPhoneNumber = function addPhoneNumber() {
      this.phoneNumbers.push(new PhoneNumber());
    };

    Contact.prototype.addEmailAddress = function addEmailAddress() {
      this.emailAddresses.push(new EmailAddress());
    };

    Contact.prototype.addAddress = function addAddress() {
      this.addresses.push(new Address());
    };

    Contact.prototype.addSocialProfile = function addSocialProfile() {
      this.socialProfiles.push(new SocialProfile());
    };

    _createClass(Contact, [{
      key: 'isPerson',
      get: function get() {
        return this.firstName || this.lastName;
      }
    }, {
      key: 'fullName',
      get: function get() {
        var fullName = this.isPerson ? this.firstName + ' ' + this.lastName : this.company;
        return fullName || '';
      }
    }, {
      key: 'firstLetter',
      get: function get() {
        var name = this.lastName || this.firstName || this.company;
        return name ? name[0].toUpperCase() : '?';
      }
    }]);

    return Contact;
  }();
});
define('not-found',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var NotFound = exports.NotFound = function NotFound() {
    _classCallCheck(this, NotFound);
  };
});
define('resources/index',['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.configure = configure;
	function configure(config) {
		config.globalResources(['./value-converters/order-by', './value-converters/group-by', './value-converters/filter-by']);
	}
});
define('validation/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.plugin('aurelia-validation');
  }
});
define('resources/value-converters/filter-by',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var FilterByValueConverter = exports.FilterByValueConverter = function () {
    function FilterByValueConverter() {
      _classCallCheck(this, FilterByValueConverter);
    }

    FilterByValueConverter.prototype.toView = function toView(array, value) {
      for (var _len = arguments.length, properties = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        properties[_key - 2] = arguments[_key];
      }

      value = (value || '').trim().toLowerCase();
      if (!value) {
        return array;
      }
      return array.filter(function (item) {
        return properties.some(function (property) {
          return (item[property] || '').toLowerCase().includes(value);
        });
      });
    };

    return FilterByValueConverter;
  }();
});
define('resources/value-converters/group-by',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var GroupByValueConverter = exports.GroupByValueConverter = function () {
    function GroupByValueConverter() {
      _classCallCheck(this, GroupByValueConverter);
    }

    GroupByValueConverter.prototype.toView = function toView(array, property) {
      var groups = new Map();
      for (var _iterator = array, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var item = _ref;

        var key = item[property];
        var group = groups.get(key);
        if (!group) {
          group = { key: key, items: [] };
          groups.set(key, group);
        }
        group.items.push(item);
      }
      return Array.from(groups.values());
    };

    return GroupByValueConverter;
  }();
});
define('resources/value-converters/order-by',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var OrderByValueConverter = exports.OrderByValueConverter = function () {
    function OrderByValueConverter() {
      _classCallCheck(this, OrderByValueConverter);
    }

    OrderByValueConverter.prototype.toView = function toView(array, property) {
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'asc';

      array = array.slice(0);
      var directionFactor = direction == 'desc' ? -1 : 1;
      array.sort(function (item1, item2) {
        var value1 = item1[property];
        var value2 = item2[property];
        if (value1 > value2) {
          return directionFactor;
        } else if (value1 < value2) {
          return -directionFactor;
        } else {
          return 0;
        }
      });
      return array;
    };

    return OrderByValueConverter;
  }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"app.css\"></require><nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse\"><span class=\"sr-only\">Toggle Navigation</span></button> <a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-home\"></i> <span>${router.title}</span></a></div><div class=\"collapse navbar-collapse\" id=\"skeleton-navigation-navbar-collapse\"><ul class=\"nav navbar-nav\"><li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\"><a data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse.in\" href.bind=\"row.href\">${row.title}</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li class=\"loader\" if.bind=\"router.isNavigating\"><i class=\"fa fa-spinner fa-spin fa-2x\"></i></li></ul></div></nav><div class=\"page-host\"><router-view></router-view></div></template>"; });
define('text!app.css', ['module'], function(module) { module.exports = ".page-host {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50px;\n  bottom: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n"; });
define('text!contact-details.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><div class=\"row\"><div class=\"col-sm-2\"><a route-href=\"route: contact-photo; params.bind:\n          { id: contact.id }\"><img src.bind=\"contact.photoUrl\" class=\"img-responsive\" alt=\"Photo\"></a></div><div class=\"col-sm-10\"><template if.bind=\"contact.isPerson\"><h1>${contact.fullName}</h1><h2>${contact.company}</h2></template><template if.bind=\"!contact.isPerson\"><h1>${contact.company}</h1></template><a class=\"btn btn-default\" route-href=\"route:\n          contact-edition;  \n          params.bind: { id: contact.id }\"><i class=\"fa fa-pencil-square-o\"></i> Modify </a><button class=\"btn btn-danger\" click.delegate=\"tryDelete()\"><i class=\"fa fa-trash-o\"></i> Delete</button></div></div><div class=\"form-horizontal\"><div class=\"form-group\"><label class=\"col-sm-2 control-label\">Created on</label><div class=\"col-sm-10\"><p class=\"form-control-static\">${contact.createdAt}</p></div></div><div class=\"form-group\"><label class=\"col-sm-2 control-label\">Modified on</label><div class=\"col-sm-10\"><p class=\"form-control-static\">${contact.modifiedAt}</p></div></div><div class=\"form-group\" if.bind=\"contact.birthday\"><label class=\"col-sm-2 control-label\">Birthday</label><div class=\"col-sm-10\"><p class=\"form-control-static\">${contact.birthday}</p></div></div><template if.bind=\"contact.phoneNumbers.length > 0\"><hr><div class=\"form-group\"><h4 class=\"col-sm-2 control-label\">Phone numbers</h4></div><div class=\"form-group\" repeat.for=\"phoneNumber of contact.phoneNumbers\"><label class=\"col-sm-2 control-label\">${phoneNumber.type}</label><div class=\"col-sm-10\"><p class=\"form-control-static\"><a href=\"tel:${phoneNumber.number}\">${phoneNumber.number}</a></p></div></div></template><template if.bind=\"contact.emailAddresses.length > 0\"><hr><div class=\"form-group\"><h4 class=\"col-sm-2 control-label\">Email addresses</h4></div><div class=\"form-group\" repeat.for=\"emailAddress of contact.emailAddresses\"><label class=\"col-sm-2 control-label\">${emailAddress.type}</label><div class=\"col-sm-10\"><p class=\"form-control-static\"><a href=\"mailto:${emailAddress.address}\" target=\"_blank\">${emailAddress.address}</a></p></div></div></template><template if.bind=\"contact.addresses.length > 0\"><hr><div class=\"form-group\"><h4 class=\"col-sm-2 control-label\">Addresses</h4></div><div class=\"form-group\" repeat.for=\"address of contact.addresses\"><label class=\"col-sm-2 control-label\">${address.type}</label><div class=\"col-sm-10\"><p class=\"form-control-static\">${address.number} ${address.street}</p><p class=\"form-control-static\">${address.postalCode} ${address.city}</p><p class=\"form-control-static\">${address.state} ${address.country}</p></div></div></template><template if.bind=\"contact.socialProfiles.length > 0\"><hr><div class=\"form-group\"><h4 class=\"col-sm-2 control-label\">Social Profiles</h4></div><div class=\"form-group\" repeat.for=\"profile of contact.socialProfiles\"><label class=\"col-sm-2 control-label\">${profile.type}</label><div class=\"col-sm-10\"><p class=\"form-control-static\"><a if.bind=\"profile.type === 'GitHub'\" href=\"https://github.com/${profile.username}\" target=\"_blank\">${profile.username}</a> <a if.bind=\"profile.type === 'Twitter'\" href=\"https://twitter.com/${profile.username}\" target=\"_blank\">${profile.username}</a></p></div></div></template><template if.bind=\"contact.note\"><hr><div class=\"form-group\"><label class=\"col-sm-2 control-label\">Note</label><div class=\"col-sm-10\"><p class=\"form-control-static\">${contact.note}</p></div></div></template></div></section></template>"; });
define('text!contact-edition.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1 if.bind=\"isNew\">New contact</h1><h1 if.bind=\"!isNew\">Contact #${contact.id}</h1><form class=\"form-horizontal\" submit.delegate=\"save()\"><ul class=\"col-sm-9 col-sm-offset-3 list-group text-danger\" if.bind=\"validationController.errors\"><li repeat.for=\"error of validationController.errors\" class=\"list-group-item\">${error.message}</li></ul><div class=\"form-group\"><label class=\"col-sm-3 control-label\">First name</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" value.bind=\"contact.firstName & validate\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\">Last name</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" value.bind=\"contact.lastName & validate\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\">Company</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" value.bind=\"contact.company & validate\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\">Birthday</label><div class=\"col-sm-9\"><input type=\"date\" class=\"form-control\" value.bind=\"contact.birthday & validate\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\">Note</label><div class=\"col-sm-9\"><textarea class=\"form-control\" value.bind=\"contact.note & validate\"></textarea></div></div><hr><div class=\"form-group\" repeat.for=\"phoneNumber of contact.phoneNumbers\"><div class=\"col-sm-2 col-sm-offset-1\"><select value.bind=\"phoneNumber.type\" class=\"form-control\"><option value=\"Home\">Home</option><option value=\"Office\">Office</option><option value=\"Mobile\">Mobile</option><option value=\"Other\">Other</option></select></div><div class=\"col-sm-8\"><input type=\"tel\" class=\"form-control\" placeholder=\"Phone number\" value.bind=\"phoneNumber.number & validate\"></div><div class=\"col-sm-1\"><button type=\"button\" class=\"btn btn-danger\" click.delegate=\"contact.phoneNumbers.splice($index, 1)\"><i class=\"fa fa-times\"></i></button></div></div><div class=\"form-group\"><div class=\"col-sm-9 col-sm-offset-3\"><button type=\"button\" class=\"btn btn-default\" click.delegate=\"contact.addPhoneNumber()\"><i class=\"fa fa-plus-square-o\"></i> Add a phone number</button></div></div><hr><div class=\"form-group\" repeat.for=\"emailAddress of contact.emailAddresses\"><div class=\"col-sm-2 col-sm-offset-1\"><select value.bind=\"emailAddress.type & validate\" class=\"form-control\"><option value=\"Home\">Home</option><option value=\"Office\">Office</option><option value=\"Other\">Other</option></select></div><div class=\"col-sm-8\"><input type=\"email\" class=\"form-control\" placeholder=\"Email address\" value.bind=\"emailAddress.address & validate\"></div><div class=\"col-sm-1\"><button type=\"button\" class=\"btn btn-danger\" click.delegate=\"contact.emailAddresses.splice($index, 1)\"><i class=\"fa fa-times\"></i></button></div></div><div class=\"form-group\"><div class=\"col-sm-9 col-sm-offset-3\"><button type=\"button\" class=\"btn btn-primary\" click.delegate=\"contact.addEmailAddress()\"><i class=\"fa fa-plus-square-o\"></i> Add an email address</button></div></div><hr><div class=\"form-group\" repeat.for=\"address of contact.addresses\"><div class=\"col-sm-2 col-sm-offset-1\"><select value.bind=\"address.type\" class=\"form-control\"><option value=\"Home\">Home</option><option value=\"Office\">Office</option><option value=\"Other\">Other</option></select></div><div class=\"col-sm-8\"><div class=\"row\"><div class=\"col-sm-4\"><input type=\"text\" class=\"form-control\" placeholder=\"Number\" value.bind=\"address.number & validate\"></div><div class=\"col-sm-8\"><input type=\"text\" class=\"form-control\" placeholder=\"Street\" value.bind=\"address.street & validate\"></div></div><div class=\"row\"><div class=\"col-sm-4\"><input type=\"text\" class=\"form-control\" placeholder=\"Postal code\" value.bind=\"address.postalCode & validate\"></div><div class=\"col-sm-8\"><input type=\"text\" class=\"form-control\" placeholder=\"City\" value.bind=\"address.city & validate\"></div></div><div class=\"row\"><div class=\"col-sm-4\"><input type=\"text\" class=\"form-control\" placeholder=\"State\" value.bind=\"address.state\"></div><div class=\"col-sm-8\"><input type=\"text\" class=\"form-control\" placeholder=\"Country\" value.bind=\"address.country\"></div></div></div><div class=\"col-sm-1\"><button type=\"button\" class=\"btn btn-danger\" click.delegate=\"contact.addresses.splice($index, 1)\"><i class=\"fa fa-times\"></i></button></div></div><div class=\"form-group\"><div class=\"col-sm-9 col-sm-offset-3\"><button type=\"button\" class=\"btn btn-primary\" click.delegate=\"contact.addAddress()\"><i class=\"fa fa-plus-square-o\"></i> Add an address</button></div></div><hr><div class=\"form-group\" repeat.for=\"profile of contact.socialProfiles\"><div class=\"col-sm-2 col-sm-offset-1\"><select value.bind=\"profile.type\" class=\"form-control\"><option value=\"GitHub\">GitHub</option><option value=\"Twitter\">Twitter</option></select></div><div class=\"col-sm-8\"><input type=\"text\" class=\"form-control\" placeholder=\"Username\" value.bind=\"profile.username\"></div><div class=\"col-sm-1\"><button type=\"button\" class=\"btn btn-danger\" click.delegate=\"contact.socialProfiles.splice($index, 1)\"><i class=\"fa fa-times\"></i></button></div></div><div class=\"form-group\"><div class=\"col-sm-9 col-sm-offset-3\"><button type=\"button\" class=\"btn btn-primary\" click.delegate=\"contact.addSocialProfile()\"><i class=\"fa fa-plus-square-o\"></i> Add a social profile</button></div></div><div class=\"form-group\"><div class=\"col-sm-9 col-sm-offset-3\"><button type=\"submit\" class=\"btn btn-success\">Save</button> <a if.bind=\"isNew\" class=\"btn btn-danger\" route-href=\"route: contacts\">Cancel</a> <a if.bind=\"!isNew\" class=\"btn btn-danger\" route-href=\"route: contact-details;  \n    \t\t\tparams.bind: { id: contact.id }\">Cancel</a></div></div></form></section></template>"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>Contacts</h1><div class=\"row\"><div class=\"col-sm-1\"><a route-href=\"route: contact-creation\" class=\"btn btn-primary\"><i class=\"fa fa-plus-square-o\"></i> New</a></div><div class=\"col-sm-2\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" placeholder=\"Filter\" value.bind=\"filter & debounce\"> <span class=\"input-group-btn\" if.bind=\"filter\"><button class=\"btn btn-default\" type=\"button\" click.delegate=\"filter = ''\"><i class=\"fa fa-times\"></i> <span class=\"sr-only\">Clear</span></button></span></div></div></div><div repeat.for=\"group of contacts \n                     | filterBy:filter:'firstName':'lastName':'company' \n                     | groupBy:'firstLetter'  \n                     | orderBy:'key'\" class=\"panel panel-default\"><div class=\"panel-heading\">${group.key}</div><ul class=\"list-group\"><li repeat.for=\"contact of group.items|orderBy:'fullName'\" class=\"list-group-item\"><a route-href=\"route: contact-details;  \n                         params.bind: { id: contact.id }\"><span if.bind=\"contact.isPerson\">${contact.firstName} <strong>${contact.lastName}</strong> </span><span if.bind=\"!contact.isPerson\"><strong>${contact.company}</strong></span></a></li></ul></div></section></template>"; });
define('text!contact-photo.html', ['module'], function(module) { module.exports = "<template><section class=\"container\"><h1>${contact.fullName}</h1><form class=\"form-horizontal\" submit.delegate=\"save()\"><div class=\"form-group\"><label class=\"col-sm-3 control-label\" for=\"photo\">Photo</label><div class=\"col-sm-9\"><input type=\"file\" id=\"photo\" accept=\"image/*\" files.bind=\"photo\"></div></div><div class=\"form-group\"><div class=\"col-sm-9 col-sm-offset-3\"><button type=\"submit\" class=\"btn btn-success\">Save</button> <a class=\"btn btn-danger\" route-href=\"route: contact-details;  \n             params.bind: { id: contact.id }\">Cancel</a></div></div></form></section></template>"; });
define('text!not-found.html', ['module'], function(module) { module.exports = "<template><h1>Something is broken...</h1><p>The page cannot be found.</p></template>"; });
//# sourceMappingURL=app-bundle.js.map