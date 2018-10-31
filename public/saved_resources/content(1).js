Appy.Content._data = {};
Appy.Content.content = {};
Appy.Content.editor = {};
Appy.Content.editor.open = function(modal, cb) {
    var self = this;
    return Appy.modal.open(modal, this.opts).then(function () {
        $(Appy.Content.modalFormId).on('submit', function() {
            $(this).data('submit',true);
        });
        $(Appy.Content.modalFormId).find(':input').on('change keypress', function() {
            $(this).closest('form').data('changed', true);
        });
        $(Appy.Content.modalFormId).on('summernote.keyup', function() {
            $(this).closest('form').data('changed', true);
        });
        // $(this).on('hide.bs.modal', function(e) {
        //     if (e.namespace != 'bs.modal') return; // only bootstrap modal hide()
        //     // check if the form is saved
        //     var self = this;
        //     if ($(Appy.Content.modalFormId).data('changed') && !($(Appy.Content.modalFormId).data('submit')) ) {
        //         swal({
        //             title: Appy.Messages.headers.areSure,
        //             text: Appy.Messages.confirm.closeUnsavedModal,
        //             type: "warning",
        //             showCancelButton: true,
        //             confirmButtonColor: Appy.Styles.Colors.pink,
        //             confirmButtonText: Appy.Messages.confirm.closeWindow,
        //             cancelButtonText: Appy.Messages.confirm.cancel,
        //         }).then(
        //             function(result) {
        //                 // handle Confirm button click
        //                 // result is an optional parameter, needed for modals with input
        //                 $(Appy.Content.modalFormId).data('changed', false);
        //                 $(e.target).modal('hide');
        //             }, function(dismiss) {
        //                 // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        //                 Appy.Content.editor.opts = {};
        //             }
        //         );
        //         e.preventDefault();
        //         e.stopImmediatePropagation();
        //         return false;
        //     }
        // });

        // if using material forms, make sure fields are "open" when they have values.
        $('.form-material.floating > .form-control').each(function(){
            var $input  = $(this);
            var $parent = $input.parent('.form-material');

            if ($input.val()) {
                $parent.addClass('open');
            }
            $input.on('change', function(){
                if ($input.val()) {
                    $parent.addClass('open');
                } else {
                    $parent.removeClass('open');
                }
            });
        });

        // $('.js-maxlength').each(function(){
        //     var $input = jQuery(this);
        //     $input.maxlength({
        //         alwaysShow: $input.data('always-show') ? true : false,
        //         threshold: $input.data('threshold') ? $input.data('threshold') : 10,
        //         warningClass: $input.data('warning-class') ? $input.data('warning-class') : 'label label-warning',
        //         limitReachedClass: $input.data('limit-reached-class') ? $input.data('limit-reached-class') : 'label label-danger',
        //         placement: $input.data('placement') ? $input.data('placement') : 'bottom',
        //         preText: $input.data('pre-text') ? $input.data('pre-text') : '',
        //         separator: $input.data('separator') ? $input.data('separator') : '/',
        //         postText: $input.data('post-text') ? $input.data('post-text') : ''
        //     });
        // });

        jQuery('.js-datetimepicker input[type="text"], .js-datetimepicker .datetimepicker').each(function(){
            var $input = jQuery(this);
            var opts = {
                "singleDatePicker": $input.data('single'),
                "timePicker": $input.data('time') != null ? ($input.data('time') == 'true') : true,
                "autoApply": true,
                autoUpdateInput: false,
                "locale": {
                    "format": $input.data('format') || 'YYYY/MM/DD', // HH:MM
                    "separator": " - ",
                    "applyLabel": "Apply",
                    "cancelLabel": "Cancel",
                    "fromLabel": "From",
                    "toLabel": "To",
                    "customRangeLabel": "Custom",
                    "weekLabel": "W",
                    "daysOfWeek": [
                        "Su",
                        "Mo",
                        "Tu",
                        "We",
                        "Th",
                        "Fr",
                        "Sa"
                    ],
                    "monthNames": [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ],
                    "firstDay": 1
                },
                "alwaysShowCalendars": true
            };
            var startDate = $input.data('start-date');
            var endDate = $input.data('end-date');
            moment.tz.setDefault('UTC');
            if (($input.data('start-date') == null) || $input.data('start-date') < 1) {
                startDate = moment().format('YYYY/MM/DD'); // now() in momentjs
            } else {
                startDate = moment.unix(startDate);
                $input.val(startDate.format($input.data('format')));
            }
            opts.startDate = startDate;

            if (($input.data('end-date') != null) && $input.data('end-date') > 0) {
                endDate = $input.data('end-date');
            } else {
                if (!$input.data('single')) {
                    endDate = startDate;
                } else {
                    endDate = moment.unix(endDate);
                }
            }
            opts.endDate = endDate;

            $input.on('apply.daterangepicker', function(e, o) {
                $(this).val(o.startDate.format($input.data('format')));
            });
            $input.daterangepicker(opts, function(start, end, label) {
                console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
            });


        });

        // bind any available photoCrop widgets
        // photoCrop(null, function(container) {
        //     $('.profile-photo-placeholder').show();
        // }, function(data) {
        //     //self.setProperty('profile_photo', data);
        //     console.log(data);
        // });

        // jQuery(document).ready(function() {
        //     $('.slider-test').slider();
        // });



        // $('.photo-crop-widget').circlecrop({
        //     photo_data: {
        //         filename: 'https://appycoupleusphotos.s3.amazonaws.com/image_94722_1480640881_16.jpg'
        //     }
        //     , data: {
        //         width: 1101
        //         , top: '-999px'
        //         , left: '-473px'
        //     }
        //     , mask_url: '//www.appycouple.com/sites/all/modules/weddingapp/jquery-modules/circlecrop/images/mask.png'
        // })
        // $('.js-croppie').each(function __each__() {
        //     var $croppie = $(this);
        //     $croppie.croppie({
        //         url: $croppie.data('url')
        //         ,enableExif: true
        //         ,viewport: {
        //             width: 260
        //             ,height: 260
        //             ,type: 'circle'
        //         }
        //         ,boundary: {
        //             width: 260
        //             ,height: 260
        //         }
        //     });
        //     $croppie.on('update', function(e, i) {
        //         $('#croppie-results').prepend('<div>' +
        //             'topLeftX: '+i.points[0]+ ', topLeftY: '+ i.points[1] + ', bottomRightX: ' + i.points[2] + ', bottomRightY: ' + i.points[3] + ', zoom: '+i.zoom+'</div>');
        //
        //         console.log($croppie, i);
        //     });
        // });

        if (cb != null && typeof cb === 'function') cb.call(self);
    });
};
// compile a list of guests
Appy.Content.guests = {};
Appy.Content.mentions = [];
if (
    (typeof eventData != 'undefined')
    && eventData.groups != null
) {
    for (var group in eventData.groups) {
        if (eventData.groups[group].guests == null) continue;
        for (var i = 0; i < eventData.groups[group].guests.length; i++ ) {
            var guest = eventData.groups[group].guests[i];
            guest.group = {};
            if ( (guest.guests != null) && (Array.isArray(guest.guests)) && guest.guests.length > 0) {
                guest.group.id = guest.guests[0].group_id;
            }
            Appy.Content.guests[guest.guest_id] = guest;
            Appy.Content.mentions.push(guest.name_first + ' ' + guest.name_last);
        }
    }
}

