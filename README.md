# Alt Tabs

> Tabs inside Replicator, Bard, Grid and Group fields, so long page builder sets are easy to scan.

Statamic 6 has tabs at blueprint level, but once you are inside a page builder set, a Grid row or a Group, every field sits in one long list. Alt Tabs adds a **Tab** fieldtype: drop one in, and every field after it, up to the next Tab, becomes a tab. It is inspired by the [ACF Tab field](https://www.advancedcustomfields.com/resources/tab/) for WordPress.

## Features

- Works inside Replicator sets, Bard sets, Grid rows (stacked mode), Group fields and nested sets, as well as ordinary blueprint sections
- Stores no value, so adding or removing a Tab never touches your content
- Tabs along the top or down the left, each with an optional icon
- Remembers the open tab for the browser session
- Marks a tab that holds a validation error, and opens it when the errors appear
- Works from the keyboard, with `tablist`, `tab` and `tabpanel` roles and arrow-key navigation
- Styled for the light and dark control panel themes
- No config file and no build step

## Requirements

- Statamic 6.40 or later (tested on 6.40.0)
- PHP 8.2 or later

Statamic 5 and earlier are not supported. The control panel component is a Vue 3 render function and the icons use the `ui-icon` component introduced in Statamic 6.

## How to Install

Run the following command from your project root:

``` bash
composer require alt-design/alt-tabs
```

The control panel JavaScript and CSS are registered and published automatically.

## Basic usage

1. Open a blueprint or fieldset, or the field settings of a Replicator, Bard, Grid or Group field.
2. Add a field and choose the **Tab** fieldtype (under Special).
3. Give it a **Tab Label**, and optionally a **Placement** and an **Icon**.
4. Add the fields that belong in that tab after it. Add another Tab field to start the next tab.

A Replicator set called Hero with four tabs:

```
[Tab] Content    (placement: left, icon: pencil)
  heading        (text)
  subheading     (textarea)
[Tab] Media      (icon: assets)
  image          (assets)
[Tab] Buttons    (icon: link)
  button_label   (text)
  button_url     (text)
[Tab] Layout     (icon: cog)
  align          (select)
```

Fields before the first Tab field stay visible above the tab bar. In a Grid, use stacked mode: table mode has one column per field and nowhere to put tabs, so Tab fields are hidden there.

## Options

| Option | Default | Description |
| --- | --- | --- |
| Tab Label | `Tab 1`, `Tab 2` and so on | The text on the tab button |
| Placement | `left` | `top` or `left`. Read from the first Tab field in a group and applied to the whole bar |
| Icon | none | The name of an icon that ships with Statamic, such as `cog` or `magnifying-glass`. A name that does not exist shows no icon |

## Keyboard

With a tab button focused:

| Key | Action |
| --- | --- |
| Left and Right arrows | Previous and next tab, when the bar is along the top |
| Up and Down arrows | Previous and next tab, when the bar is down the left |
| Home and End | First and last tab |

## Limitations

- Grid table mode has no room for tabs, so Tab fields are hidden there.
- A field condition on the Tab field itself is not supported. Conditions on the fields inside a tab work as normal.
- A tab whose fields are all hidden by conditions still shows its button.
- Mixing `top` and `left` placement in one group is not supported.

## How it works

The Tab fieldtype stores `null` and renders an invisible marker into the publish form. A small script in the control panel finds those markers, works out which fields belong to each one, builds a tab bar and hides the fields of the tabs that are not open. Because it works on the rendered form rather than the blueprint, it works anywhere Statamic renders a list of fields, including nested sets. When Statamic re-renders a set's fields, for example when a row is added or a condition changes, the tab bar is rebuilt.

The addon ships no third-party code and makes no external requests.

## Documentation

[DOCUMENTATION.md](DOCUMENTATION.md) has the full guide, including a YAML example. Changes are listed in [CHANGELOG.md](CHANGELOG.md).

## Testing

``` bash
composer install
./vendor/bin/phpunit
```

## Questions etc

Drop us a big shout-out if you have any questions, comments, or concerns. We're always looking to improve our addons, so if you have any feature requests, we'd love to hear them.

Bug reports and support requests go to [GitHub issues](https://github.com/alt-design/Alt-Tabs-Addon/issues).

### Starter Kits
- [Alt Starter Kit](https://statamic.com/starter-kits/alt-design/alt-starter-kit)

### Addons
- [Alt Admin Bar Addon](https://github.com/alt-design/Alt-Admin-Bar-Addon)
- [Alt AI Addon](https://github.com/alt-design/Alt-AI-Addon)
- [Alt Akismet Addon](https://github.com/alt-design/Alt-Akismet-Addon)
- [Alt Cookies Addon](https://github.com/alt-design/Alt-Cookies-Addon)
- [Alt Google 2FA Addon](https://github.com/alt-design/Alt-Google-2fa-Addon)
- [Alt Google Maps Addon](https://github.com/alt-design/Alt-google-maps-addon)
- [Alt Inbound Addon](https://github.com/alt-design/Alt-Inbound-Addon)
- [Alt Live Editor Addon](https://github.com/alt-design/Alt-Live-Editor-Addon)
- [Alt Password Protect Addon](https://github.com/alt-design/Alt-Password-Protect-Addon)
- [Alt Redirect Addon](https://github.com/alt-design/Alt-Redirect-Addon)
- [Alt SEO Addon](https://github.com/alt-design/Alt-SEO-Addon)
- [Alt Sitemap Addon](https://github.com/alt-design/Alt-Sitemap-Addon)
- [Alt Tabs Addon](https://github.com/alt-design/Alt-Tabs-Addon)
- [RiffRaff Addon](https://github.com/alt-design/Alt-RiffRaff-Addon)

## Licence

MIT, copyright Alt Design Ltd. See [LICENSE](LICENSE).

## Postcardware

Send us a postcard from your hometown if you like this addon. We love getting mail from other cool peeps!

Alt Design  
St Helens House  
Derby  
DE1 3EE  
UK
