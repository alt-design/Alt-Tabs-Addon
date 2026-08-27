<?php namespace AltDesign\AltTabsAddon\Fieldtypes;

use Statamic\Fields\Fieldtype;

class Tab extends Fieldtype
{
    protected $icon = 'tabs-sections';
    protected $categories = ['special'];
    protected static $title = 'Tab';

    protected function configFieldItems(): array
    {
        return [
            'label' => [
                'display' => 'Tab Label',
                'instructions' => 'The display name of this tab. Fields that follow this Tab field (up to the next Tab field) will appear under this tab.',
                'type' => 'text',
                'width' => 50,
            ],
            'placement' => [
                'display' => 'Placement',
                'instructions' => 'Where the tab buttons appear relative to the fields.',
                'type' => 'select',
                'default' => 'left',
                'options' => [
                    'top' => 'Top',
                    'left' => 'Left',
                ],
                'width' => 25,
            ],
            'icon' => [
                'display' => 'Icon',
                'instructions' => 'Optional icon name to show on the tab button.',
                'type' => 'text',
                'width' => 25,
            ],
        ];
    }

    public function preload(): array
    {
        return [
            'label' => $this->config('label'),
            'placement' => $this->config('placement', 'left'),
            'icon' => $this->config('icon'),
        ];
    }

    public function preProcess($data)
    {
        return null;
    }

    public function process($data)
    {
        return null;
    }

    public function emptyValue()
    {
        return null;
    }

    public function augment($value)
    {
        return null;
    }

    public function preProcessIndex($value)
    {
        return $this->config('label');
    }
}
