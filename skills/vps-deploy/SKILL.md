---
name: vps-deploy
description: Use when deploying, updating or removing a service on a VPS or server that already hosts other projects in production (Docker container, nginx site, HTTPS certificate, free subdomain, SSH changes), or when asked how isolated or safe a deployed service is.
---

# Déployer un service sur un VPS partagé

Le VPS héberge d'autres projets en production : chaque geste doit pouvoir être annulé, et rien ne touche aux autres.

## Avant de toucher au serveur
- État des lieux en lecture seule : ce qui tourne (`docker ps`, `ss -tlnp`, sites nginx, certificats, mémoire, disque),
  et les **codes de réponse de chaque site existant**, notés pour comparer après chaque étape.
- Lire la convention de nommage du serveur et la suivre (ex. `projet-test` / `projet-prod`).
- SSH : une seule tentative à la fois, avec la clé prévue ; plusieurs essais d'affilée = bannissement fail2ban.

## Isolation (Docker)
- **Un dossier et un projet compose par environnement** : `/opt/<projet>-test` et `/opt/<projet>-prod`, chacun son
  `.env`. Jamais test et prod dans le même projet compose : un `up` ou un `down` doit n'en toucher qu'un.
- Dans le conteneur : utilisateur non root (`USER`), `read_only: true` + `tmpfs: /tmp`, `cap_drop: [ALL]`,
  `security_opt: [no-new-privileges:true]`, `init: true`, `restart: unless-stopped`.
- Ressources plafonnées : `mem_limit`, `cpus`, `pids_limit`, dimensionnées sur le VPS réel (ce qui reste libre) sans
  étouffer le service.
- Journaux Docker plafonnés : `logging: json-file`, `max-size`, `max-file`.
- Aucun volume de l'hôte monté sauf besoin prouvé ; aucun `privileged`, `network_mode: host`, `pid: host`.
- Port publié **sur `127.0.0.1` seulement** ; seul nginx est exposé. Aucun port ajouté au pare-feu.
- Secrets : fichier `.env` en `chmod 600` sur le serveur, jamais dans l'image ni dans le dépôt.
- Ne jamais ajouter un utilisateur au groupe `docker` : c'est l'équivalent de root. Utiliser `sudo docker`.
- Vérifier l'isolation après coup : `docker inspect` (Mounts vides, User, ReadonlyRootfs, Privileged faux) et ce que le
  conteneur voit (`docker exec … ls /opt`, `id`).

## Exposition (nginx, HTTPS)
- Un fichier de site **par environnement**, nouveau, sans `default_server` ; aucun fichier des autres projets modifié.
- `nginx -t` avant **chaque** rechargement ; `reload`, jamais `restart`. Échec : retirer son lien, retester.
- WebSocket : `proxy_set_header Connection "upgrade"` en dur, plutôt qu'un `map` global qui peut doubler celui d'un
  autre site et faire échouer `nginx -t` ; `X-Real-IP $remote_addr` toujours réécrit par nginx.
- `access_log off` si le public est mineur ou si l'IP n'est pas nécessaire.
- Pas de domaine : sous-domaine gratuit **sans compte** d'abord (sslip.io / nip.io), un seul certificat pour les deux
  environnements (quota Let's Encrypt partagé). Un service qui exige un compte (DuckDNS…) : ne pas le créer, le
  signaler à l'utilisateur.
- Contrôler le renouvellement : `certbot renew --dry-run --cert-name <nom>`.

## Mise en service et retour arrière
- **Test d'abord**, contrôlé, puis prod avec le même artefact (même empreinte `sha256sum`).
- Garder la version précédente à côté (`server.mjs.precedent`, image taguée) : retour arrière en une commande.
- Contrôles techniques sans « jouer » à la place de l'utilisateur : santé du conteneur, code HTTP attendu,
  `docker stats`, codes des autres sites identiques à l'état des lieux.
- Le service doit s'arrêter proprement (SIGTERM) et sortir en erreur s'il ne peut pas écouter, sinon `restart` ne le relance pas.
- Jamais `docker system prune` ni `docker image prune -a` : seulement ses propres images.

## Sortie
Un inventaire de ce qui a été installé (dossiers, conteneurs, images, réseaux, sites, certificats, ports), ce qui n'a
pas été touché, et la commande de retrait complet. Documenté dans le dépôt (README du serveur).
