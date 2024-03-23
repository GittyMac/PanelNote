/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

// Inspired by the macOS app 'One Thing'
// Extension uses elements from 'Just Another Search Bar' (https://extensions.gnome.org/extension/5522/just-another-search-bar/)

import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init(settings) {
            super._init(0.0, _('Panel Note'));

            /* ------------------------------- Panel Note ------------------------------- */
            let noteInPanel = new St.Label({
                text: settings.get_string('note'),
                y_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });
            this.add_child(noteInPanel);


            /* ----------------------------- Note Entry Box ----------------------------- */
            this.entry = new St.Entry({
                text: settings.get_string('note'),
                can_focus: true,
                track_hover: true
            });

            this.entry.set_primary_icon(new St.Icon({
                icon_name: 'document-edit-symbolic',
                style_class: 'popup-menu-icon',
            }));

            this.entry.clutter_text.connect('text-changed', () => {
                let text = this.entry.get_text();
                if (text == "")
                    text = "No Note";
                settings.set_string('note', text);
                noteInPanel.text = text;
            });

            let popupEdit = new PopupMenu.PopupMenuSection();
            popupEdit.actor.add_child(this.entry);

            this.menu.addMenuItem(popupEdit);
            this.menu.actor.add_style_class_name('note-entry');
        }
    });

export default class IndicatorExampleExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._indicator = new Indicator(this._settings);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.entry.disconnect();
        this._indicator.destroy();
        this._indicator = null;
        this._settings = null;
    }
}
