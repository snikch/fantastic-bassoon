var endpoint = '/editor/ajax/';
var Appy = {};

window.EVT = new EventEmitter2();
window.ParsleyConfig = {
  excluded:
    'input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled], :hidden, [data-parsley-disabled], [data-parsley-disabled] *',
};

jQuery(function() {
  if (Appy._config._debug) {
    $(window).on('error', function(e) {
      var stack = e.originalEvent.error.stack;
      var message = e.originalEvent.error.toString();
      if (stack) {
        message += '\n' + stack;
      }
      console.log('Error stack: ', message);
    });
  }
  window.EVT.emit('init');
  if ($.fn.datepicker != null && $.fn.datepicker.defaults != null) $.fn.datepicker.defaults.format = 'M d yyyy';
  // smooth scroll doesn't work on pages with 100% height and overflow hidden
  // https://bugs.chromium.org/p/chromium/issues/detail?id=633573
  if (typeof smoothScroll != 'undefined') {
    smoothScroll.init({
      selector: 'a[href*="#"]:not([href="#"]):not([href*="#tab-"]):not([data-type="tab"])',
      selectorHeader: '#header-navbar', // selector for fixed headers, will offset by height of element
      speed: 500, // How fast in ms
      easing: 'easeInOutCubic',
      offset: 20,
    });
  }
});

Appy._config = {
  _debug: false,
  Messages: {
    confirm: {
      existingGroup: false,
    },
  },
  Guests: {
    datatableId: '#tbl-guests-list',
  },
  RSVP: {
    datatableId: '#tbl-rsvp',
  },
};

Appy.Styles = {
  Colors: {
    gold: '#B2A584',
    pink: '#f92e74',
  },
};

