# Alt Tabs

Alt Tabs adds a **Tab** fieldtype to the Statamic control panel. Every field after a Tab field, up to the next Tab field, is grouped into that tab in the publish form.

## What it adds over Statamic's own tabs

Statamic 6 already has tabs and sections at blueprint level. Those organise a whole entry. Alt Tabs works one level down, in places where Statamic has no tabs of its own:

- inside Replicator sets
- inside Bard sets
- inside Grid rows (stacked mode)
- inside Group fields
- inside nested sets, where each set has its own tab bar

It also works in an ordinary blueprint section if you want tabs there without creating blueprint-level tabs. A long page builder set with twenty fields becomes four short tabs, so editors scan it rather than scroll it.

The Tab field stores no value. Adding or removing one never changes saved content.

## Requirements

- Statamic 6.40 or later (tested on 6.40.0)
- PHP 8.2 or later

Statamic 5 and earlier are not supported. The control panel component is a Vue 3 render function and the icons use the `ui-icon` component introduced in Statamic 6.

## Installation

```bash
composer require alt-design/alt-tabs
```

The control panel JavaScript and CSS are registered and published automatically. There is no configuration file and no build step.

## Usage

1. Open a blueprint or fieldset, or the field settings of a Replicator, Bard, Grid or Group field.
2. Add a field and choose the **Tab** fieldtype (under Special).
3. Give it a **Tab Label**. Optionally choose a **Placement** and an **Icon**.
4. Add the fields that belong in that tab after it. Add another Tab field to start the next tab.

### Example

A Replicator set called Hero with four tabs:

```
[Tab] Content    (placement: left, icon: pencil)
  heading        (text)
  subheading     (textarea)
  body           (markdown)
[Tab] Media      (icon: assets)
  image          (assets)
  alt            (text)
[Tab] Buttons    (icon: link)
  button_label   (text)
  button_url     (text)
[Tab] Layout     (icon: cog)
  align          (select)
  height         (select)
```

In YAML:

```yaml
hero:
  display: Hero
  fields:
    - { handle: t_content, field: { type: tab, label: Content, placement: left, icon: pencil } }
    - { handle: heading, field: { type: text } }
    - { handle: t_media, field: { type: tab, label: Media, icon: assets } }
    - { handle: image, field: { type: assets, max_files: 1 } }
```

Fields before the first Tab field stay visible above the tab bar.

### Options

| Option | Default | Description |
| --- | --- | --- |
| Tab Label | `Tab 1`, `Tab 2` and so on | The text on the tab button. |
| Placement | `left` | `top` or `left`. Read from the first Tab field in a group and applied to the whole bar. |
| Icon | none | The name of an icon that ships with Statamic, for example `cog` or `magnifying-glass`. A name that does not exist shows no icon. |

### Behaviour

- **Validation errors.** A tab that contains a field with a validation error shows a red dot, and a screen reader hears "Contains errors". If the open tab has no errors and another does, that tab opens when the errors appear.
- **Remembered tab.** The open tab is remembered for the browser session, per page and per set of tab labels. Rows or sets that share the same tab labels share the remembered tab.
- **Keyboard.** Tab buttons use the `tablist`, `tab` and `tabpanel` roles with a roving tabindex. Left and Right arrows move between tabs on a top bar, Up and Down on a left bar. Home and End jump to the first and last tab.
- **Dark theme.** Both the light and dark control panel themes are styled.

### Limitations

- **Grid table mode.** A table has one column per field, so there is nowhere to put tabs. Tab fields are hidden in table mode and the other columns show as normal. Use stacked mode for tabs.
- **Conditions on a Tab field.** Showing or hiding a Tab field with a field condition is not supported. Conditions on the fields inside a tab work as normal.
- **Mixed placement.** Placement is taken from the first Tab field in a group. Mixing `top` and `left` in one group is not supported.
- **Templates.** The Tab field augments to nothing and never appears in your templates.

## Licences and external services

Alt Tabs is MIT licensed. It ships no third-party code and makes no external requests. It is free.

## Support

Support is through GitHub issues: https://github.com/alt-design/Alt-Tabs-Addon/issues
