jQuery(document).ready(function() {
    // var content = document.getElementById("iframecontent").innerHTML;
    // var iframe = document.getElementById("theme-switcher");
    //
    // var frameDoc = iframe.document;
    // if (iframe.contentWindow)
    //     frameDoc = iframe.contentWindow.document;
    //
    // frameDoc.open();
    // frameDoc.writeln(content);
    // frameDoc.close();

   $('#theme-changer').on('change', function() {
       window.location.href = UpdateQueryString('theme_id', $(this).val(), window.location.href);
   });
});

function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}