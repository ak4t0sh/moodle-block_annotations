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
 * Handles displaying the annotation block.
 *
 * @package    block_annotations
 * @copyright  2016 Arnaud Trouvé <ak4t0sh@free.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_annotations extends block_base {
    /**
     * Initialise the block.
     */
    public function init() {
        $this->title = get_string('pluginname', 'block_annotations');
    }
    /**
     * All multiple instances of this block
     * @return bool Returns false
     */
    function instance_allow_multiple() {
        return false;
    }
    /**
     * Gets required Javascript
     */
    function get_required_javascript() {
        global $USER;
        parent::get_required_javascript();
        $annotations = [];
        if ($this->page->course->id > 1 ) {
            $annotations = block_annotations_get_annotations($USER->id, $this->page->course->id);
        }
        $this->page->requires->js_call_amd('block_annotations/annotations', 'init', $annotations);
    }
    /**
     * Return the content of this block.
     *
     * @return stdClass the content
     */
    public function get_content() {
        if ($this->content !== null) {
            return $this->content;
        }
        $this->page->requires->css('/lib/jquery/ui-1.11.4/jquery-ui.min.css');
        $this->content = new stdClass();
        $this->content->text = 'test';
        $this->content->footer = '';

        return $this->content;
    }
}
