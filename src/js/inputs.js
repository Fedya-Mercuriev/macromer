app.bind('default inputShadow inputs basic', function(context){
    $('[js-inputShadow]', context).inputShadow();
});

app.bind('default inputmask inputs basic', function(context){
    $('[js-input-phone]', context).attr('data-is-inputmask', true).inputmask({
        mask: '+7 (999) 999-99-99',
        placeholder: '+7 (___) ___-__-__',
        jitMasking: 4,
        clearMaskOnLostFocus: false,
        showMaskOnHover: true,
        showMaskOnFocus: true,
        isComplete: function (buffer, opts) {
            return Inputmask.isValid(buffer.join(''), {mask: opts.mask})
        },
        oncomplete: function () {
            $(this).trigger('maskComplete');
        },
        onincomplete: function () {
            $(this).trigger('maskIncomplete');
        }
    });

    $('[js-input-number]', context).attr('data-is-inputmask', true).each((inputIndex, input) => {
        const $input = $(input);
        let minValue = typeof $input.data('min') !== 'undefined' ? parseInt($input.data('min')) : $input.prop('min').length > 0 ? $input.prop('min') : 1;
        let maxValue = typeof $input.data('max') !== 'undefined' ? parseInt($input.data('max')) : $input.prop('max').length > 0 ? $input.prop('max') : 999999999;
        let value = parseInt($input.val().replace(/[^0-9.]/g, ''));

        $input.off('.input-number').on({
            'input.input-number': (e) => {
                setValue();
            },
        }).inputmask({
            mask: "9{*}",
            repeat: maxValue.length,
            greedy: true,
            regex: '[0-9]*',
            showMaskOnHover: false,
            showMaskOnFocus: false,
            isComplete: function (buffer, opts) {
                return Inputmask.isValid(buffer.join(''), {regex: opts.regex})
            }
        });

        function setValue (val = parseInt($input.val().replace(/[^0-9.]/g, ''))) {
            if ( val < minValue ) {
                value = minValue;
                $input.val(value).trigger('change');
            }
            else if ( val > maxValue ) {
                value = maxValue;
                $input.val(value).trigger('change');
            }
            else {
                value = val;
            }

            return value;
        }
    });

    $('[data-inputmask]', context).attr('data-is-inputmask', true).inputmask({
        oncomplete: function () {
            $(this).trigger('maskComplete');
        },
        onincomplete: function () {
            $(this).trigger('maskIncomplete');
        }
    });
});
