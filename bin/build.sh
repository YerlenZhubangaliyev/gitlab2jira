#!/usr/bin/env bash

ROOT_DIR="$( cd "$( dirname $BASH_SOURCE[0] )" && cd .. && pwd )"
SRC_DIR="${ROOT_DIR}/src"
BUILD_CONF_DIR="${ROOT_DIR}/build"
BUILT_DIR="${ROOT_DIR}/"
COMP_DIR="bower_components/"

NODE_BIN=/usr/local/bin/node
NPM_BIN=/usr/local/bin/npm

R_JS="${COMP_DIR}/r.js/dist/r.js"
BUILD_CONFIG_JS="${BUILD_CONF_DIR}/config.js"

if [ -x $NODE_BIN ]; then
    $NODE_BIN $R_JS -o $BUILD_CONFIG_JS
fi
