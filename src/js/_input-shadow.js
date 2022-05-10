(function ($) {
    $.fn.inputShadow = function () {
        return $(this).each(function (parent_i, parent) {
            var $parent = $(parent);
            var $input = $parent.find('input, textarea, [contenteditable], select');
            var isToggle = $input.is(':checkbox, :radio');
            var isValidate = $input.data('validate') || false;
            var isRequired = $input.prop('required') || isValidate || false;
            var isContenteditable = $input.is('[contenteditable]');
            var errorRemoveEvent = $parent.data('error-remove') || 'focus';
            var novalidate = ($input.data('novalidate') && !isValidate) || false;

            if (isContenteditable) {
                var $hiddenInput = $('<input type="text" name="' + $input.attr('name') + '" value="' + $input.html().trim().replace(/<div>/gi, '<br>').replace(/<\/div>/gi, '').replace(/<br>/gi, '\n') + '"/>').appendTo($parent);
                $hiddenInput.hide().prop({
                    disabled: $input.attr('disabled'),
                    required: $input.attr('required'),
                });
            }

            $parent.removeClass('is-focus is-filled').toggleClass('is-required', isRequired);
            $input.off('.input-shadow');

            if ($input.is('select')) {
                var $options = $input.find('option');
                var selectedVal;
                $input.on({
                    'update.input-shadow': function (e) {
                        isRequired = $input.prop('required');
                        $parent.toggleClass('is-required', isRequired);
                        $options = $input.find('option');
                        $input.trigger('changeSilent');
                    },
                    'invalid.input-shadow': function (e) {
                        $parent.addClass('is-invalid').removeClass('is-ok is-valid');
                    },
                    'valid.input-shadow': function (e) {
                        $parent.addClass('is-valid').removeClass('is-invalid');
                    },
                    'change.input-shadow changeSilent.input-shadow': function (e, notUser) {
                        if ($input.is(':disabled')) {
                            $parent.addClass('is-disabled');
                        }
                        else {
                            $parent.removeClass('is-disabled');
                        }

                        selectedVal = $options.filter(':selected').val();

                        if (selectedVal !== '' && selectedVal !== '0') {
                            $parent.addClass('is-filled');

                            if (!notUser && $parent.hasClass('is-error')) {
                                $parent.removeClass('is-error');
                            }
                        }
                        else {
                            $parent.removeClass('is-filled');

                            if (!notUser && !isRequired && $parent.hasClass('is-error')) {
                                $parent.removeClass('is-error');
                            }
                        }

                        if ( isValid($input) ) {
                            $parent.addClass('is-valid');
                            $input.data({valid: true}).trigger('valid');
                        }
                        else {
                            $parent.removeClass('is-ok is-valid');
                            $input.data({valid: false}).trigger('invalid');
                        }
                    }
                });
            }
            else if (isToggle) {
                var group = $input.data('fieldset');
                var $group = group ? $parent.parents('[js-inputShadow-fieldset][data-fieldset="'+ group +'"]').off('.input-shadow') : $();
                var $groupInputs = $group.length ? $group.find('input') : $();

                $input.on({
                    'update.input-shadow': function (e) {
                        isRequired = $input.prop('required');
                        $parent.toggleClass('is-required', isRequired);
                    },
                    'change.input-shadow changeSilent.input-shadow': function (e) {
                        if ($input.is(':disabled')) {
                            $parent.addClass('is-disabled');
                        }
                        else {
                            $parent.removeClass('is-disabled');
                        }

                        if ( isValid($input) ) {
                            $parent.removeClass('is-error');
                            $input.data({valid: true}).trigger('valid');
                        }
                        else {
                            $parent.addClass('is-error');
                            $input.data({valid: false}).trigger('invalid');
                        }
                    }
                });
                if ( $input.is(':radio') ) {
                    var name = $input.attr('name');
                    $group.on({
                        'valid.input-shadow': function (e) {
                            $groupInputs.filter(`[name="${name}"]`).data({valid: true});
                        },
                        'invalid.input-shadow': function (e) {
                            $groupInputs.filter(`[name="${name}"]`).data({valid: false});
                        }
                    });
                }
                $group.on({
                    'valid.input-shadow invalid.input-shadow': function (e) {
                        if ( $groupInputs.filter(function (inputIndex, input) {return $groupInputs.eq(inputIndex).data('valid') === false}).length ) {
                            $group.addClass('is-error');
                        }
                        else {
                            $group.removeClass('is-error');
                        }
                    }
                });
            }
            else {
                var group = $parent.data('inputs-group');
                var $group = group ? $parent.parents('[js-inputShadow-group][data-inputs-group="'+ group +'"]') : $();
                var $groupInputs = $group.length ? $group.find('input') : $();

                $group.on({
                    'valid.input-shadow invalid.input-shadow': function (e) {
                        if ( $groupInputs.filter(function (inputIndex, input) {return $groupInputs.eq(inputIndex).data('valid') === false}).length ) {
                            $group.addClass('is-error');
                            $parent.removeClass('is-error');
                        }
                        else {
                            $group.removeClass('is-error');
                        }
                    }
                });

                $input.on({
                    'update.input-shadow': function (e) {
                        isRequired = $input.prop('required');
                        $parent.toggleClass('is-required', isRequired);
                    },
                    'invalid.input-shadow': function (e) {
                        $parent.addClass('is-invalid').removeClass('is-ok is-valid');
                    },
                    'valid.input-shadow': function (e) {
                        $parent.addClass('is-valid').removeClass('is-invalid');
                    },
                    'clear.input-shadow': function (e) {
                        // e.stopPropagation();
                        $parent.removeClass('is-error is-invalid is-valid');
                        $input.val(null).trigger('changeSilent');
                    },
                    'focus.input-shadow': function (e) {
                        $parent.addClass('is-focus');
                        if (errorRemoveEvent == 'focus') {
                            $parent.removeClass('is-error');
                        }
                        if ( $.fn.inputmask && $input.data('inputmask-showmaskonfocus') && $input.inputmask("hasMaskedValue") ) {
                            $parent.addClass('is-filled');
                        }
                    },
                    'blur.input-shadow': function (e) {
                        var $targetInput = isContenteditable ? $hiddenInput : $input;
                        $parent.removeClass('is-focus');

                        if ( isRequired && isValid($targetInput) ) {
                            $parent.addClass('is-valid').removeClass('is-invalid');
                            $targetInput.data({valid: true}).trigger('valid');
                        }
                        else if ( isRequired ) {
                            $parent.addClass('is-invalid').removeClass('is-ok is-valid');
                            $targetInput.data({valid: false}).trigger('invalid');
                        }
                    },
                    'keyup.input-shadow': function (e) {
                        if (isContenteditable) {
                            $input.trigger('changeSilent');
                        }
                    },
                    'input.input-shadow change.input-shadow changeSilent.input-shadow': function (e, notUser) {
                        // $parent.removeClass('is-autofilled');
                        if ($input.is(':disabled')) {
                            $parent.addClass('is-disabled');
                        }
                        else {
                            $parent.removeClass('is-disabled');
                        }

                        if ($input.val().length > 0 || (isContenteditable && $input.text().length > 0) || ( $.fn.inputmask && $input.inputmask("unmaskedvalue").length > 0)) {
                            $parent.addClass('is-filled');
                            if ($parent.hasClass('is-error') && e.type !== 'change' && !notUser) {
                                $parent.removeClass('is-error');
                            }
                        }
                        else if ( ($.fn.inputmask && !$input.inputmask("hasMaskedValue")) ) {
                            $parent.removeClass('is-filled');
                        }

                        if (e.type !== 'change' && !notUser) {
                            $parent.removeClass('is-valid is-invalid');
                        }

                        if (isContenteditable) {
                            $hiddenInput.val($input.html().trim().replace(/<div>/gi, '<br>').replace(/<\/div>/gi, '').replace(/<br>/gi, '\n'));
                        }

                        if ( notUser && $.fn.inputmask && $input.inputmask("unmaskedvalue").length == 0 ) {
                            $parent.removeClass('is-filled');
                        }
                    },
                    'maskIncomplete': function (e) {
                        if ( isRequired ) {
                            isValid($input);
                        }
                        // $input.inputValidate();
                        if ( $input.inputmask("unmaskedvalue").length == 0 ) {
                            $parent.removeClass('is-filled');
                        }
                    }
                });
            }

            function isValid ($input) {
                // return novalidate || (!isRequired || (isRequired && !$input[0].value)) ? true : $.isEmptyObject($input.inputValidate());
                // return novalidate || (!isRequired ? true : $.isEmptyObject($input.inputValidate(isToggle || !$input[0].value)));
                return novalidate || (!isRequired || isToggle ? true : $.isEmptyObject($input.inputValidate(!isToggle && !$input[0].value)));
            }

            $input.trigger('changeSilent', true);
        });
    };
})(jQuery);
