<?php

use craft\helpers\App;

/**
 * Site URL Rules
 *
 * You can define custom site URL rules here, which Craft will check in addition
 * to routes defined in Settings → Routes.
 *
 * Read all about Craft’s routing behavior, here:
 * https://craftcms.com/docs/4.x/routing.html
 */

// The test fixture page is only routed in dev, so it never serves in production.
return App::env('CRAFT_ENVIRONMENT') === 'dev'
    ? ['test/components' => ['template' => '_test/components']]
    : [];
