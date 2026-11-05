# Alt Tabs Addon

A Statamic fieldtype that splits the fields after it into named tabs, inspired by the [ACF Tab field](https://www.advancedcustomfields.com/resources/tab/) for WordPress.

Statamic 6 already has tabs and sections at blueprint level. This addon adds tabs **inside** Replicator sets, Bard sets, Grid rows and Groups, where Statamic has none.

## Features

- Drop a `Tab` field into a blueprint; following fields become a tab
- Works inside regular blueprint sections, Replicator sets, Bard sets, stacked Grid rows, Group fields, and nested sets
- Stores no value purely an organisational element in the CP
- Configurable label, optional icon and top / left placement
- Remembers the open tab for the browser session, per page and per set of tab labels
- Marks tabs that contain validation errors and opens the first one when errors appear
- Light and dark control panel themes
- Keyboard accessible proper `tablist` / `tab` / `tabpanel` roles and arrow-key navigation
- No build step required ships as plain JS / CSS for the Statamic control panel

## Requirements

- Statamic **6.40** or later (tested on 6.40.0)
- PHP 8.2+

> Statamic 4 and 5 are not supported. The control panel fieldtype is a Vue 3 render
> function, and the icon support relies on the `ui-icon` component introduced in 6.

## Installation

```bash
composer require alt-design/alt-tabs
```

The control panel JS and CSS are registered automatically. You only need to publish
assets if you want them copied into `public/vendor/alt-tabs` ahead of time:

```bash
php artisan vendor:publish --tag=alt-tabs
```

## Usage

In your blueprint, add a field with type `tab`. Give it a `Tab Label`. Any fields placed **after** that Tab field in the same section / set / group will appear under that tab in the publish form, up until the next Tab field.

### Example

A blueprint section with three Tab fields:

```
[Tab] "General"
  - title          (text)
  - intro          (textarea)
[Tab] "SEO"
  - meta_title     (text)
  - meta_desc      (textarea)
[Tab] "Advanced"
  - custom_class   (text)
```

The publish form will show three tab buttons: **General**, **SEO**, **Advanced**. The corresponding fields are shown/hidden as you click each tab.

### Inside Replicator / Bard / Page Builder sets

The same pattern works inside a Replicator or Bard set. This is the primary use case for page builders long sets become much easier to scan when split into a few tabs.

### Inside Grid

Drop a Tab field into a Grid field's fields list. Each row gets its own tab UI. This needs stacked mode: in table mode there is one column per field, so Tab fields are hidden and the other columns show as normal.

## Configuration

| Option | Default | Description |
| --- | --- | --- |
| `label` | | The tab's display name. Falls back to `Tab 1`, `Tab 2`… if left blank. |
| `placement` | `left` | `top` or `left` where the tab buttons render. |
| `icon` | | Optional Statamic icon name shown on the tab button (e.g. `cog`, `magnifying-glass`). A name that does not exist shows no icon.. |

`placement` is read from the **first** Tab field in a group and applied to the whole tab
bar mixing `top` and `left` within one section isn't supported.

## Keyboard navigation

With a tab button focused:

| Key | Action |
| --- | --- |
| `←` / `→` | Previous / next tab (when `placement` is `top`) |
| `↑` / `↓` | Previous / next tab (when `placement` is `left`) |
| `Home` / `End` | First / last tab |

## Validation errors

A tab holding a field with a validation error gets a red dot and a visually hidden "Contains errors" label. When errors appear and the open tab has none, the first tab with an error opens. A Tab field inside a Replicator set that sits inside a hidden tab works the same way, one level at a time.

## Limitations

- Grid table mode has no room for tabs, so Tab fields are hidden there.
- A field condition on the Tab field itself is not supported. Conditions on the fields inside a tab work as normal.
- A tab whose fields are all hidden by conditions still shows its button.

## Stored value

None. The Tab fieldtype stores `null` and is skipped during processing, as a pure
organisational marker. Removing a Tab field from a blueprint never touches your content.

## How it works

The fieldtype renders an invisible marker element into the publish form. A small vanilla-JS
pass in the control panel finds those markers, works out which sibling field wrappers belong
to each one, builds a tab bar, and toggles a `display: none` class as you switch tabs. Because
it operates on the rendered DOM rather than the blueprint schema, it works anywhere Statamic
renders a field list including inside nested sets it knows nothing about.

If Statamic re-renders a set's fields in place (adding a row, a condition toggling), the
markers are re-detected and the tab bar rebuilt automatically.

## Licence

MIT, copyright Alt Design Ltd. Support is through [GitHub issues](https://github.com/alt-design/Alt-Tabs-Addon/issues).
