#!/bin/bash

source ~/.bashrc

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

npm run prod
