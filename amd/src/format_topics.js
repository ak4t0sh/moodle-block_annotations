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
 * @module block_annotations/format_topics
 */
define(['jquery', 'block_annotations/annotator'], function($, annotator) {
    "use strict";
    function init(annotations) {
        var courseid = $('body').attr();        // TODO
        annotator.init(annotations);
        $('ul.section li.activity > div').each(function() {
            annotator.add($(this), 'course_modules', $(this).closest('li.activity').attr('id').split('-')[1], courseid);
        });
        $('li.section[id^="section-"]').each(function() {
            annotator.add($(this), 'course_sections', $(this).attr('id').split('-')[1], courseid);
        });
        annotator.run();
    }
    return {
        init: init
    };
});