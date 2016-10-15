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
 * @module block_annotations/annotations
 */
define(['jquery', 'jqueryui','core/config', 'core/str', 'core/notification'], function($, ui, config, str, notification) {
    "use strict";
    var URL = config.wwwroot + '/block/annotations/test.php';
    var BUTTON_TEXT="";
    var SAVE_TEXT="";
    var CANCEL_TEXT="";
    var CLOSE_TEXT="";
    var dialog;
    function save() {
        // jshint devel:true
        console.log(URL);
    }
    function init(annotations) {
        // jshint devel:true
        console.log(annotations);
        str.get_string('view', 'block_annotations').done(function(s) {
            BUTTON_TEXT=s;
        }).fail(notification.exception);

        str.get_string('save').done(function(s) {
            SAVE_TEXT=s;
        }).fail(SAVE_TEXT="Save");
        str.get_string('cancel').done(function(s) {
            CANCEL_TEXT=s;
        }).fail(CANCEL_TEXT="Cancel");
        str.get_string('close').done(function(s) {
            CLOSE_TEXT=s;
        }).fail(CLOSE_TEXT="close");
        $('body').append('<div id="block_annotations-addform" title="Create annotation">'
    +'<form>'
    +'<fieldset>'
    +'<label for="annotation">Annotation</label>'
    +'<textarea name="annotation" id="annotation-textarea" ' +
            'class="text ui-widget-content ui-corner-all" style="width: 300px; height: 150px;"></textarea>'
    +'<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'
    +'</fieldset>'
    +'</form>'
    +'</div>');
        dialog = $( "#block_annotations-addform" ).dialog({
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
                        dialog.dialog( "close" );
                    }
                }
            ],
            close: function() {
                dialog.find('form')[0].reset();
            }
        });
        $('ul.section li.activity > div').each(function() {
                $(this).append('<div class="annotations"><span data-object-type="course_modules" data-object-id="'+
                    $(this).attr('id')+'" class="btn">'+BUTTON_TEXT+'</span></div>');
        });
        $('li.section[id^="section-"]').each(function() {
                $(this).prepend('<div class="annotations"><span data-object-type="course_sections" data-object-id="'+
                    $(this).attr('id')+'" data-object-course="TODO" class="btn">'+BUTTON_TEXT+'</span></div>');
        });
        $('.annotations span.btn').click(function() {
            dialog.dialog("open");
            // jshint devel:true
            console.log($(this).attr('data-href'));
        });
    }
    return {
        init: init
    };
});