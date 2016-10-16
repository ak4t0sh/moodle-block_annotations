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
    var BUTTON_TEXT='';
    var SAVE_TEXT='';
    var CANCEL_TEXT='';
    var CLOSE_TEXT='';
    var notes='';
    var dialog;

    str.get_string('view', 'block_annotations').done(function(s) {
        BUTTON_TEXT=s;
    }).fail(notification.exception);

    str.get_string('save').done(function(s) {
        SAVE_TEXT=s;
    }).fail(SAVE_TEXT='save');
    str.get_string('cancel').done(function(s) {
        CANCEL_TEXT=s;
    }).fail(CANCEL_TEXT='cancel');
    str.get_string('close').done(function(s) {
        CLOSE_TEXT=s;
    }).fail(CLOSE_TEXT='close');

    function save() {
        var promise = $.Deferred();
        var data = {
            objectid: $('#block_annotations-addform-objectid').val(),
            objecttable: $('#block_annotations-addform-objecttable').val(),
            courseid: $('#block_annotations-addform-courseid').val(),
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
    function add(element, type, id, courseid) {
        var courseattr = '';
        if (typeof courseid !== "undefined" && courseid !== null) {
            courseattr = 'data-courseid="'+courseid+'"';
        }
        // TODO if an annotation already exists add its id in data-id attr
        element.append('<div class="annotations"><span data-objecttype="'+type+'" data-objectid="'+
            id +'" '+courseattr+' class="btn">'+BUTTON_TEXT+'</span></div>');
    }
    function run() {
        $('.annotations span.btn').click(function() {
            $('#block_annotations-addform-objectid').val($(this).attr('data-objectid'));
            $('#block_annotations-addform-objecttable').val($(this).attr('data-objecttype'));
            dialog.dialog('open');
        });
    }
    function init(annotations) {
        notes = annotations;
        // jshint devel:true
        console.log(annotations);
        $('body').append('<div id="block_annotations-addform" title="Create annotation">'
    +'<form>'
    +'<fieldset>'
    + '<input id="block_annotations-addform-objectid" type="hidden" name="objectid" value=""/>'
    + '<input id="block_annotations-addform-objecttable" type="hidden" name="objecttable" value=""/>'
    + '<input id="block_annotations-addform-courseid" type="hidden" name="courseid" value=""/>'
    +'<label for="annotation">Annotation</label>'
    +'<textarea name="annotation" id="annotation-textarea" ' +
            'class="text ui-widget-content ui-corner-all" style="width: 300px; height: 150px;"></textarea>'
    +'<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'
    +'</fieldset>'
    +'</form>'
    +'</div>');
        dialog = $('#block_annotations-addform').dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: [
                 {
                     text:SAVE_TEXT,
                     click:save
                 },
                {
                    text:CANCEL_TEXT,
                    click:function() {
                        dialog.dialog('close');
                    }
                }
            ],
            close: function() {
                dialog.find('form')[0].reset();
            }
        });
    }
    return {
        add: add,
        init: init,
        run:run
    };
});