// sort the guest list by last name
var guestVals = [];
for (var prop in Appy.Content.guests) {
    if( Appy.Content.guests.hasOwnProperty( prop ) ) {
        guestVals.push(Appy.Content.guests[prop]);
    }
}
Appy.Content.guests = guestVals.sort(function(a,b) {
    if ( (a.name_last == null) || (b.name_last == null) ) return 0;
    return (a.name_last > b.name_last) ? 1 : ((b.name_last > a.name_last) ? -1 : 0);
});

Appy.Content.hideToolbars = function() {
    jQuery('.tool-items, .tool-container .arrow').hide();
}
Appy.Content.showToolbars = function() {
    jQuery('.tool-items, .tool-container .arrow').show();
}

// safari can't handle object.values
// Appy.Content.guests = Object.values(Appy.Content.guests).sort(function(a,b) {
//     if ( (a.name_last == null) || (b.name_last == null) ) return 0;
//     return (a.name_last > b.name_last) ? 1 : ((b.name_last > a.name_last) ? -1 : 0);
// });

Appy.Content.editor.summerOpts = {
    dialogsInBody: true
    ,disableDragAndDrop: true
    ,minHeight: 600
    , toolbar: [
        ['style', ['bold', 'italic', 'underline','link']]
        ,['insert', []]
    ]
    ,cleaner: {
        notTime: 0, // Time to display Notifications.
        action: 'paste', // both|button|paste 'button' only cleans via toolbar button, 'paste' only clean when pasting content, both does both options.
        newline: '<br>', // Summernote's default is to use '<p><br></p>'
        notStyle: 'position:absolute;top:0;left:0;right:0', // Position of Notification
        //icon: '<i class="note-icon">[Your Button]</i>',
        keepHtml: false, // Remove all Html formats
        keepClasses: false, // Remove Classes
        badTags: ['style', 'script', 'applet', 'embed', 'noframes', 'noscript', 'html'], // Remove full tags with contents
        badAttributes: ['style', 'start'] // Remove attributes from remaining tags
    }
    ,hint: [
        {
            mentions: Appy.Content.mentions
            ,match: /\B@(\w*)$/
            ,search: function (keyword, callback) {
            callback($.grep(this.mentions, function (item) {
                return item.indexOf(keyword) == 0;
            }));
        }
            ,content: function (item) {
            return '@' + item;
        }
        }
        ,{
            match: /:([\-+\w]+)$/,
            search: function (keyword, callback) {
                callback($.grep(Object.keys(emojis), function (item) {
                    return item.indexOf(keyword) === 0;
                }));
            },
            template: function (item) {
                var content = emojis[item];
                return '<img src="' + content + '" width="20" /> :' + item + ':';
            },
            content: function (item) {
                var url = emojis[item];
                if (url) {
                    return $('<img />').attr('src', url).css('width', 20)[0];
                }
                return '';
            }
        }
    ]
};

