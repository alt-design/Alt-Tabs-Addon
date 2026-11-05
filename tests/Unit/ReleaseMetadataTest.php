<?php

namespace AltDesign\AltTabsAddon\Tests\Unit;

use AltDesign\AltTabsAddon\Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ReleaseMetadataTest extends TestCase
{
    private function composer(): array
    {
        return json_decode(file_get_contents(__DIR__.'/../../composer.json'), true);
    }

    #[Test]
    public function it_leaves_versioning_to_git_tags()
    {
        $this->assertArrayNotHasKey('version', $this->composer());
    }

    #[Test]
    public function it_declares_the_listing_metadata()
    {
        $composer = $this->composer();

        $this->assertSame('MIT', $composer['license']);
        $this->assertNotEmpty($composer['keywords']);
        $this->assertNotEmpty($composer['authors']);
        $this->assertArrayHasKey('issues', $composer['support']);
    }

    #[Test]
    public function it_ships_the_assets_the_service_provider_registers()
    {
        $this->assertFileExists(__DIR__.'/../../resources/dist/js/cp.js');
        $this->assertFileExists(__DIR__.'/../../resources/dist/css/cp.css');
    }

    #[Test]
    public function it_keeps_em_dashes_out_of_the_public_listing_text()
    {
        $composer = $this->composer();

        $this->assertStringNotContainsString("\u{2014}", $composer['description']);
        $this->assertStringNotContainsString("\u{2014}", $composer['extra']['statamic']['description']);
    }
}
