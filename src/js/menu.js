(function() {
    class Menu {
        constructor(selector) {
            this.menu = $(selector)
            this.trigger = this.menu.find('[js-open-mobile-menu]');
            this.isOpen = false;
        }
        manageState() {
            if (this.isOpen) {
                this.menu.removeClass('is-open');
                this.isOpen = false;
            } else {
                this.menu.addClass('is-open');
                this.isOpen = true;
            }
        }
        close() {
            this.menu.removeClass('is-open');
            this.isOpen = false;
        }
        _bindEvents() {
            const _this = this;
            this.trigger.off('.trigger-mobile-menu').on('click.trigger-mobile-menu', function (e) {
                _this.manageState();
            });
            $(window).off('.trigger-mobile-menu').on('click.trigger-mobile-menu', function (e) {
                if (!$(e.target).closest('[js-mobile-menu]').length) {
                    _this.close();
                }
                if ($(e.target).attr('js-scroll-to')) {
                    _this.close();
                }
            });
        }

        init() {
            this._bindEvents();
        }
    }

    const menu = new Menu('[js-mobile-menu]').init();
})();