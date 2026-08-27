<?php

namespace AltDesign\AltTabsAddon\Tests;

use AltDesign\AltTabsAddon\ServiceProvider;
use Statamic\Testing\AddonTestCase;

abstract class TestCase extends AddonTestCase
{
    protected string $addonServiceProvider = ServiceProvider::class;
}
