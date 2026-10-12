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

## Lots
- Le plan regroupe les tâches en lots. Un lot compile, ses tests passent, et il se relit d'un bloc.
- Petits lots par défaut : 1 à 3 tâches. Le découpage est validé par l'utilisateur avec le plan.
- Le plan recommande un mode d'exécution (sous-agents ou natif) ; l'utilisateur choisit à chaque plan.

## Branches
- L'utilisateur travaille sur une seule branche. Pas de worktree, sauf demande.
- Chaque lot s'exécute sur une branche de travail `sdd/<plan>` créée depuis la branche de l'utilisateur. Les commits y sont libres (superpowers en a besoin pour ses revues et son journal) et ne sont jamais poussés.

## Exécution
- Les tâches d'un lot s'enchaînent sans pause. Arrêt obligatoire en fin de lot, en plus des arrêts prévus par superpowers.
- Chaque décision prise seul est notée dans le journal (`Ruling:`) ; elle sera remontée en revue.

## Fin de lot
1. Revenir sur la branche de l'utilisateur et y rapatrier le lot sans commit : `git merge --squash sdd/<plan>`.
2. Relecture tâche par tâche, une tâche par message : ce qui a été fait, impacts, choix pris sans l'utilisateur, choix qui lui restent.
3. Proposer les commits, chacun avec un tableau Fichier / Changement / Pourquoi tiré de `git diff --cached` et un message en français.
   - Une migration est toujours un commit à part : modèle, configuration éventuelle, fichiers de migration.
   - Un commit ne mélange pas deux sujets.
4. Commiter uniquement ce que l'utilisateur valide, commit par commit.
5. Supprimer `sdd/<plan>` avec son accord ; le lot suivant repart de sa branche à jour.

## Écarts relevés en revue
Pour chaque écart, proposer où le corriger à la source : la spec, ou une règle dans le skill concerné du plugin.
