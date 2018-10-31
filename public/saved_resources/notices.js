var appyNotices = Object.create(Object.prototype);

appyNotices.open = function(title, txt) {
    if (Appy.Messages.active !== undefined) toastr.remove();
    Appy.Messages.active = toastr["info"](
        '<div>'+txt+'</div>'
        , title);
}
appyNotices.close = function(title, txt, status) {
    var delay = 1000;
    if (Appy.Messages.active != null) {
        if (status == 'toast-error') delay = 5000;
        $(document).delay(1000).queue(function() {
            Appy.Messages.active.find(".toast-title").text(title);
            Appy.Messages.active.find(".toast-message").text(txt);
            Appy.Messages.active.removeClass('toast-info').addClass(status);
            Appy.Messages.active.delay(delay).queue(function(){
                toastr.clear();
                $(this).dequeue();
            });
            $(this).dequeue();
        });
    }
}
appyNotices.progress = function(title, txt) {
    toastr.preventDuplicates = true;
    toastr.showDuration = 0;
    toastr.hideDuration = 0;
    toastr.timeOut = 0;
    toastr.extendedTimeOut = 0;
    if (Appy.Messages.active !== undefined) toastr.remove();
    Appy.Messages.active = toastr["info"](
        '<div>'+txt+'</div>'
        , title);
}