Appy.Messages = {
  notice: {
    readOnly: 'Read Only',
    noName: '(no name set)',
    on: 'on',
    off: 'off',
    public: 'public',
    private: 'private',
    dropzoneOverlay: 'Drag image here or just click.',
    uploadingPhotos: 'Uploading your photos',
    deletingPhoto: 'Removing photo',
    dropHere: 'Drag your photos here (or just click!)',
    loading: 'Loading',
    saving: 'Saving...',
    savingExt: 'Saving your data to the server...',
    complete: 'Complete!',
    completeExt: 'Save successful!',
    failed: 'Uh oh',
    failedExt: "Something went wrong. We're very sorry! Please reload the page and try again.",
    confirmDelete: 'Are you sure you wish to delete this item?',
    confirmPersonDelete: 'Are you sure you wish to delete this person?',
    pleaseNote: 'Please Note',
    guestCategorySelect:
      "Guest(s) will be added to the selected category below. You can go edit each person's details once they've been added. Don't forget to SAVE.",
    fbCategorySelect:
      "This app does not post to Facebook and your friends will not be notified. Friend(s) will be added to the selected category below. You can go edit each person's details once they've been added. Don't forget to SAVE.",
    registryMsg:
      'Add a direct link to your registry. P.S: make sure you are not logged in as an admin to your registry site when you copy the link.',
    registrySetup1: "Don't have a registry here? Set one up.",
    registrySetup2: "Don't forget to add your link when you're done.",
  },
  confirm: {
    existingGroup: 'Creating this group will overwrite any existing groups assigned for these guests.',
    ungroupAll: 'Are you sure you wish to remove all groups? (does not remove any guests)',
    closeUnsavedModal: 'Are you sure you wish to close the form and lose any changes you have made?',
    closeForm: 'Yes, close this form',
    delete: 'Yes, delete',
    deletePerson: 'Yes, delete this person',
    deleteCategory: 'Yes, delete this category',
    deleteStory: 'Yes, delete this story',
    deletePic: 'Yes, delete this picture',
    deleteVideo: 'Yes, delete this video',
    closeWindow: 'Yes, close the window',
    cancel: 'No, on second thought..',
    rsvpReminder:
      "Guests who have not RSVP'd will automatically notified of the approaching deadline to submit their RSVPs." +
      '<p>Reminders are sent both one-week and one-day ahead of the deadline.</p>' +
      '<p>Guests may still login and RSVP for the first time or change their RSVP responses after this date has passed, however you will be notified of each change.</p>' +
      '<p>Who gets this? Guests marked in your guest list to access the event will be sent the reminder notification.</p>',
    updateSubdomain: 'Yes, update my subdomain',
    updateCode: 'Yes, update my wedding code',
  },
  headers: {
    eventsPrivate: 'Private Events',
    eventsPublic: 'Public Events',
    rsvpQuestions: 'RSVP Responses for ',
    createPerson: 'Create a new key person',
    existingGuest: 'Or pick an existing guest',
    areSure: 'Are you sure?',
    updateSubdomain:
      'Do you want to update your subdomain? <p>If you have already sent out invitations containing this website address, we recommend you do not update your subdomain.</p>',
    updateCode: 'Do you want to update your wedding code?',
  },
  titles: {
    groupModal: 'Grouping Guests',
    tagModal: 'Edit tags',
    eventsModal: 'Event Access',
    editCategory: 'Edit Group',
    newCategory: 'New Group',
    newWidget: 'New Widget',
    galleryTitle: 'Add Photos',
    addStory: 'Add Story',
    newEvent: 'New Event',
    editEvent: 'Edit Event',
    editWidget: 'Edit Widget',
    editStory: 'Edit Story',
    editPerson: 'Key People',
    newPerson: 'Key People',
    editKeyGroup: 'Editing Category',
    editPic: 'Edit Pic',
    edit: 'Edit',
    add: 'New',
    mainTitle: 'Edit Section',
    yourApp: 'Your App',
    editRegistry: 'Edit Registry',
    editTravel: 'Edit Travel',
  },
  tabs: {
    addFBFriends: 'Add Friends',
    useGuestList: 'Add From Guest List',
    newKeyPerson: 'New Key Person',
    editKeyPerson: 'Update Key Person',
    eventTab: 'Event',
    eventRsvpTab: 'RSVP settings and questions',
    eventAdvancedTab: 'Advanced Settings',
  },
  options: {
    first: 'First',
    last: 'Last',
  },
  buttons: {
    group: 'Update Group',
    ungroup: 'Ungroup Guests',
    eventsSubmit: 'Save',
    rsvpEditLabel: 'Edit',
    rsvpSaveLabel: 'Save',
    submit: 'Save',
    upload: 'Upload',
    replace: 'Replace',
    fbAdd: 'Connect to Facebook',
    close: 'Close',
    delete: 'Delete',
    createRegistry: 'Create Registry',
    viewRegistry: 'View Registry',
  },
  labels: {
    colorPicker: 'Pick a color',
    storyTitle: 'Add a (short) title here',
    title: 'Title',
    image: 'Picture',
    body: 'Text',
    order: 'Order',
    position: 'Position',
    link: 'Website link',
    linkName: 'Name Link',
    name: 'Name',
    prefix: 'Prefix',
    firstName: 'First name',
    lastName: 'Last name',
    addToGuestList: 'Include as a new guest in your guest list?',
    editKeyPersonGroup: 'Category',
    editKeyPersonGroupName: 'Name',
    newKeyPersonGroupName: 'Name',
    addGuestToCategory: 'Category',
    addFriendToCategory: 'Category',
    addPersonToCategory: 'Category',
    confirmGuestDelete: 'Also remove key person from guest list?',
    confirmRsvpNotice: 'Yes, this is OK',
    storeTitle: 'Store Name',
    registryLink: 'Your Registry Link',
  },
  placeholders: {
    storyBody: $('body').hasClass('is-appylife')
      ? 'Add your story text here. You can add as many stories as you need.'
      : "Add your story text here. It's a great way to introduce the two of you. Think of these as 'mini chapters' that string together to paint a bigger picture. You can add as many stories as you need. Some topics to get you started: When we first met, I knew he/she was the one when...",
    personTitle: 'Give your key person a headline',
    personBody: 'Introduction text',
    pickPeople: 'Click to select guest(s) from your guest list to add to this section.',
    galleryBody: 'Caption',
    guestbookBody: 'Write your message here',
    eventName: 'Enter your event name here',
    text: 'Enter text here',
    icon: 'Pick an icon',
    widgetType: 'Widget type',
    welcomeBody: 'Add a welcome note for your guests.',
  },
  US: {
    states: [
      {
        label: 'Alabama',
        value: 'AL',
      },
      {
        label: 'Alaska',
        value: 'AK',
      },
      {
        label: 'American Samoa',
        value: 'AS',
      },
      {
        label: 'Arizona',
        value: 'AZ',
      },
      {
        label: 'Arkansas',
        value: 'AR',
      },
      {
        label: 'California',
        value: 'CA',
      },
      {
        label: 'Colorado',
        value: 'CO',
      },
      {
        label: 'Connecticut',
        value: 'CT',
      },
      {
        label: 'Delaware',
        value: 'DE',
      },
      {
        label: 'District Of Columbia',
        value: 'DC',
      },
      {
        label: 'Federated States Of Micronesia',
        value: 'FM',
      },
      {
        label: 'Florida',
        value: 'FL',
      },
      {
        label: 'Georgia',
        value: 'GA',
      },
      {
        label: 'Guam',
        value: 'GU',
      },
      {
        label: 'Hawaii',
        value: 'HI',
      },
      {
        label: 'Idaho',
        value: 'ID',
      },
      {
        label: 'Illinois',
        value: 'IL',
      },
      {
        label: 'Indiana',
        value: 'IN',
      },
      {
        label: 'Iowa',
        value: 'IA',
      },
      {
        label: 'Kansas',
        value: 'KS',
      },
      {
        label: 'Kentucky',
        value: 'KY',
      },
      {
        label: 'Louisiana',
        value: 'LA',
      },
      {
        label: 'Maine',
        value: 'ME',
      },
      {
        label: 'Marshall Islands',
        value: 'MH',
      },
      {
        label: 'Maryland',
        value: 'MD',
      },
      {
        label: 'Massachusetts',
        value: 'MA',
      },
      {
        label: 'Michigan',
        value: 'MI',
      },
      {
        label: 'Minnesota',
        value: 'MN',
      },
      {
        label: 'Mississippi',
        value: 'MS',
      },
      {
        label: 'Missouri',
        value: 'MO',
      },
      {
        label: 'Montana',
        value: 'MT',
      },
      {
        label: 'Nebraska',
        value: 'NE',
      },
      {
        label: 'Nevada',
        value: 'NV',
      },
      {
        label: 'New Hampshire',
        value: 'NH',
      },
      {
        label: 'New Jersey',
        value: 'NJ',
      },
      {
        label: 'New Mexico',
        value: 'NM',
      },
      {
        label: 'New York',
        value: 'NY',
      },
      {
        label: 'North Carolina',
        value: 'NC',
      },
      {
        label: 'North Dakota',
        value: 'ND',
      },
      {
        label: 'Northern Mariana Islands',
        value: 'MP',
      },
      {
        label: 'Ohio',
        value: 'OH',
      },
      {
        label: 'Oklahoma',
        value: 'OK',
      },
      {
        label: 'Oregon',
        value: 'OR',
      },
      {
        label: 'Palau',
        value: 'PW',
      },
      {
        label: 'Pennsylvania',
        value: 'PA',
      },
      {
        label: 'Puerto Rico',
        value: 'PR',
      },
      {
        label: 'Rhode Island',
        value: 'RI',
      },
      {
        label: 'South Carolina',
        value: 'SC',
      },
      {
        label: 'South Dakota',
        value: 'SD',
      },
      {
        label: 'Tennessee',
        value: 'TN',
      },
      {
        label: 'Texas',
        value: 'TX',
      },
      {
        label: 'Utah',
        value: 'UT',
      },
      {
        label: 'Vermont',
        value: 'VT',
      },
      {
        label: 'Virgin Islands',
        value: 'VI',
      },
      {
        label: 'Virginia',
        value: 'VA',
      },
      {
        label: 'Washington',
        value: 'WA',
      },
      {
        label: 'West Virginia',
        value: 'WV',
      },
      {
        label: 'Wisconsin',
        value: 'WI',
      },
      {
        label: 'Wyoming',
        value: 'WY',
      },
    ],
  },
  // common english words
  generic: {
    for: 'for',
  },
  validators: {
    maxlength: {
      preText: 'You typed ',
      postText: ' chars available.',
      separator: ' out of ',
    },
  },
  // screen reader specific
  sr: {
    addOneBtn: 'Add one',
    removeOneBtn: 'Remove one',
    eventsBtn: ' events for this guest',
  },
};

