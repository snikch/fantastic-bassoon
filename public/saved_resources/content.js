Appy.Content = Object.create(Object.prototype);
Appy.Content.modalFormId = '#modal-wedsite-form';
if (Appy.Upload != null) {
    Appy.Content.uploader = Object.create(Appy.Upload);
    Appy.Content.uploader.pickAndStore = function () {
        var sup = Object.getPrototypeOf(this);
        if (arguments[0] == null) arguments[0] = this.picker_options || {};
        arguments[0].onSuccess = function () {
            $(Appy.Content.modalFormId).data('changed', true);
        }
        sup.pickAndStore.apply(sup, arguments);
    }
}
// edit mode states, on/off, etc.
var State = function State() {
    var self = this;
    State.locked = true;
    State.moduleList = [];
    $(document).off('lock').on('lock', function (e, cb) {
        return self.onLock(cb);
    });
    $(document).off('unlock').on('unlock', function (e, cb) {
        return self.onUnlock(cb);
    });

    this.isLocked = function() {
        return State.locked;
    }
    this.unlock = function(cb) {
        State.locked = false;
        $(document).trigger('unlock', cb);
    };
    this.lock = function(cb) {
        State.locked = true;
        $(document).trigger('lock', cb);
    };
    this.toggle = function(cbUn, cbLock) {
        if (this.isLocked()) {
            this.run('unlock').then(cbUn);
        } else {
            this.run('lock').then(cbLock);
        }
        // var cb;
        // State.locked = !State.locked;
        // cb = (State.locked ? cbLock : cbUn);
        // return this.run(State.locked).then(cb);
    };
    this.onLock = function(cb) {
        if (Appy._config._debug) {
            console.group('LOCKED');
            console.log('editor is now locked.');
            console.groupEnd();
        }
        if (typeof cb === 'function') return cb();
        return cb;
    };
    this.onUnlock = function(cb) {
        if (Appy._config._debug) {
            console.group('UNLOCKED');
            console.log('editor is now unlocked.');
            console.groupEnd();
        }
        if (typeof cb === 'function') return cb();
        return cb;
    };
    // register unlock/lock methods
    this.register = function(module) {
        if (module != null) State.moduleList.push(module);
        return State.moduleList;
    };
    // this is called by anything that needs to change the state, usually a click handler
    this.run = function(mode) {
        (mode == 'lock') ? this.lock() : this.unlock(); // set the state
        // run each module's unlock/lock methods to set the UI elements, events, etc
        State.moduleList.forEach(function(item) {
            if (mode == 'lock') {
                if (typeof item.lock === 'function') item.lock();
            } else {
                if (typeof item.unlock === 'function') item.unlock();
            }
        });
        return Promise.resolve();
    }
};

Appy.Content.mode = new State();

Appy.Content.save = function(sending, page, $frm, skip_reload, skip_close) {
    // if you pass in a jquery form selector you can automatically parse for errors
    if ($frm != null) {
        var $p = $frm.parsley();
        if (!$p.isValid()) {
            $p.validate();
            return Promise.reject(false);
        }
    }

    var self = this;
    if (page == null) {
        page = 'content';
    }
    var url = endpoint + page + '/';
    if (sending.endpoint != null) url = sending.endpoint;
    if (Appy._config._debug) console.log('Sending to: ' + url);
    return new Promise(function(resolve,reject) {
        if (sending == null) reject('Did not send any data!');
        if (Appy._config._debug) {
            console.group('AJAX');
            console.log("Sending data:");
            console.log(sending);
            appyNotices.open(Appy.Messages.notice.saving, Appy.Messages.notice.savingExt);
        }
        $.post({
            dataType: 'json'
            , url: url
            , data: sending
            ,xhrFields: {
                withCredentials: true
            }
        })
            .then(function __then__(res) {
                var filter = $.Deferred();
                if (res.errors != null) {
                    filter.reject(res.errors);
                    return filter;
                }
                self.done(res, skip_close);
                if (Appy._config._debug) {
                    appyNotices.close(Appy.Messages.notice.complete, Appy.Messages.notice.completeExt, 'toast-success');
                    console.log('Received from server:');
                    console.log(res);
                    console.groupEnd();
                } else if (skip_reload !== true) {
                    window.location.reload();
                }
                resolve(res);
            })
            .fail(function (jq, text, err) {
                appyNotices.close(Appy.Messages.notice.failed, (jq || Appy.Messages.notice.failedExt), 'toast-error');
                $('#modal-errors').html(jq);
                //self.fail(jq, text, err);
                if (Appy._config._debug) {
                    console.group("FAILED");
                    console.log('Error from server: ',jq, text, err);
                    console.groupEnd();
                    console.groupEnd();
                }
                reject(jq);
                return false;
            });
    });
};
Appy.Content.fail = function(jq, text, err) {
    if (!Appy._config._debug) return;
    console.group("Failure");
    console.log(jq,text,err);
    console.groupEnd();
};
Appy.Content.done = function(data, skip) {
    if (Appy.modal == null || skip) return;
    Appy.modal.close().then(function() {
        console.log("close() called");
    });
};
