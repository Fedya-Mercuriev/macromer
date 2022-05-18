(function($, window, undefined){
    const errorMessages = {
        ru: {
            valueMissing: {
                default: 'Заполните поле',
                email: 'Введите почту',
                _username: 'Введите логин',
                phone: 'Введите номер телефона',
                terms: 'Вы должны согласиться с условями',
                size: 'Выберите размер',
                promocode: 'Введите промокод',
                name: 'Введите имя команды',
                firstname: 'Введите имя',
                lastname: 'Введите фамилию',
                password: 'Введите пароль',
            },
            typeMismatch: {
                default: 'Неверный формат',
                phone: 'Неверный формат телефона',
                email: 'Неверный формат почты',
            },
            tooShort: {
                default: 'Недостаточно символов',
            },
            tooLong: {
                default: 'Слишком длинное значение',
            },
            rangeOverflow: {
                default: 'Значение больше максимального',
            },
            rangeUnderflow: {
                default: 'Значение меньше минимального',
            },
            different: {
                default: 'Значения не совпадают',
            },
            limit: {
                default: 'Много одинаковых значений',
            },
        },
    };

    const processRequestError = function($form, errors){
        const errorsObj = Object.keys(errors);
        let $allFields = $();

        errorsObj.map((field, fieldIndex) =>{
            const formTag = $form[0].tagName;
            let message = errors[field];
            let $fields = formTag == 'INPUT' || formTag == 'TEXTAREA' ? $form : $form.find(`[name="${field}"], [name^="${field}["]`);

            if($form.attr('id')){
                $fields = $fields.add(`[name="${field}"][form="${$form.attr('id')}"], [name^="${field}["][form="${$form.attr('id')}"]`)
            }

            $allFields = $allFields.add($fields);

            $fields.each((i, input) =>{
                const isToggle = input.type == 'checkbox' || input.type == 'radio';
                const $input = $(input);
                const $field = isToggle ? $input.closest('.toggle') : $input.closest('.field');
                let group = $field.data('inputs-group');
                let $group = $();

                if ( input.name.indexOf('/error') >= 0 ) {
                    input.name = input.name.split('/error')[0];
                }

                if ( group ) {
                    $group = $input.closest(`[js-inputShadow-group][data-inputs-group="${group}"]`);
                }

                if( isToggle ){
                    $input.data({valid: false}).trigger('invalid');
                }

                if ( group && $group.length ) {
                    let $error = $group.find('.inputs-group__error');

                    if (!$error.length ) {
                        $error = $(`<div class="inputs-group__error"></div>`).appendTo($group);
                        $error[0].offsetWidth;
                    }
                    $error.html(message);
                    $group.addClass('is-error');
                }
                else if ( !isToggle ) {
                    let $error = $field.find('.field__error');
                    if (!$error.length) {
                        $error = $('<span class="field__error" />');
                        $field.append($error);
                        $error[0].offsetWidth;
                    }
                    $error.html(message);
                }

                $field.removeClass('is-ok').addClass('is-error');
            });

            if ( formTag == 'FORM' ) {
                const $submit = $form.find('[type="submit"]');
                $form
                    .off('.catch-change')
                    .on('valid.catch-change invalid.catch-change', (e) => {
                        $submit.removeClass('is-error');
                    });
                $submit.addClass('is-error');
            }
        });

        if ( $.scrollTo ) {
            const $firstErrorField = $allFields.filter(':visible, [type="checkbox"], [type="radio"]').eq(0);
            if ( $firstErrorField.length && !app.isInViewport($firstErrorField) ){
                $.scrollTo($firstErrorField.closest('.toggle, .field'));
            }
        }
    };

    const testInput = function (input) {
        const error = {};
        const locale = 'ru';
        const isCompare = input.dataset && input.dataset.compare;
        const isLimit = input.dataset && input.dataset.limit;
        const isValidate = input.dataset && !!input.dataset.validate;
        const isRequired = input.required;
        let $helpInputs = $();

        if ( isValidate && !isRequired ) {
            input.required = true;
        }

        if ( isCompare ) {
            $helpInputs = $(input).closest('form').find(`[name="${input.dataset.compare}"]`);
        }
        if ( isLimit ) {
            $helpInputs = $(input).closest('form').find(`[name="${input.name}"]`);
        }

        // console.log(input.name, input.disabled, input.value, input.dataset && input.dataset.isInputmask == "true" ? 'inputmask' : '', input.validity.valid);
        if ( input.disabled ) {
            // Что-то делать или нет?
            // console.log(input.name, 'disabled')
        }
        else if ( input.validity.valueMissing ) {
            error[input.name] = errorMessages[locale].valueMissing[input.name || input.type] || errorMessages[locale].valueMissing['default'];
            // Поле не заполнено
        }
        else if ( input.value.length && (input.type == 'email' || input.name == 'email' ) && !Inputmask.isValid(input.value.toLowerCase(), {regex: '[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.){1,3}[a-zA-Z]{2,4}'}) ) {
            // Слишком не email
            error[input.name] = errorMessages[locale].typeMismatch['email'] || errorMessages[locale].typeMismatch['default'];
        }
        else if ( input.dataset && input.dataset.isInputmask == "true" && !$(input).inputmask('isComplete') ) {
            error[input.name] = errorMessages[locale].typeMismatch[input.name] || errorMessages[locale].typeMismatch['default'];
        }
        else if ( input.validity.tooShort || input.minlength && input.value.length < input.minlength ) {
            // Слишком короткий
            error[input.name] = errorMessages[locale].tooShort[input.name] || errorMessages[locale].tooShort['default'];
        }
        else if ( input.validity.tooLong ) {
            // Слишком длинный
            error[input.name] = errorMessages[locale].tooLong[input.name] || errorMessages[locale].tooLong['default'];
        }
        else if ( input.validity.typeMismatch ) {
            // Работает только на email и url, лучше использовать для этого inputmask
            error[input.name] = errorMessages[locale].typeMismatch[input.name] || errorMessages[locale].typeMismatch[input.type] || errorMessages[locale].typeMismatch['default'];
        }
        else if ( input.validity.rangeOverflow ) {
            // Число больше максимального
            error[input.name] = errorMessages[locale].rangeOverflow[input.name] || errorMessages[locale].rangeOverflow['default'];
        }
        else if ( input.validity.rangeUnderflow ) {
            // Число меньше минимального
            error[input.name] = errorMessages[locale].rangeUnderflow[input.name] || errorMessages[locale].rangeUnderflow['default'];
        }
        else if ( isCompare && $helpInputs.val().length > 0 && input.value !== $helpInputs.val() ) {
            // Значения различаются
            error[input.name] = errorMessages[locale].different[input.name] || errorMessages[locale].different['default'];
        }
        else if ( isLimit && $helpInputs.toArray().filter((helpInput) => helpInput.value == input.value).length > input.dataset.limit ) {
            // Много одинаковых значений
            error[input.name] = errorMessages[locale].limit[input.name] || errorMessages[locale].limit['default'];
        }

        if ( isValidate && !isRequired ) {
            input.required = false;
        }

        return error;
    }

    $.fn.formClearError = function(){
        this.find('.field.is-error, .toggle.is-error, .fieldset.is-error').removeClass('is-error');
        return this;
    };

    $.fn.formError = function(errors = {}){
        processRequestError(this, errors);
        return this;
    };

    $.fn.inputValidate = function(simple){
        const errors = testInput(this[0]);
        if ( !simple ) {
            processRequestError(this, errors);
        }
        return errors;
    };

    $.fn.formValidate = function(options = {isBoolean: false, hideErrors: false}){
        this.formClearError();
        const $inputs = this.find('input[hidden], input:visible, textarea:visible, select:visible, .selectus:visible select, .toggle:visible input');

        let errors = {};

        $.each($inputs.toArray().reverse(), (inputIndex, input) => {
            const test = testInput(input);
            if ( !$.isEmptyObject(test) ) {
                errors = {...errors, ...{[input.name +'/error'+ inputIndex]: test[input.name]}};
                if ( options.isBoolean ) return false;
                if ( !options.hideErrors ) {
                    input.name += '/error'+ inputIndex;
                }
            }
        });

        if ( options.isBoolean ) {
            return !Object.keys(errors).length;
        }
        else if ( !options.hideErrors ) {
            processRequestError(this, errors);
        }
        return errors;
    };


    $.fn.form = function({isValid: isValid, success: successCallback, error: errorCallback, beforeSend: beforeSendCallback, complete: completeCallback} = {}){
        this.each(function(i, form){
            const $form = $(form);
            let lock;

            $form.off('.form').on('submit.form', function(e){
                e.preventDefault();

                const validateErrors = $form.formValidate();

                if(lock || !$.isEmptyObject(validateErrors) || (typeof isValid === 'function' && !isValid.call(null, form))){
                    processRequestError($form, validateErrors);
                    return;
                }

                lock = true;
                let data;
                const $files = $form.find('[type="file"]');

                if($files.length){
                    data = new FormData(form);
                    $files.each(function(i, input){
                        data.append(input.name, input);
                    });
                }else{
                    data = $form.serialize();
                }

                const $submit = $form.find('button[type=submit]');

                $.ajax({
                    url: $form.attr('action'),
                    type: $form.attr('method') || 'post',
                    dataType: 'json',
                    data: data,
                    contentType: (data instanceof FormData) ? false : 'application/x-www-form-urlencoded' ,
                    processData: !(data instanceof FormData),
                    beforeSend: function(xhr, settings){
                        $form.addClass('is-loading').formClearError();
                        $submit.prop('disabled', true);

                        if(beforeSendCallback){
                            beforeSendCallback.call(null, xhr, form, settings)
                        }
                    },
                    success: function(response){
                        if(successCallback){
                            successCallback.call(null, response, form)
                        }
                    },
                    error: function(xhr){
                        app
                            .processError(xhr, {
                                request: errors => processRequestError($form, errors)
                            })
                            .then(errorCallback || function(){});
                    },
                    complete: function(response){
                        lock = false;
                        $form.removeClass('is-loading');
                        $submit.prop('disabled', false);

                        if(completeCallback){
                            completeCallback.call(null, response, form)
                        }
                    }
                });
            });
        });
    };

    $('[js-feedback-form]').form();

})(jQuery, window);
