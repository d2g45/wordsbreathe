#!/bin/bash

source ~/.bashrc

set -e

# for dreamhost: default cli php is 8.2, composer.lock requires 8.4
export PATH=/usr/local/php84/bin:$PATH
php -r 'exit(PHP_VERSION_ID >= 80400 ? 0 : 1);' || { echo "PHP 8.4 not found"; exit 1; }
php -v | head -n 1

git pull

nvm use
npm ci

composer install

# for dreamhost
./craft migrate/all --interactive=0
./craft project-config/apply --interactive=0
./craft clear-caches/compiled-templates --interactive=0
./craft clear-caches/cp-resources --interactive=0
./craft clear-caches/data --interactive=0
./craft resave/all

npm run prod
