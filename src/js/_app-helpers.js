!function () {
    const _pluralize = (n, titles, noNumber) => `${noNumber ? '' : n + ' '}${titles[n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]}`;
    app.pluralize = _pluralize;
    app.textPluralize = (n, titles) => _pluralize(n, titles, true);
}();

app.isInViewport = ($element, options = {edge: 'all', offset: 0}) => {
    const element = (($element instanceof jQuery) ? $element[0] : $element);
    const rect = element.getBoundingClientRect();
    if ( options.edge == 'top' ) {
        return rect.top >= window.innerHeight || rect.top < 0;
    }
    return (rect.top > 0 ? rect.top + document.documentElement.scrollTop <= window.innerHeight + document.documentElement.scrollTop : rect.top + document.documentElement.scrollTop >= window.innerHeight + document.documentElement.scrollTop);
}

app.prettyPrice = (price) => `${ price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') } ₽`;
