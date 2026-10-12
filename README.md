# didil-skills

Plugin Claude Code `adil` : règles de dev (socle toujours chargé, skills par domaine, agents).

## Installer sur une machine

```
/plugin marketplace add didil91/didil-skills
/plugin install adil@didil-skills
```

Mise à jour : `/plugin marketplace update didil-skills`, puis `/plugin update adil@didil-skills` et `/reload-plugins`.

À chaque modification poussée, incrémenter `version` dans `.claude-plugin/plugin.json` : sans nouveau numéro, `/plugin update` garde l'ancienne copie.

## Partager avec un projet

Dans le `.claude/settings.json` commité du projet, pour que tout collaborateur se voie proposer le plugin et superpowers (dont dépend `workflow-sdd`) :

```json
{
  "extraKnownMarketplaces": {
    "didil-skills": { "source": { "source": "github", "repo": "Didil91/didil-skills" } },
    "superpowers-marketplace": { "source": { "source": "github", "repo": "obra/superpowers-marketplace" } }
  },
  "enabledPlugins": {
    "adil@didil-skills": true,
    "superpowers@superpowers-marketplace": true
  }
}
```

## Dérogations

Une règle du projet l'emporte sur le socle ; Claude signale l'écart.
