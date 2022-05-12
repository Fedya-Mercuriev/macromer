(function() {
	class Dropdowns {
		constructor(toggleSelector) {
			this.dropdowns = this._composeDropdownsArray(toggleSelector);
		}

		_composeDropdownsArray(toggleSelector) {
			const result = [];
			$(toggleSelector).each(function(_, item) {
				result.push({
					toggle: item,
					dropdown: $(item).next('[js-dropdown-list]'),
					isOpen: false,
					open() {
						$(this.toggle).addClass('is-clicked');
						$(this.dropdown).addClass('is-open');
					},
					close() {
						$(this.toggle).removeClass('is-clicked');
						$(this.dropdown).removeClass('is-open');
					} 
				});
			});

			return result;			
		}

		_manageElementsState(targetElement) {
			let elementIndex = -1;

					this.dropdowns.forEach((item, index) => {
						if ($(item.toggle).is(targetElement)) {
							elementIndex = index;
						}
					})

					this.dropdowns.forEach((item) => item.close());

					if (elementIndex !== -1) {
						if (!this.dropdowns[elementIndex].isOpen) {
							this.dropdowns[elementIndex].open();
							this.dropdowns[elementIndex].isOpen = true;

						} else {
							this.dropdowns[elementIndex].close();
							this.dropdowns[elementIndex].isOpen = false;
						}
					}
		}

		_bindEvents() {
			const _this = this;

			this.dropdowns.forEach(function(item) {
				$(item.toggle).off('.toggle-dropdown').on('click.toggle-dropdown', function(e) {
					_this._manageElementsState(e.currentTarget);
					e.stopPropagation();
				})
			})

			$(window).off('.toggle-dropdown').on('click.toggle-dropdown', function(e) {
				if (!$(e.currentTarget).closest('[js-dropdown-wrapper]').length) {
					_this._manageElementsState(e.currentTarget);
				}
			});
		}

		init() {
			this._bindEvents();
		}
	}

	const dropdowns= new Dropdowns('[js-dropdown-toggle]').init();

	// window.off('.toggle-dropdown').on('click.toggle-dropdown', function(e) {
	// 	if(!$(e.target).closest('[js-dropdown-toggle]')) {

	// 	}
	// });
})();