/* render templates using DustJS or just manual content insertion w/o template */
var render = function(template, container, data, target) {
  return new Promise(function(resolve, reject) {
    // target is only used to override the dust rendering and include content directly
    // this is needed for Datatables to display the main form.
    if (target != null) {
      container.html($('#content-' + target).html());
      return resolve();
    }
    dust.render(template, data, function(err, out) {
      if (err !== null) {
        reject(err);
      }
      container.html(out);
    });
    resolve();
  });
};

Appy.Modal = function() {
  this.id = '#appy-modal';
  //$.fn.modal.prototype.constructor.Constructor.DEFAULTS.backdrop = 'static';
};
Appy.Modal.prototype.open = function(id, data, container, dust) {
  if (Appy.Editor) {
    Appy.Editor.disable();
  }
  if (Appy.DT) {
    Appy.DT.select.blurable(false);
    Appy.DT.keys.disable();
  }
  if (dust == null) dust = true; // use dustjs by default
  if (container == null) {
    this.container = $('#appy-modal');
  } else {
    this.container = $(container);
  }
  var that = this;
  return new Promise(function(resolve) {
    if (dust && typeof render != 'undefined') render(id, that.container, data); //.then(function() {
    $(that.container)
      .find('.modal')
      .modal('show');
    resolve(that.id);
  });
};
Appy.Modal.prototype.close = function() {
  var that = this;
  if (Appy.Editor) {
    Appy.Editor.enable();
  }
  if (Appy.DT) {
    Appy.DT.select.blurable(true);
    Appy.DT.keys.enable();
  }
  return new Promise(function(resolve) {
    $(that.id)
      .find('.modal')
      .modal('hide');
    resolve();
  });
};
Appy.modal = new Appy.Modal();
$(Appy.modal.id).on('hidden.bs.modal', function() {
  Appy.modal.close(); // close() on cancel
});

