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
 * Return annotations corresponding to given parameters
 * to page from an AJAX call
 *
 * @package    block_annotations
 * @copyright  2016 Arnaud Trouvé <ak4t0sh@free.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define('AJAX_SCRIPT', true);
require_once(__DIR__ . '/../../config.php');

// This should be accessed by only valid logged in user.
require_login(null, false);
$type = required_param('type', PARAM_INT);
$id = required_param('id', PARAM_INT);
$courseid = optional_param('courseid', 0, PARAM_INT);

// Start capturing output in case of broken plugins.
ajax_capture_output();

$params = ['type' => $type, 'id' => $id];
if ($courseid)
    $params['courseid'] = $courseid;

$PAGE->set_context(context_system::instance());
$PAGE->set_url('/block/annotations/get_annotation.php', $params);

$annotation = false;
$id = block_annotations_get_realobjectid($id, $type, $courseid);
if ($id !== false)
    $annotation = block_annotations_get_annotation($USER->id, $id, $type);

ajax_check_captured_output();
echo json_encode($annotation);
