var appyGallery = (function galleryModule() {
    'use strict';
    var editor = Appy.Content.editor;
    var imgs = [];
    var hasInit = false;
    var content = Object.create(Appy.Content);
    function getCookieValue(a) {
        var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }
    function deleteCookie (name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    function init() {
        if (hasInit) return;
        hasInit = true;
        var alAddPage = getCookieValue('al-add-gallery');

        if (alAddPage === '1') {
            newPic();
            deleteCookie('al-add-gallery');
        }

        $(document).on('click', '.modal-gallery-add-submit', function () {
            $(document).one('submit', Appy.Content.modalFormId, function (e) {
                e.preventDefault();
                savePic().then(function(data) {
                });
            });
            $(Appy.Content.modalFormId).submit();
        });
        $(document).on('click', '#add-gallery-photos', function (e) {
            e.preventDefault();
            var aClicked = $(this);
            if (aClicked.data('isUser') === 1) {
                newPic();
            } else {
                // redirect user
                var expires = new Date();
                expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
                document.cookie = 'al-add-gallery=1;expires=' + expires.toUTCString();
                console.log('redirecting', this.href)
                window.location.href = this.href;
            }
        });

        $(document).on('click', '.gallery-tool-item, .delete-pic-btn', deletePic);
        $(document).find('.gallery-img').each(function () {
            if ($(this).data('editable') != 1) return;
            $(this).toolbar({
                content: '#toolbar-options-'+$(this).data('key')
                , position: 'right'
            });
        });

        editor.summerEl = '.js-summernote';
        editor.opts = {
            submit: Appy.Messages.buttons.submit
            , title: Appy.Messages.titles.galleryTitle
            , bodyPlaceholder: Appy.Messages.placeholders.galleryBody
        };
        editor.summerOpts = jQuery.extend(true, {}, editor.summerOpts, {
            placeholder: Appy.Messages.placeholders.galleryBody
            , height: 80
            , minHeight: 50
            , maxHeight: 100
            , toolbar: [
                ['style', []]
            ]
        });
        editor.opened = function () {
            $(Appy.Content.modalFormId).find(this.summerEl).each(function () {
                editor.summerOpts.toolbar = [
                    ['style', []]
                ];
                console.log('opts: ',editor.summerOpts);
                $(this).summernote(
                    editor.summerOpts
                );
                $(this).summernote('code', editor.summerOpts.code);
            });
        };
    }
    function deletePic(e) {
        e.preventDefault();
        e.stopPropagation();
        var type = $(this).data('type');
        var id = $(this).data('key');
        if (type === 'edit') {
            gallery.editPic(id);
        } else if (type === 'new') {
            //gallery.newPic();
            appyGallery.newPic();
        } else if (type === 'delete') {
            // run ajax delete
            swal({
                title: Appy.Messages.headers.areSure
                , text: Appy.Messages.notice.confirmDelete
                , type: "warning"
                , showCancelButton: true
                , confirmButtonColor: Appy.Styles.Colors.pink
                , confirmButtonText: Appy.Messages.confirm.deletePic
                , cancelButtonText: Appy.Messages.confirm.cancel
            }).then(
                function (result) {
                    // handle Confirm button click
                    // result is an optional parameter, needed for modals with input
                    swal.close();
                    content.save({
                        action: 'delete_gallery_pic'
                        , id: id
                        , se_id: eventData.section_id
                        , endpoint: eventData.endpointContent
                    });
                }, function (dismiss) {
                    // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
                }
            );
        }
        return false;
    }
    function savePic() {
        // add captions
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].caption = $(Appy.Content.modalFormId).find('#body_'+i).val(); //$($(self.modalFormId).find('#body_'+i).val()).text(); // strip html from comments
        }
        return content.save({
            action: 'new_gallery_pic'
            ,section_id: eventData.section_id
            ,imgs: imgs
            ,endpoint: eventData.endpointContent
        }).then(function(data) {
            // add error checking
            // reset imgs array for another upload
            imgs = [];
            return Promise.resolve(data);
        });
    }
    function newPic() {
        var self = this;
        var opts = Appy.Content.uploader.picker_options;
        opts.multiple = true;
        opts.maxSize = 6 * 1024 * 1024; // 6MB
        opts.imageQuality = 90;
        //opts.imageDim = [1200, null];

        // animation stuff
        $(this).closest('.modal-img-container').find('img, button').hide();
        var loading = $(this).closest('.modal-img-container').siblings('.modal-img-loading');
        loading.show();

        Appy.Content.uploader.pickAndStore(opts, {location: 'S3'},
            function (blob) {
                console.log("Conversion in progress...");
                var blobs = Object.values(blob);
                return new Promise(function (resolve, reject) {
                    var total = blobs.length;
                    var currentCount = 0;
                    swal({
                        title: 'Converting your images...'
                        , showConfirmButton: false
                        , html: '<i class="fa fa-4x fa-spinner fa-spin" aria-hidden="true"></i><br><br><span id="conversion-image-status"></span>'
                    });
                    blobs.map(function (v) {
                        if (typeof v !== 'object') return;
                        filepicker.convert(
                            v
                            , {
                                width: 400,
                            }
                            , {
                                location: 'S3'
                            }
                            , function (convertedBlob) {
                                if (Appy._config._debug) console.log("Converted file url: ", convertedBlob.url);
                                imgs.push({
                                    url: v.url
                                    , img_sm: convertedBlob.url
                                    , size: v.size
                                    , filename: v.filename
                                    , type: v.mimetype
                                    , key: imgs.length
                                });
                                currentCount++;
                                $('#conversion-image-status').text('Processing : '+currentCount+' out of '+total);
                                if (imgs.length >= 10 || currentCount === total) {
                                    var skipReload = false;
                                    if (currentCount !== total) {
                                        skipReload = true;
                                    }

                                    content.save({
                                        action: 'new_gallery_pic',
                                        section_id: eventData.section_id,
                                        imgs: imgs,
                                        endpoint: eventData.endpointContent
                                    },null,null,skipReload).then(function(data) {
                                        // add error checking
                                        // reset imgs array for another upload
                                        

                                    });
                                    imgs = [];
                                }
                                if (currentCount === total) { // after we convert all imgs, resolve the promise
                                    resolve();
                                }

                            }
                            , function (err) {
                                console.error(err);
                                reject(err);
                            }
                        );
                    });
                }).then(function () {
                    // we have the images, show a form to gather captions for each
                    swal.close();




                    // editor.opts.imgs = imgs;
                    // editor.opts.submitClass = 'modal-gallery-add-submit';
                    // editor.opts.Messages = Appy.Messages;
                    // editor.summerOpts = jQuery.extend(true, {}, editor.summerOpts, {
                    //     placeholder: Appy.Messages.placeholders.galleryBody
                    //     , height: 80
                    //     , minHeight: 50
                    //     , maxHeight: 100
                    //     , toolbar: [
                    //         ['style', []]
                    //     ]
                    // });
                    // editor.open('appy.wedsite-gallery-modal', editor.opened);
                });
            }
            , function (FPError) {
                loading.hide();
                $('.modal-img-container *').show();
                if (FPError.code == 101) return;
                console.error(FPError);
            }
            , function (FPProgress) {
                //console.log(FPProgress);
            }
        );
    }
    $( document ).ready(function() {
        init();
    });

    $('.grid').on("galleryGrid:packeryLoaded", function ( event ) {
        $(document).find('.gallery-img').each(function () {
            if ($(this).data('editable') != 1) return;
            $(this).toolbar({
                content: '#toolbar-options-'+$(this).data('key')
                , position: 'right'
            });
        });
    });

    var publicAPI = {
        newPic: newPic
        ,savePic: savePic
    };
    return publicAPI;
})();
