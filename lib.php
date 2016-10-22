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
 * Find annotations for given user and course
 *
 * @param int $userid
 * @param int $courseid
 * @return array
 */
function block_annotations_get_annotations($userid, $courseid) {
    global $DB;
    $cached = cache::make('block_annotations', 'annotations');
    $userannotations = $cached->get('user_' . $userid);
    $courseannotations = $cached->get('course_' . $courseid);

    if (($userannotations !== false) && ($courseannotations !== false)) {
        return $cached->get_many(array_intersect($userannotations, $courseannotations));
    }

    $annotations = $DB->get_records('block_annotations', ['userid' => $userid, 'courseid' => $courseid]);
    foreach ($annotations as $annotation) {
        block_annotations_set_to_cache($annotation);
    }
    return $annotations;
}
/**
 * Find annotations for given user and course
 * And process the result to be used by JavaScript
 *
 * @param int $userid
 * @param int $courseid
 * @return array
 */
function block_annotations_get_annotations_for_page($userid, $courseid) {
    $annotations = [];
    foreach (block_annotations_get_annotations($userid, $courseid) as $annotation) {
        $annotation->objectid = block_annotations_buildfakeobjectid($annotation);
        $annotations[$annotation->objecttype . '_' . $annotation->objectid] = $annotation;
    }
    return $annotations;
}
/**
 * Add an annotation
 *
 * @param int $userid
 * @param int $courseid
 * @param int $objectid
 * @param string $objecttype
 * @param string $text
 * @return stdClass
 */
function block_annotations_add_annotation($userid, $courseid, $objectid, $objecttype, $text) {
    global $DB;
    $annotation = new stdClass();
    $annotation->userid = $userid;
    $annotation->courseid = $courseid;
    $annotation->objectid = $objectid;
    $annotation->objecttype = $objecttype;
    $annotation->text = $text;
    $annotation->timecreated = time();
    $annotation->id = $DB->insert_record('block_annotations', $annotation);
    return $annotation;
}
/**
 * Update an annotation
 *
 * @param int $id
 * @param string $text
 * @return stdClass $annotation
 */
function block_annotations_edit_annotation($id , $text) {
    global $DB;
    $annotation = $DB->get_record('block_annotations', ['id' => $id], '*', MUST_EXIST);
    $annotation->text = $text;
    $annotation->timemodified = time();
    $DB->update_record('block_annotations', $annotation);
    return $annotation;
}
/**
 * Delete an annotation entry
 *
 * @param stdClass $annotation
 * @return bool true
 */
function block_annotations_delete_annotation($annotation) {
    global $DB;

    // TODO : move cache management to another function.
    $cached = cache::make('block_annotations', 'annotations');
    if (!$cached->delete($annotation->id)) {
        return false;
    }

    $DB->delete_records('block_annotations', ['id' => $annotation->id]);
    return true;
}
/**
 * Add or update an annotation into cache
 * @param stdClass $annotation
 * @return bool
 */
function block_annotations_set_to_cache($annotation) {

    $cached = cache::make('block_annotations', 'annotations');

    // Get user cache.
    if (($usercache = $cached->get('user_'.$annotation->userid)) === false) {
        $usercache = [];
    }
    $usercache[] = $annotation->id;

    // Get course cache.
    if (($coursecache = $cached->get('course_'.$annotation->userid)) === false) {
        $coursecache = [];
    }
    $coursecache[] = $annotation->id;

    // Set caches.
    $result = $cached->set_many([
        $annotation->id => $annotation,
        'user_'.$annotation->userid => $usercache,
        'course_'.$annotation->userid => $coursecache,
    ]);

    // On fail clear all entries to keep consistent cache.
    if ($result !== 3) {
        $cached->delete_many(
            $annotation->id,
            'user_'.$annotation->userid,
            'course_'.$annotation->courseid
        );
        return false;
    }
    return true;
}
/**
 * This function aims to retrieve real course_section id
 * as we do not have this data into html source
 *
 * @param int $objectid
 * @param int $objecttype
 * @param int $courseid
 * @return int $id
 */
function block_annotations_get_realobjectid($objectid, $objecttype, $courseid) {
    global $DB;
    if ($objecttype == 'course_sections') {
        return $DB->get_field('course_sections', 'id', ['course' => $courseid, 'section' => $objectid]);
    }
    return $objectid;
}
/**
 * Return the "local" id for an object.
 * Mainly useful for course_section
 *
 * @param stdClass $annotation
 * @return int
 */
function block_annotations_buildfakeobjectid($annotation) {
    global $DB;
    if ($annotation->objecttype == 'course_sections') {
        return $DB->get_field('course_sections', 'section', ['id' => $annotation->objectid]);
    }
    return $annotation->objectid;
}
/**
 * Return a list of supported course_format
 *
 * @return array
 */
function block_annotations_get_available_amd_by_format() {
    return [
      'topics' => 'block_annotations/format_topics'
    ];
}
/**
 * Return which AMD module to use for a given course_format
 *
 * @param stdClass $course
 * @return string
 */
function block_annotations_resolve_amd($course) {
    return block_annotations_get_available_amd_by_format()[$course->format];
}