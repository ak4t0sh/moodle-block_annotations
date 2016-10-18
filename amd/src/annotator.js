// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    block_annotations
 * @copyright  2016 Arnaud Trouvé <ak4t0sh@free.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module block_annotations/annotator
 */
define(['jquery', 'jqueryui','core/config', 'core/str', 'core/notification'], function($, ui, config, str, notification) {
    "use strict";
    var URL = config.wwwroot + '/blocks/annotations/annotate.php';
    var VIEW_TEXT = 'view';
    var ADD_TEXT = 'add';
    var SAVE_TEXT = 'save';
    var CANCEL_TEXT = 'cancel';
    var CLOSE_TEXT = 'close';
    var notes;
    var dialog;

    function save() {
        var promise = $.Deferred();
        var data = {
            mode: $('#block_annotations-form-mode').val(),
            id: $('#block_annotations-form-id').val(),
            objectid: $('#block_annotations-form-objectid').val(),
            objecttype: $('#block_annotations-form-objecttype').val(),
            text: $('#block_annotations-form-text').val(),
            courseid: $('#block_annotations-form-courseid').val(),
            sesskey: config.sesskey
        };
        var settings = {
            type: 'POST',
            dataType: 'json',
            data: data
        };

        $.ajax(URL, settings).done(function() {
            promise.resolve();
        });

        return promise;
    }
    function add(element, type, id) {
        var existingid = "";
        var annotationskey = type + "_" + id;
        var buttontext = ADD_TEXT;
        if (annotationskey in notes) {
            existingid = 'data-id="' + notes[annotationskey].id + '"';
            buttontext = VIEW_TEXT;
        }
        element.append('<div class="annotations"><span data-objecttype="' + type + '" data-objectid="' +
             id + '" ' + existingid + ' class="btn">' + buttontext + '</span></div>');
    }
    function run() {
        $('.annotations span.btn').click(function() {
            var idattr = $(this).attr('data-id');
            if (typeof idattr !== typeof undefined && idattr !== false && 0 !== idattr.lenght) {
                var annotationkey = $(this).attr('data-objecttype') + "_" + $(this).attr('data-objectid');
                $('#block_annotations-form-id').val(idattr);
                $('#block_annotations-form-text').val(notes[annotationkey].text);
                $('#block_annotations-form-mode').val("edit");
            }
            else {
                $('#block_annotations-form-mode').val("add");
            }
            $('#block_annotations-form-objectid').val($(this).attr('data-objectid'));
            $('#block_annotations-form-objecttype').val($(this).attr('data-objecttype'));
            dialog.dialog('open');
        });
    }
    function init(annotations, courseid) {
        notes = annotations;
        /*
         * Load required strings
         * TODO see why it does not work
         */
        str.get_string('view', 'block_annotations').done(function(s) {
            VIEW_TEXT = s;
        }).fail(notification.exception);

        str.get_string('save', 'block_annotations').done(function(s) {
            SAVE_TEXT = s;
        }).fail(SAVE_TEXT = 'save');
        str.get_string('cancel', 'block_annotations').done(function(s) {
            CANCEL_TEXT = s;
        }).fail(CANCEL_TEXT = 'cancel');
        str.get_string('close', 'block_annotations').done(function(s) {
            CLOSE_TEXT = s;
        }).fail(CLOSE_TEXT = 'close');

        // TODO move to a template if possible.
        $('body').append('<div id="block_annotations-form" title="Create annotation">'
    + '<form>'
    + '<fieldset>'
    + '<input id="block_annotations-form-mode" type="hidden" name="mode" value=""/>'
    + '<input id="block_annotations-form-id" type="hidden" name="id" value=""/>'
    + '<input id="block_annotations-form-objectid" type="hidden" name="objectid" value=""/>'
    + '<input id="block_annotations-form-objecttype" type="hidden" name="objecttype" value=""/>'
    + '<input id="block_annotations-form-courseid" type="hidden" name="courseid" value="' + courseid + '"/>'
    + '<label for="annotation">Annotation</label>'
    + '<textarea name="text" id="block_annotations-form-text" ' +
            'class="text ui-widget-content ui-corner-all" style="width: 300px; height: 150px;"></textarea>'
    + '<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'
    + '</fieldset>'
    + '</form>'
    + '</div>');
        dialog = $('#block_annotations-form').dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: [
                 {
                     text: SAVE_TEXT,
                     click: save
                 },
                {
                    text: CANCEL_TEXT,
                    click: function() {
                        dialog.dialog('close');
                    }
                }
            ],
            close: function() {
                dialog.find('form')[0].reset();
                $('#block_annotations-form-text').val("");
            }
        });
    }
    return {
        add: add,
        init: init,
        run: run
    };
});
