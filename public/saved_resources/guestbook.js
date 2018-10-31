var guestbookMngr = (function guestbookMngr() {
    'use strict';
    var guestbook = {};
    guestbook = Object.create(Appy.Content);
    var hasInit = false;

    function lock() {
        $('.guestbook-delete-btn').hide();
    }
    function unlock() {
        $('.guestbook-delete-btn').show();
    }
    function init() {
        if (hasInit) return;
        hasInit = true;
        guestbook.mode.register({lock: lock, unlock: unlock});
        $('#guestbook-post-btn').on('click', function(e) {
            e.preventDefault();
            var $img = $('#guestbook-pic');
            guestbook.save({
                body: $('#guestbook-note').val()
                ,action: 'guestbook_save'
                ,endpoint: eventData.endpointContent
                ,imgs: [{
                    img: $img.data('img'),
                    filename: $img.data('filename'),
                    size: $img.data('size'),
                    type: $img.data('type')
                }]
            }, 'wedding');
        });

        $('#guestbook-post-out-btn').on('click', function(e) {
            Cookies.set('guestbook-msg', $('#guestbook-note').val());
            console.log('setting cookie: ',Cookies.get('guestbook-msg'));
            return true;
        });

        $('#guestbook-photo, #guestbook-pic').on('click', function() {
            var uploader = Object.create(Appy.Upload);
            uploader.picker_options.cropRatio = 1;
            uploader.picker_options.multiple = false;
            uploader.pickAndStore(
                uploader.picker_options
                ,{location: 'S3'}
                ,function(blob){
                    // animation stuff
                    var $img = $('#guestbook-pic');
                    $img.parent().siblings('button').hide();
                    //loading.hide();
                    //data-img="'+item.url+'" data-img-sm="'+item.url_sm+'" data-filename="'+item.filename+'" data-size="'+item.size+'" data-type="'+item.mimetype+'"
                    $img.data('img', blob[0].url);
                    $img.data('filename', blob[0].filename);
                    $img.data('size', blob[0].size);
                    $img.data('type', blob[0].mimetype);
                    $img.attr('src',blob[0].url)
                        .removeClass('hidden')
                        .fadeIn('slow');

                }
                ,function(FPError){
                    //loading.hide();
                    if (FPError.code == 101) return;
                    if (Appy._config._debug) console.error(FPError);
                }
            );
        });
        $('.guestbook-delete-btn').on('click', function (e) {
            var key = $(this).data('key');
            var g = $(this).data('g');
            e.preventDefault();
            swal({
                title: Appy.Messages.headers.areSure
                , type: "warning"
                , showCancelButton: true
                , confirmButtonColor: Appy.Styles.Colors.pink
                , confirmButtonText: Appy.Messages.confirm.delete
                , cancelButtonText: Appy.Messages.confirm.cancel
                , html: '<p>' + Appy.Messages.notice.confirmDelete + '</p>'
            }).then(
                function (result) {
                    // handle Confirm button click
                    // result is an optional parameter, needed for modals with input
                    guestbook.save({
                        id: key
                        ,g: g
                        ,action: 'guestbook_delete'
                        ,endpoint: eventData.endpointContent
                    }, 'wedding');
                }, function (dismiss) {
                    // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
                }
            );

        }).show();
    }
    window.EVT.on('init', init);
})();

