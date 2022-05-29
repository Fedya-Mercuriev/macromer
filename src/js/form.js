(function() {
    const $wrapper = $('[js-feedback-form]');
    const $iframes = $('iframe').filter((index, item) => {
        if (item.id.indexOf('qbpm') !== -1) {
            modifyFrameSize($(item));
            return item;
        }
    });

    function modifyFrameSize($frame) {
        if ($(window).width() < 540) {
            $frame.css('width', $(window).width() - 20);
        }
    }

    if ($iframes.length) {
        $('iframe[id*=qbpm]').remove();
        $wrapper.html($iframes.eq(0).clone());
    }
})();