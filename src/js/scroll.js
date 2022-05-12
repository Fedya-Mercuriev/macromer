(function() {
    const $scrollToTriggers = $('[js-scroll-to]');

    $scrollToTriggers.each(function(_, item) {
        $(item).off('.scroll-to').on('click.scroll-to', function(e) {
            e.preventDefault();
            const target = $(e.currentTarget).attr('js-scroll-to');
            $([document.documentElement, document.body]).animate({
                scrollTop: $(`#${target}`).offset().top
            }, 800);
        })
    });
})();