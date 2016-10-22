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
 * Provides the {@link block_annotations_renderer} class.
 *
 * @package    block_annotations
 * @copyright  2016 Arnaud Trouvé <ak4t0sh@free.fr>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Output rendering class for the annotations block.
 *
 * @copyright  2016 Arnaud Trouvé <ak4t0sh@free.fr>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_annotations_renderer extends plugin_renderer_base {

    /**
     * Render the main content area of the block.
     *
     * @return string HTML
     */
    public function content_text() {
        return $this->render_from_template('block_annotations/main', []);
    }

    /**
     * Render the footer area of the block.
     *
     * @return string HTML
     */
    public function content_footer() {
        return '';
    }
}