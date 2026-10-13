---
name: workflow-sdd
description: Use when doing spec-driven development with superpowers (brainstorming, writing-plans, subagent-driven-development, executing-plans, using-git-worktrees). Overrides superpowers on lots, commits, pauses, branches and review format.
---

# Workflow SDD

S'appuie sur superpowers (7.x). Ce skill prime sur superpowers pour les points ci-dessous ; tout le reste de superpowers s'applique tel quel.

## Spec et plan
- Emplacement par défaut de superpowers : `docs/superpowers/specs/`, `docs/superpowers/plans/`.
- Rédigés en français ; noms de classes, méthodes et fichiers en anglais.
- La spec et le plan ne sont pas commités d'office : ils suivent la règle des commits ci-dessous.

## Analyse d'impact
- Changement transverse ou à risque (migration, authentification, API publique, mise en production) : skill `change-impact` avant d'écrire le plan.

## Lots
- Le plan regroupe les tâches en lots. Un lot compile, ses tests passent, et il se relit d'un bloc.
- Petits lots par défaut : 1 à 3 tâches. Le découpage est validé par l'utilisateur avec le plan.
- Le plan recommande un mode d'exécution (sous-agents ou natif) ; l'utilisateur choisit à chaque plan.

## Branches
- L'utilisateur travaille sur une seule branche. Pas de worktree, sauf demande.
- Chaque lot s'exécute sur une branche de travail `sdd/<plan>` créée depuis la branche de l'utilisateur. Les commits y sont libres et jamais poussés.
- Ces commits sont déjà les commits finaux : propres, un sujet par commit, message en français. Une migration est toujours un commit à part : modèle, configuration éventuelle, fichiers de migration.

## Exécution
- Les tâches d'un lot s'enchaînent sans pause ni question. Arrêt obligatoire en fin de lot, en plus des arrêts prévus par superpowers.
- Arrêt immédiat, même en cours de lot, si le plan a un gros trou ou si la solution impose un changement d'architecture non prévu : exposer le problème et les options, attendre la décision.
- Chaque décision prise seul est notée dans le journal (`Ruling:`) ; elle sera remontée en revue.

## Fin de lot
1. Lancer l'agent `silent-failure-hunter` sur le diff du lot ; ses constats entrent dans la relecture. Lot transverse ou à risque : vérification « après l'implémentation » de `change-impact`.
2. Un seul message de relecture, structuré par tâche : ce qui a été fait, impacts, choix pris sans l'utilisateur, choix qui lui restent. L'utilisateur creuse une tâche s'il le souhaite.
3. Dans le même message, tous les commits du lot, chacun avec un tableau Fichier / Changement / Pourquoi tiré de `git show` et son message. L'utilisateur valide en une fois ou raye ce qui ne va pas.
4. Après accord, rapatrier les commits tels quels sur la branche de l'utilisateur (`git merge --ff-only sdd/<plan>`, ou `git cherry-pick` des commits validés). Pas de squash : l'historique relu est celui qui est livré.
5. Supprimer `sdd/<plan>` ; le lot suivant repart de la branche de l'utilisateur à jour.

## Écarts relevés en revue
Pour chaque écart, proposer où le corriger à la source : la spec, ou une règle dans le skill concerné du plugin.
