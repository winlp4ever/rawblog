import $ from 'jquery';

function autoResize() {
    let textareas = $('.comment textarea.enter-comment');
    let hiddenDiv = $('<span class="hiddenDiv"></span>');
    $('.comment').append(hiddenDiv);
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

export { autoResize };