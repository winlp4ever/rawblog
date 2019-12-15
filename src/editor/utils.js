import $ from 'jquery';

function autoResize() {
    let textareas = $('textarea.md-input');
    let hiddenDiv = $('<div class="hiddenDiv"></div>');
    $('.editor').append(hiddenDiv);
    hiddenDiv.css({
        'display': 'none',
        'height': 'auto',
        'white-space': 'pre-wrap',
        'word-wrap': 'break-word',
        'min-height': textareas.eq(0).css('height'),
    })
    textareas.each(function() {
        $(this).on({
            input: function() {
                hiddenDiv.html($(this).val());
                $(this).css('height', hiddenDiv.css('height'));
            }
        })
    });
}

function keysBehaviours() {
    var tabLength = 4;
    $('.editor').on('keydown', 'textarea.md-input', function(e) {
        // capture Tab Key in textbox
        let keycode = e.keyCode | e.which;
        if (keycode == 9) {
            let st = $(this).prop('selectionStart');
            let en = $(this).prop('selectionEnd');
            e.preventDefault();
            $(this).val($(this).val().substr(0, st) + '    ' + $(this).val().substr(st));
            this.setSelectionRange(st+tabLength, st+tabLength);
        }
    })
}

export {autoResize, keysBehaviours};