/*!
* IDeX Form validation v0.1.0
* http://idesignexperiences.com/#form-validation
*
* Includes parts of jQuery
* (http://jquery.com/), released under the MIT Licence (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt)
*
* Copyright 2013, 2014 Sébastien Filion me@idesignexperiences.com
* Released under the MIT license
*
* Built on: 2014/02/02
*
*/

(function(idex, window, document, undefined) {
    /**
     *
     * @param object1 {object} The original object
     * @param object2 {object} The object to merge with
     * @returns {object} The merged object
     *
     */
    idex.merge = function(object1, object2) {
        if (!object1) return object2;

        if (!object2) return object1;

        // If object2 is an object but not and array or a function
        if ((typeof object2 !== 'object') || (typeof object2 === 'object') && (object2 instanceof Array) && (object2 instanceof Function)) {
            return object2;
        }

        for (key in object2) {
            if (object1.hasOwnProperty(key)) {
                object1[key] = idex.merge(object1[key], object2[key]);
            } else {
                object1[key] = object2[key];
            }
        }

        return object1;
    };
    if (!idex.hasOwnProperty('render')) {
        /**
         *
         * @param s {string}
         * @param o {object}
         * @returns {DOM element}
         *
         */
        idex.render = function(s, o) {
            return window.Mustache.render(s, o);
        };
    }

    if (!idex.hasOwnProperty('addClass')) {
        idex.addClass = function(es, c) {
            function p(e) {
                if (!idex.hasClass(e, c)) {
                    e.className = e.className + " " + c;
                }
            }

            if (es.hasOwnProperty('length')) {
                for (var i = 0; i < es.length; i++) {
                    p(es[i]);
                }
            } else {
                p(es);
            }
        };
    }

    if (!idex.hasOwnProperty('removeClass')) {
        idex.removeClass = function(es, c) {
            function p(e) {
                e.className = e.className.replace(
                    new RegExp('(^|\\s+)' + c + '(\\s+|$)', 'g'),
                    '$1'
                );
            }

            if (es.length) {
                for (var i = 0; i < es.length; i++) {
                    p(es[i]);
                }
            } else {
                p(es);
            }
        };
    }

    if (!idex.hasOwnProperty('hasClass')) {
        idex.hasClass = function(e, c) {
            var className = " " + c + " ",
                rclass = /[\t\r\n\f]/g;

            if ( e.nodeType === 1 && (" " + e.className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
                return true;
            }

            return false;
        };
    }

    if (!idex.hasOwnProperty('on')) {
        idex.on = function(element, event, fn) {
            if (element.addEventListener) {
                element.addEventListener(event, fn, false);
            } else {
                element.attachEvent('on' + event, function() {
                    return(fn.call(element, window.event));
                });
            }
        };
    }

    if (!idex.hasOwnProperty('fire')) {
        idex.fire = function(element, event) {
            if (document.createEvent){
                // dispatch for firefox + others
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true ); // event type,bubbling,cancelable
                return !element.dispatchEvent(evt);
            }
            else{
                // dispatch for IE
                var evt = document.createEventObject();
                return element.fireEvent('on' + event, evt)

            }
        }
    }

    if (!idex.hasOwnProperty('preventDefault')) {
        idex.preventDefault = function(event) {
            // If preventDefault exists, run it on the original event
            if ( event.preventDefault ) {
                event.preventDefault();

                // Support: IE
                // Otherwise set the returnValue property of the original event to false
            } else {
                event.returnValue = false;
            }
        }
    }
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
    };}(window.idex = window.idex || {}, window, document));