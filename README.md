# Map Array Response
[![Coverage Status](https://coveralls.io/repos/github/bingneef/map-array-response/badge.svg?branch=master)](https://coveralls.io/github/bingneef/map-array-response?branch=master)
[![Build Status](https://app.codeship.com/projects/17544140-d816-0135-9c8a-32bc1125dbb9/status?branch=master)]

# We support all major Node.js versions. Please see our documentation for a full list.
# https://documentation.codeship.com/basic/languages-frameworks/nodejs/
#
# By default we use the Node.js version specified in your package.json file and fall
# back to the latest version from the 0.10 release branch.
#
# You can use nvm to install any Node.js version you require
nvm install 11.13.0
yarn install

yarn test
yarn lint
yarn prettier:check