    var regex = {
        'required': /(.+)/,
        'alpha': /[A-Za-z]+/,
        'numeral': /[0-9]/,
        'alphanumeral': /[A-Za-z0-9]/,
        'email': /[A-Za-z0-9.]+@[A-Za-z0-9.]+\.[A-Za-z]{2,3}/ // Simple email check
    };

    /**
     *
     * @param element {DOM element} The element to validate.
     * @returns {boolean}
     *
     */
    function validate(element) {
        if (!element.hasAttribute('data-validation'))
            return;

        var isValid, value, instructions;

        isValid = true;

        value = element.value;

        instructions = element.getAttribute('data-validation').split(/\s+/);

        for (var index = 0; index < instructions.length; index++) {
            var instruction, currentRegex;

            instruction = instructions[index];

            currentRegex = (typeof regex[instruction] !== 'undefined') ? regex[instruction] : new RegExp(instruction);

            if (!currentRegex.test(value)) {
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     *
     * @param element {DOM element} The element to validate.
     * @param options {object} [optional] The options to merge with the configs. See documentation.
     * @constructor
     *
     */
    idex.validate = function(elements, options) {
        var configs = {
            classes: {
                'error': 'error'
            },
            callbacks: {
                submit: function() {
                    return true;
                }
            }
        };

        configs = idex.merge(configs, options);

        if (!elements)
            throw new Error("No element was submitted...");

        function process(element) {
            if (!element.hasAttribute('data-validation'))
                return;

            idex.on(element, 'blur', function() {
                if (!validate(element)) {
                    idex.addClass(element, configs.classes.error);
                } else {
                    idex.removeClass(element, configs.classes.error);
                }
            });
        }

        if (elements.tagName === 'FORM') {
            idex.on(elements, 'submit', function(event) {
                for (var index = 0; index < elements.length; index++) {
                    idex.fire(elements[index], 'blur');
                }

                if (elements.querySelectorAll('.' + configs.classes.error).length > 0) {
                    idex.preventDefault(event);
                } else {
                    configs.callbacks.submit.apply(this);
                }
            });
        }

        if (elements.length) {
            for (var index = 0; index < elements.length; index++) {
                process(elements[index]);
            }
        } else {
            process(elements);
        }
    };