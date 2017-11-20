define(['jquery', 'core/str', 'core/modal_factory', 'core/notification'], function($, str, ModalFactory, Notification) {
    var DIALOG_TITLE = "add or update my annotation";
    var DIALOG_EDIT_TEXT = 'edit';
    var DIALOG_CANCEL_TEXT = 'cancel';
    var VIEW_TEXT = 'view';
    var ADD_TEXT = 'add';
    var annotations;
    return {
        add: function (element, type, id) {
            var existingid = "";
            var annotationkey = type + "_" + id;
            var buttontext = str['add'];
            if (annotationkey in annotations) {
                existingid = 'data-id="' + annotations[annotationkey].id + '"';
                buttontext = str['view'];
            }
            element.append('<div class="annotations"><span data-objecttype="' + type + '" data-objectid="'
                + id + '" ' + existingid + ' class="btn">' + buttontext + '</span></div>');
            var trigger = $('.annotations span.btn[data-objecttype="' + type + '"][data-objectid="' + id + '"]');
            var content= '';
            if (typeof annotations[annotationkey] !== typeof undefined){
                content = annotations[annotationkey].text;
            }
            ModalFactory.create({
                type: ModalFactory.types.SAVE_CANCEL,
                title: str['dialog_title'],
                body: '<p>'+content+'</p>',
            }, trigger)
                .done(function(modal) {
                    // Do what you want with your new modal.
                });
        },
        init: function (existingannotations, courseid) {
            annotations = existingannotations;
            /*
             * Load required strings
             * TODO see why it does not work
             */
            str.get_strings([
                {key: 'add'},
                {key: 'view'},
                {key: 'edit'},
                {key: 'cancel'},
                {key: 'dialog_title', component: 'block_annotations'}
            ]).done(function (s) {
                ADD_TEXT = s[0];
                VIEW_TEXT = s[1];
                DIALOG_EDIT_TEXT = s[2];
                DIALOG_CANCEL_TEXT = s[3];
                DIALOG_TITLE = s[4];
            });
        },
        run: function () {
            // TODO
        }
    }
});