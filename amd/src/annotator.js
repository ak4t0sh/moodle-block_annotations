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
define(['jquery', 'jqueryui', 'core/ajax', 'core/str'],
    function ($, ui, ajax, str) {
        "use strict";
        var DIALOG_TITLE = "add or update my annotation";
        var DIALOG_EDIT_TEXT = 'edit';
        var DIALOG_CANCEL_TEXT = 'cancel';
        var VIEW_TEXT = 'view';
        var ADD_TEXT = 'add';
        var annotations;
        var dialog;

        function save() {
            var data = {
                mode: $('#block_annotations-form-mode').val(),
                objectid: $('#block_annotations-form-objectid').val(),
                objecttype: $('#block_annotations-form-objecttype').val(),
                text: $('#block_annotations-form-text').val(),
                courseid: $('#block_annotations-form-courseid').val()
            };

            if ($('#block_annotations-form-id').val() !== '') {
                data.id = $('#block_annotations-form-id').val();
            }
            var promises = ajax.call([
                {
                    methodname: 'block_annotations_annotate',
                    args: data
                }
            ]);
            promises[0].done(function (response) {
                $('#block_annotations-form-feedback').html('<div class="alert alert-success">Saved</div>');
                var annotationkey = response.objecttype + "_" + response.objectid;

                if (!(annotationkey in annotations)) {
                    annotations[annotationkey] = response;
                    $('#block_annotations-form-id').val(response.id);
                    $('#block_annotations-form-mode').val("edit");
                    // TODO in case of addition add data-id to corresponding btn
                }
                annotations[annotationkey].text = $('#block_annotations-form-text').val();
            }).fail(function () {
                    $('#block_annotations-form-feedback').html('<div class="alert alert-error">Failed !</div>');
                });
        }

        function add(element, type, id) {
            var existingid = "";
            var annotationkey = type + "_" + id;
            var buttontext = ADD_TEXT;
            if (annotationkey in annotations) {
                existingid = 'data-id="' + annotations[annotationkey].id + '"';
                buttontext = VIEW_TEXT;
            }
            element.append('<div class="annotations"><span data-objecttype="' + type + '" data-objectid="' +
                id + '" ' + existingid + ' class="btn">' + buttontext + '</span></div>');
        }

        function run() {
            $('.annotations span.btn').click(function () {
                var idattr = $(this).attr('data-id');
                if (typeof idattr !== typeof undefined && idattr !== false && 0 !== idattr.lenght) {
                    var annotationkey = $(this).attr('data-objecttype') + "_" + $(this).attr('data-objectid');
                    $('#block_annotations-form-id').val(idattr);
                    $('#block_annotations-form-text').val(annotations[annotationkey].text);
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

        function init(existingannotations, courseid) {
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

            // TODO move to a template if possible.
            $('body').append('<div id="block_annotations-form" title="' + DIALOG_TITLE + '">'
                + '<form>'
                + '<fieldset>'
                + '<input id="block_annotations-form-mode" type="hidden" name="mode" value=""/>'
                + '<input id="block_annotations-form-id" type="hidden" name="id" value=""/>'
                + '<input id="block_annotations-form-objectid" type="hidden" name="objectid" value=""/>'
                + '<input id="block_annotations-form-objecttype" type="hidden" name="objecttype" value=""/>'
                + '<input id="block_annotations-form-courseid" type="hidden" name="courseid" value="' + courseid + '"/>'
                + '<textarea name="text" id="block_annotations-form-text" ' +
                'class="text ui-widget-content ui-corner-all" style="width: 300px; height: 150px;"></textarea>'
                + '<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'
                + '</fieldset>'
                + '</form>'
                + '<div id="block_annotations-form-feedback"></div>'
                + '</div>');
            dialog = $('#block_annotations-form').dialog({
                autoOpen: false,
                height: 400,
                width: 350,
                modal: true,
                buttons: [
                    {
                        text: DIALOG_EDIT_TEXT,
                        click: save
                    },
                    {
                        text: DIALOG_CANCEL_TEXT,
                        click: function () {
                            dialog.dialog('close');
                        }
                    }
                ],
                close: function () {
                    dialog.find('form')[0].reset();
                    $('#block_annotations-form-text').val("");
                    $('#block_annotations-form-feedback').html("");
                }
            });
        }

        return {
            add: add,
            init: init,
            run: run
        };
    });
