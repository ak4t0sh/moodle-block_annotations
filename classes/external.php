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
 * This is the external API for this tool.
 *
 * @package    block_annotations
 * @copyright  2016 Arnaud Trouvé <ak4t0sh@free.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_annotations;

defined('MOODLE_INTERNAL') || die();
require_once("$CFG->libdir/externallib.php");
require_once("$CFG->dirroot/blocks/annotations/lib.php");

use external_api;
use external_function_parameters;
use external_value;
use external_format_value;
use external_single_structure;
use external_multiple_structure;
use invalid_parameter_exception;

/**
 * This is the external API for this block.
 *
 * @copyright  2016 Arnaud Trouvé <ak4t0sh@free.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class external extends external_api {

    /**
     * Returns description of annotate() parameters.
     *
     * @return external_function_parameters
     */
    public static function annotate_parameters() {
        return new external_function_parameters (
            [
                'mode' => new external_value(PARAM_TEXT, 'Edition mode (add or edit)', VALUE_REQUIRED),
                'text' => new external_value(PARAM_TEXT, 'Annotation text', VALUE_REQUIRED),
                'id' => new external_value(PARAM_INT, 'Annotation id', VALUE_DEFAULT, 0),
                'courseid' => new external_value(PARAM_INT, 'Annotation courseid', VALUE_DEFAULT, 0),
                'objectid' => new external_value(PARAM_INT, 'Annotation objectid', VALUE_DEFAULT, -1),
                'objecttype' => new external_value(PARAM_TEXT, 'Annotation objecttype', VALUE_DEFAULT, ''),
            ]);
    }

    /**
     * Add or edit an annotation
     *
     * @param $mode
     * @param $text
     * @param int $id
     * @param int $courseid
     * @param $objectid
     * @param string $objecttype
     * @return array
     * @throws \invalid_parameter_exception
     */
    public static function annotate($mode, $text, $id=0, $courseid=0, $objectid=-1, $objecttype='') {
        global $USER;

        self::validate_parameters(self::annotate_parameters(),
                                           [
                                                'mode' => $mode,
                                                'text' => $text,
                                                'id' => $id,
                                                'courseid' => $courseid,
                                                'objectid' => $objectid,
                                                'objecttype' => $objecttype,
                                            ]);
        $annotation = false;
        if ($mode == "add") {
            if (empty($courseid)) {
                throw new invalid_parameter_exception("courseid is required to add an annotation");
            }
            if (empty($objectid)) {
                throw new invalid_parameter_exception("objectid is required to add an annotation");
            }
            if (empty($objecttype)) {
                throw new invalid_parameter_exception("objecttype is required to add an annotation");
            }
            $id = block_annotations_get_realobjectid($objectid, $objecttype, $courseid);
            if ($id === false) {
                throw new invalid_parameter_exception("objectid has an invalid value");
            }
            $annotation = block_annotations_add_annotation($USER->id, $courseid, $id, $objecttype, $text);
        } else if ($mode == "edit") {
            if (empty($id)) {
                throw new invalid_parameter_exception("id is required to add an annotation");
            }
            $annotation = block_annotations_edit_annotation($id, $text);
        }
        return [
                'id' => $annotation->id,
                'objectid' => $annotation->objectid,
                'objecttype' => $annotation->objecttype
            ];
    }
    /**
     * Returns description of annote() result value.
     *
     * @return external_multiple_structure
     */
    public static function annotate_returns() {
        return new external_single_structure(
            [
                'id' => new external_value(PARAM_INT, 'annotation record id'),
                'objectid' => new external_value(PARAM_INT, 'annotation record objectid'),
                'objecttype' => new external_value(PARAM_TEXT, 'annotation record objecttype')
            ]
        );
    }
}
