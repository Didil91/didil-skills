# didil-skills

Plugin Claude Code `adil` : règles de dev (socle toujours chargé, skills par domaine, agents).

## Installer sur une machine

```
/plugin marketplace add didil91/didil-skills
/plugin install adil@didil-skills
```

Mise à jour : `/plugin marketplace update didil-skills`.

## Partager avec un projet

Dans le `.claude/settings.json` commité du projet, pour que tout collaborateur se voie proposer le plugin :

```json
{
  "extraKnownMarketplaces": {
    "didil-skills": { "source": { "source": "github", "repo": "didil91/didil-skills" } }
  },
  "enabledPlugins": { "adil@didil-skills": true }
}
```

## Dérogations

Une règle du projet l'emporte sur le socle ; Claude signale l'écart.
