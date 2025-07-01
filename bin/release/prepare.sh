#!/bin/bash

set -e

VERSION=$1

docker build -t pustovitdmytro/hermod-base:$VERSION -f docker/Base.dockerfile .
docker build -t pustovitdmytro/hermod-worker:$VERSION -f docker/Worker.dockerfile .
docker build -t pustovitdmytro/hermod-admin:$VERSION -f docker/Admin.dockerfile .

repo_url=$(cat package.json | jq -r .repository.url)
readme=$(jq tostring --raw-input --slurp README.md)

echo '{"full_description":'$readme',"description":"'"$repo_url"'"}' > .dockerhub.readme
