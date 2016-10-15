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
 * The annotations block functions
 *
 * @package    block_annotations
 * @copyright  2016 Arnaud Trouvé <ak4t0sh@free.fr>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * @param $userid
 * @param int $objectid
 * @param int $objecttype
 * @return false|stdClass
 */
function block_annotations_get_annotation($userid, $objectid, $objecttype) {
    global $DB;
    $fakeannotation = new stdClass();
    $fakeannotation->userid = $userid;
    $fakeannotation->objectid = $objectid;
    $fakeannotation->objecttable = $objecttype;
    $key = block_annotations_build_cache_key($fakeannotation);

    $cached = cache::make('block_annotations', 'annotations');
    if ($key && $cached->has($key))
        return $cached->get($key);

    $annotation = $DB->get_record('block_annotations', [
        'user' => $userid,
        'objectid' => $objectid,
        'objecttable' => $objecttype
    ]);
    block_annotations_set_to_cache($annotation);
    return $annotation;
}

function block_annotations_get_annotations($userid, $courseid=0) {
    global $DB;
    // TODO
    return [];
}

/**
 * @param $userid
 * @param $objectid
 * @param $objecttype
 * @param $description
 * @param $courseid
 * @return stdClass
 */
function block_annotations_add_annotation($userid, $objectid, $objecttype, $description, $courseid) {
    global $DB;
    $annotation = new stdClass();
    $annotation->userid = $userid;
    $annotation->objectid = $objectid;
    $annotation->objecttable = $objecttype;
    $annotation->description = $description;
    $annotation->timecreated = time();
    $annotation->id = $DB->insert_record('block_annotations', $annotation);
    return $annotation;
}
/**
 * @param $id
 * @param string $description
 * @return stdClass $annotation
 */
function block_annotations_edit_annotation($id , $description='') {
    global $DB;
    $annotation = $DB->get_record('block_annotations', ['id' => $id], '*', MUST_EXIST);
    $annotation->description = $description;
    $annotation->timemodified = time();
    $DB->update_record('block_annotations', $annotation);
    return $annotation;
}
/**
 * Delete and annotation entry
 *
 * @param stdClass $annotation
 * @return bool true
 */
function block_annotations_delete_annotation($annotation) {
    global $DB;
    $cached = cache::make('block_annotations', 'annotations');
    $key = block_annotations_build_cache_key($annotation);
    if ($key && $cached->has($key))
        $cached->delete($key);
    $DB->delete_records('block_annotations', ['id' => $annotation->id]);
    return true;
}
/**
 * Build associate cache key for an annotation
 *
 * @param stdClass $annotation
 * @return string
 */
function block_annotations_build_cache_key($annotation) {
    return $annotation->userid.'_'.$annotation->objecttable.'_'.$annotation->objectid;
}
/**
 * Add or update an annotation into cache
 * @param stdClass $annotation
 * @return bool
 */
function block_annotations_set_to_cache($annotation) {
    $cached = cache::make('block_annotations', 'annotations');
    return $cached->set(block_annotations_build_cache_key($annotation), $annotation);
}
/**
 * This function aims to retrieve real course_section id
 * as we do not have this data into html source
 *
 * @param int $objectid
 * @param int $objecttable
 * @param int $courseid
 * @return int $id
 */
function block_annotations_get_realobjectid($objectid, $objecttable, $courseid) {
    global $DB;
    if ($objecttable == 'course_sections') {
        $objectid = $DB->get_field('course_sections', 'id', ['course' => $courseid, 'section' => $objectid]);
    }
    return $objectid;
}
