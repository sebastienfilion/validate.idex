/** APP **/


(function(idex, window, document, undefined) {

    idex.test = function() {

        idex.validate(document.querySelector('form'));

    };


    idex.test();

    return idex;

}(window.idex = window.idex || {}, window, document));