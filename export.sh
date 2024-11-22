#!/bin/bash
cp -r version ../version && cp -r web.app ../web.app && cp -r manifest.json ../manifest.json
rm -rf ../../../../../public/apps && mkdir ../../../../../public/apps && cp -a dist/symbiose/* ../../../../../public/apps/