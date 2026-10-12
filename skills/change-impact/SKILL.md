---
name: change-impact
description: Use before a cross-module or high-risk change (database migration, authentication, public API or contract, deployment, irreversible data change) or when asked about blast radius, and after implementation to compare the actual diff with the planned impact. Adapted from ECC (MIT).
---

# Analyse d'impact

Lecture seule. Prouver la surface d'impact par les vraies dépendances, jamais par intuition. Ce qui n'est pas prouvé est marqué `non vérifié`.

## Avant le changement
Répondre dans l'ordre, preuves à l'appui (imports et appels réels, routes, schémas, configuration, `git grep`, tests) :

1. **Code** : points d'entrée, appelants directs, consommateurs en aval, code généré.
2. **Données** : schéma, migration, données existantes, sérialisation, caches.
3. **Interfaces** : API, messages, formats de fichier ; qui les consomme, qui les fournit (front, app mobile, autre service).
4. **Valeurs réglées** : une valeur réglée touchée (cache, timeout…) a son historique lu avec `git log -S`.
5. **Tests** : quels tests prouvent que le changement est correct, lesquels manquent.
6. **Mise en production** : ordre de déploiement, compatibilité pendant la transition, retour arrière, effets irréversibles.

Ne jamais déduire une dépendance d'un nom de dossier.

Migration, rupture d'interface, authentification, mise en production : retour arrière, compatibilité et effets irréversibles sont obligatoires. Un manque est bloquant ; ne jamais exécuter de retour arrière à la place de l'utilisateur.

## Après l'implémentation
1. Le changement résout-il le problème de la spec ?
2. Le diff réel dépasse-t-il le périmètre annoncé ? Tout dépassement est signalé.
3. Les tests prouvent-ils les critères de succès, ou seulement qu'une commande a tourné ?
4. Reste-t-il du code temporaire, de la compatibilité provisoire, une migration inachevée ?

## Sortie
Dans la réponse, en français : objets touchés, preuves, vérifications à faire, inconnues. Pas de fichier de rapport, sauf si l'utilisateur en choisit un.
