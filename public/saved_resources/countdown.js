jQuery(function() {
    if (
        typeof countdown_start == 'undefined'
    ) {
        return;
    }

    var $clock = $('#clock')
        ,interval = 1000;
    var
        eventTime = moment.utc(countdown_start, 'X').tz(countdown_tz);//.format('DD-MM-YYYY HH:mm:ss');
        currentTime = moment().tz(countdown_tz),
        diffTime = moment.unix(countdown_start).tz(countdown_tz) - currentTime.tz(countdown_tz).unix(),
        duration = moment.duration(diffTime * 1000, 'milliseconds');
        if(diffTime > 0) {
            $clock.removeClass('hidden').show();
            var $d = $('<div class="days color_2_dark"></div>').appendTo($clock.find('.days-container .inner')),
                $h = $('<div class="hours color_2_dark"></div>').appendTo($clock.find('.hours-container .inner')),
                $m = $('<div class="minutes color_2_dark"></div>').appendTo($clock.find('.minutes-container .inner'));
            var months, d, h, m;
            var setInt = setInterval(function(){
                eventTime = moment.utc(countdown_start, 'X').tz(countdown_tz),
                currentTime = moment().tz(countdown_tz),
                diffTime = moment.unix(countdown_start).tz(countdown_tz) - currentTime.tz(countdown_tz).unix(),
                duration = moment.duration(diffTime * 1000, 'milliseconds');
                var ms = eventTime.diff(currentTime, 'milliseconds', true);

                d = Math.floor(moment.duration(ms).asDays());
                eventTime = eventTime.subtract('days', d);
                ms = eventTime.diff(currentTime, 'milliseconds', true);
                h = Math.floor(moment.duration(ms).asHours());
                eventTime = eventTime.subtract('hours', h);
                ms = eventTime.diff(currentTime, 'milliseconds', true);
                m = Math.floor(moment.duration(ms).asMinutes());
                eventTime = eventTime.subtract('minutes', m);
                ms = eventTime.diff(currentTime, 'milliseconds', true);
                s = Math.floor(moment.duration(ms).asSeconds());

                $d.text(d);
                $h.text(h);
                $m.text(m);
                //$s.text(s);
            }, interval);
        } else {
            $clock.hide();
            $clock.siblings('.clock-none').removeClass('hidden').show();
            clearInterval(setInt);
            $('#finished').removeClass('hidden').show();
        }

});
