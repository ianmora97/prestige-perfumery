/**
 * 
 * @param {String} name of the selector id
 * @param {String} fb feedback message selector id
 * @param {Int} len lenght of the string that shoyld be checked
 * @param {Object} is the object that checks if some function should execute 
 * @param {Function} fun callback function to execute if the condition is true 
 */
export function onKeyUp(name, fb, len, is, fun) {
    $(`#${name}`).on('keyup', function (e) {
        var t = $(`#${name}`).val();
        if (t.length >= len) {
            if (is.name) $(`#${name}`).removeClass("is-invalid");
            if (is.fb) $(`#${fb}`).empty();
        }
        if (e.keyCode === 13) if (fun) fun();
    });
}
