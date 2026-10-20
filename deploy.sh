#!/usr/bin/env bash
# Деплой на moresushi.in.ua: збірка локально → rsync .output → рестарт systemd-сервісу
set -euo pipefail
HOST=root@185.25.116.138
DIR=/var/www/moresushi_in_usr/data/www/moresushi.in.ua/new-front

cd "$(dirname "$0")"
npm run build
rsync -az --delete .output/ "$HOST:$DIR/.output/"
ssh "$HOST" "chown -R moresushi_in_usr:moresushi_in_usr $DIR && systemctl restart moresushi-front && sleep 2 && systemctl is-active moresushi-front"
curl -fsS -o /dev/null -w 'https://moresushi.in.ua → %{http_code}\n' https://moresushi.in.ua/
