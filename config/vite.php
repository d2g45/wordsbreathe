<?php

use craft\helpers\App;

return [
    'useDevServer' => App::env('CRAFT_ENVIRONMENT') === 'dev',
    'manifestPath' => Craft::getAlias('@webroot') . '/dist/manifest.json',
    'devServerPublic' => Craft::getAlias('@web') . ':3000',
    'serverPublic' => Craft::getAlias('@web') . '/dist/',
    'errorEntry' => 'src/scripts/main.ts',
];
