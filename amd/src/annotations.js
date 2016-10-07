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
define(['jquery'], function($) {
    "use strict";
    function init() {
        $('ul.section li.activity > div').each(function() {
                $(this).append('<div class="annotations"><a href="#" class="btn">Annotations</a></div>');
            }
        );
        $('.annotations a.btn').click(function() {
            // jshint devel:true
            console.log($(this).closest('li.activity').attr('id'));
        });
    }
    return {
        init: init
    };
});