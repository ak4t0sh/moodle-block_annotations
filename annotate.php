<?php
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
/**
 * Insert or update annotation corresponding to given parameters
 * to page from an AJAX call
 *
 * @package    block_annotations
 * @copyright  2016 Arnaud Trouvé <ak4t0sh@free.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define('AJAX_SCRIPT', true);
require_once(__DIR__ . '/../../config.php');
require_once(__DIR__ . '/lib.php');

// This should be accessed by only valid logged in user.
require_login(null, false);
require_sesskey();

$mode = required_param('mode', PARAM_TEXT);
$text = required_param('text', PARAM_TEXT);

// Start capturing output in case of broken plugins.
ajax_capture_output();

$PAGE->set_context(context_system::instance());
$PAGE->set_url('/block/annotations/annotate.php');

$annotation = false;
switch ($mode) {
    case "add" :
        $objectid = required_param('objectid', PARAM_INT);
        $type = required_param('objecttype', PARAM_TEXT);
        $courseid = required_param('courseid', PARAM_INT);

        $id = block_annotations_get_realobjectid($objectid, $type, $courseid);
        if ($id === false) {
            throw Exception("Invalid objectid");
        }
        $annotation = block_annotations_add_annotation($USER->id, $id, $type, $text);
        break;
    case "edit" :
        $id = required_param('id', PARAM_INT);
        $annotation = block_annotations_edit_annotation($id, $text);
        break;
    default :
        throw new Exception("Invalid mode value");
}
if ($annotation !== false) {
    block_annotations_set_to_cache($annotation);
}
ajax_check_captured_output();
echo json_encode($annotation);