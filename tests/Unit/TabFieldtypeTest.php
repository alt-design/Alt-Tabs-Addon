<?php

namespace AltDesign\AltTabsAddon\Tests\Unit;

use AltDesign\AltTabsAddon\Fieldtypes\Tab;
use AltDesign\AltTabsAddon\Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Statamic\Fields\Field;
use Statamic\Fields\FieldtypeRepository;

class TabFieldtypeTest extends TestCase
{
    private function fieldtype(array $config = []): Tab
    {
        $field = new Field('my_tab', array_merge(['type' => 'tab'], $config));

        return (new Tab)->setField($field);
    }

    #[Test]
    public function it_registers_under_the_tab_handle()
    {
        // The CP resolves the Vue component by handle ("tab" -> "tab-fieldtype"),
        // so the handle is part of the addon's contract with cp.js.
        $this->assertSame('tab', Tab::handle());
        $this->assertInstanceOf(Tab::class, app(FieldtypeRepository::class)->find('tab'));
    }

    #[Test]
    public function it_never_stores_a_value()
    {
        $fieldtype = $this->fieldtype(['label' => 'General']);

        // Whatever arrives from the publish form is discarded on the way in and out.
        $this->assertNull($fieldtype->process('anything'));
        $this->assertNull($fieldtype->preProcess('anything'));
        $this->assertNull($fieldtype->emptyValue());
    }

    #[Test]
    public function it_augments_to_null_so_templates_never_render_it()
    {
        $this->assertNull($this->fieldtype(['label' => 'General'])->augment('anything'));
    }

    #[Test]
    public function it_preloads_the_config_the_cp_component_needs()
    {
        $preload = $this->fieldtype([
            'label' => 'SEO',
            'placement' => 'top',
            'icon' => 'magnifying-glass',
        ])->preload();

        $this->assertSame([
            'label' => 'SEO',
            'placement' => 'top',
            'icon' => 'magnifying-glass',
        ], $preload);
    }

    #[Test]
    public function it_defaults_placement_to_left()
    {
        $this->assertSame('left', $this->fieldtype(['label' => 'General'])->preload()['placement']);
    }

    #[Test]
    public function it_shows_the_label_in_listing_columns()
    {
        $this->assertSame('General', $this->fieldtype(['label' => 'General'])->preProcessIndex('ignored'));
    }

    #[Test]
    public function it_uses_an_icon_that_ships_with_statamic()
    {
        // ui-icon resolves the default set from resources/svg/icons. A name that isn't
        // in there renders nothing at all, silently, so pin it with a test.
        $icon = $this->fieldtype()->icon();

        $this->assertFileExists(statamic_path("resources/svg/icons/{$icon}.svg"));
    }

    #[Test]
    public function it_exposes_label_placement_and_icon_config_fields()
    {
        $handles = (new Tab)->configFields()->all()->keys()->all();

        $this->assertContains('label', $handles);
        $this->assertContains('placement', $handles);
        $this->assertContains('icon', $handles);
    }

    #[Test]
    public function it_hides_settings_that_mean_nothing_for_a_field_without_a_value()
    {
        $fieldtype = $this->fieldtype(['label' => 'General']);

        $this->assertFalse($fieldtype->validatable());
        $this->assertFalse($fieldtype->defaultable());
        $this->assertFalse($fieldtype->localizable());
    }
}