/* load up raleyway for btns, titles, etc) */
if (typeof WebFont != 'undefined') {
    WebFont.load({
        google: {
            families: ['Raleway:600']
        }
    });
}

// bind some global events
jQuery(document).ready(function() {
    $('#preview-app').on('click', function(e) {
        e.preventDefault();
        Appy.Content.editor.opts = {
            title: Appy.Messages.titles.yourApp
            ,submit: Appy.Messages.buttons.close
            ,code: code
        };
        if ($('body.is-appylife').length) {
            Appy.Content.editor.open('appylife.editor.app-preview-modal');
        }
        else {
            Appy.Content.editor.open('appy.editor.app-preview-modal');
        }
    });

    $(document).on('click', '[data-toggle="tabs"] a, .js-tabs a', function(e){
        e.preventDefault();
        $(this).tab('show');
    });

    $('#edit-toggle').on('click', function() {
        if (Appy.Content.mode.isLocked()) {
            console.log('unlocked');
            Appy.Content.mode.run('unlock');
        } else {
            console.log('locked');
            Appy.Content.mode.run('lock');
        }
    });

});





function guestList() {
    var guests = Object.extend(Appy.Content.guests);
    var trimGuests = [];
    guests.forEach(function(guest) {
        var name = (guest.name_first || '') + ' ' + (guest.name_last || '');
        if (name.trim().length < 1) {
            name = Appy.Messages.notice.noName;
        }
        trimGuests.push({
            guest_id: guest.guest_id
            ,name: name
            ,email: guest.email
        });
    },this);
    return trimGuests;
}

function selectizeNumUpdate($selectize, onAdd, onRemove) {
    if ($selectize[0] != null) {
        var selectize = $selectize[0].selectize; // get the instance
        if (selectize) {
            selectize.on('item_add', function(v, item) {
                onAdd(this.items.length);
            });
            selectize.on('item_remove', function(v, item) {
                onRemove(this.items.length);
            });
        }
    }
}