Appy.createOverlay = function(el, name, save) {
  /* show overlay first time */
  var o = Cookies.get(name) == 'true' || false;
  el.find('.overlay-close').on('click', function() {
    if (save !== false) Cookies.set(name, true);
    el.hide();
    $('body.main, main#main-container').css('overflow', 'auto');
  });
  if (!o || save === false) {
    el.removeClass('hidden').show();
    if (save !== false) Cookies.set(name, true);
  }
  return Promise.resolve(el);
};

// on forms create a swap of region/state field based on country selected
function bindCountryChange($country, $state, $stateLabel, $region, $regionLabel, skip_hide) {
  if (!skip_hide) {
    $region.hide();
    if ($regionLabel != null) $regionLabel.hide();
    $region.attr('data-parsley', true);
  }
  $country.on('change', function() {
    if ($region.hasClass('hidden')) {
      $region.removeClass('hidden');
      if ($regionLabel != null) $regionLabel.removeClass('hidden');
    }

    if ($(this).val() == 'US') {
      $region.hide();
      if ($regionLabel != null) $regionLabel.hide();
      $region.attr('data-parsley', true);
      $state.show().removeClass('hidden');
      if ($stateLabel != null) $stateLabel.show().removeClass('hidden');
      $state.attr('data-parsley', false);
    } else {
      $state.hide();
      if ($stateLabel != null) $stateLabel.hide();
      $state.attr('data-parsley', true);
      $region.show().removeClass('hidden');
      if ($regionLabel != null) $regionLabel.show().removeClass('hidden');
      $region.attr('data-parsley', false);
    }
  });
}

function byteLength(str) {
  // returns the byte length of an utf8 string
  var s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
  }
  return s;
}

//https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// decode html entities
function decodeHtml(html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}
