Appy.Upload = Object.create(filepicker);
Appy.Upload._apikey = 'AR8R7qULjSKCgBVrWM8Lwz';
Appy.Upload.setKey(Appy.Upload._apikey);
Appy.Upload.picker_options = {
    imageQuality: 80
    ,mimetype: 'image/*'
    ,services: ['CONVERT', 'COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX']
    ,conversions: ['crop', 'rotate', 'filter']
    ,openTo: 'COMPUTER'
    //,customCss: 'https://www.appycouple.com/css/editor/plugins/filestack.css'
};
Appy.Upload.pick = function() {
    var sup = Object.getPrototypeOf(this);
    if (arguments[0] == null) arguments[0] = this.picker_options || {}; // inject default picker options into filepicker.pick()
    sup.pick.apply(sup, arguments); // use apply to pass in the arguments array
}
//
// Appy.Upload.pickAndStore = function() {
//     var sup = Object.getPrototypeOf(this);
//     if (arguments[0] == null) arguments[0] = this.picker_options || {};
//     sup.pickAndStore.apply(sup, arguments);
// }
