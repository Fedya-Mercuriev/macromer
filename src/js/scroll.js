(function() {
    const $scrollToTriggers = $('[js-scroll-to]');

    $scrollToTriggers.each(function(_, item) {
        $(item).off('.scroll-to').on('click.scroll-to', function(e) {
            e.preventDefault();
            const target = $(e.currentTarget).attr('js-scroll-to');
            $(window).scrollTo($(`#${target}`).offset().top - 90, 800);
        })
    });
})();