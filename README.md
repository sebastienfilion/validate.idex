### IDEX
# Validate form

> Tested on Safari 7.0.1, Chrome 32, Firefox 26 and IExplorer 9

This simple library allows to easily customize form elements like radio buttons, checkboxes and select menu. It is easy to configure and will look exactly like you want it. Oh and it is accessible!

**[DEMO](http://demo.idesignexperiences.com/validate)**


## Usage

### Very basic usage

```js
var form = document.getElementsByTagName('form');

idex.validate(form);
```

And bam! No more empty fields :)

The ```idex.validate``` function takes two arguments an ```elemen [DOM element or jQuery]``` and the ```options [object]```. And here's the magic.

* * *

### The options

#### Attributes

Validate.IDeX will validate the content of all inputs selected that have the special ```data-validation```. The attribute takes two different kind of content. A validation type, built-in, (```required```, ```alpha```, ```numeral```, ```alphanumeral``` and ```email```) or a valid Regular Expression (```/[a-z]{1}[0-9]{4}/```). Instruction can be combined, separated by a space, to create a more rigid validation.

```html
<input type="text" name="test" data-validation="required alpha \{1,4}" />
```

#### Callbacks ```[object function]```

There is only one callback right now ```submit``` and like its name suggest it is called when the form can be submitted ~ if there's not error.

```js
var form = document.getElementsByTagName('form');

idex.validate(form, {
    callbacks: {
        submit: function() {
            // this is the element targeted
            console.log("The form can be submitted :)");
        }
    }
});
```

#### Classes ```[object]```

The other option is the ```classes``` option. It allows you to change the state classes applied on the elements.

```js
var form = document.getElementsByTagName('form');

idex.validate(form, {
    classes: {
        error: 'error', // Used on the input when the value is invalid
    }
});
```
