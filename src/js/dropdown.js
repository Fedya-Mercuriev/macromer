(function() {
	class Dropdowns {
		constructor(toggleSelector) {
			this.dropdowns = $(toggleSelector);
		}

		open($element) {
			$element.addClass('is-open');
			$element.find('[js-dropdown-toggle]').addClass('is-clicked');
			$element.find('[js-dropdown-list]').addClass('is-open');
		}

		close($element) {
			$element.removeClass('is-open');
			$element.find('[js-dropdown-toggle]').removeClass('is-clicked');
			$element.find('[js-dropdown-list]').removeClass('is-open');
		}

		_manageElementsState($element) {
			const _this = this;
			if ($element.hasClass('is-open')) {
				this.dropdowns.each((_, item) => _this.close($(item)));
				this.close($element);
			} else {
				this.dropdowns.each((_, item) => _this.close($(item)));
				this.open($element);
			}
		}

		_bindEvents() {
			const _this = this;

			this.dropdowns.each(function(_, item) {
				debugger;
				$(item).find('[js-dropdown-list]').off('.toggle-dropdown').on('click.toggle-dropdown', function(e) {
					e.stopPropagation();
				});
				$(item).off('.toggle-dropdown').on('click.toggle-dropdown', function(e) {
					_this._manageElementsState($(e.currentTarget));
					e.stopPropagation();
				})
			})

			$(window).off('.toggle-dropdown').on('click.toggle-dropdown', function(e) {
				_this._manageElementsState($(e.currentTarget));
			});
		}

		init() {
			this._bindEvents();
		}
	}

	const dropdowns= new Dropdowns('[js-dropdown-wrapper]');
	dropdowns.init();
})();