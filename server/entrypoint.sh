#!/bin/sh

set -e

echo "running migrations"
npm run docker:prisma:deploy

echo "running cmd"
exec "$@"