<?php

return [
    'palettes' => [
        'Tailwind' => [
            [
                'label'   => 'Dark', // custom label (required)
                'default' => true,  // default could be true/false (option is required)
                'color'   =>  [
                    [
                        'color'             => '#262626',               // the colour shown in the fieldtype (required)
                        'background'        => 'bg-neutral-800',            // optional / custom attribute
                        // 'backgroundHover'   => 'hover:bg-neutral-700',      // optional / custom attribute
                        'text'              => 'text-white',            // optional / custom attribute
                        'textHover'         => 'hover:text-white'    // optional / custom attribute
                    ]
                ]
            ],

            [
                'label'   => 'Light', // custom label (required)
                'default' => false,  // default could be true/false (option is required)
                'color'   =>  [
                    [
                        'color'             => '#e4e4e7',               // the colour shown in the fieldtype (required)
                        'background'        => 'bg-neutral-200',            // optional / custom attribute
                        // 'backgroundHover'   => 'hover:bg-neutral-700',      // optional / custom attribute
                        'text'              => 'text-white',            // optional / custom attribute
                        'textHover'         => 'hover:text-neutral-700'    // optional / custom attribute
                    ]
                ]
            ],
        ]
    ]
];
