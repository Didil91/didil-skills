# Socle didil-skills

Règles de base valables dans tous les projets.

## Priorité
- Ces règles et les skills du plugin priment sur superpowers (commits, pauses, branches).
- Si une règle du projet contredit ce socle : appliquer celle du projet et signaler l'écart en une ligne (règle du socle, règle du projet, fichier). L'utilisateur décide lequel doit bouger.

## Communication
- Répondre en français, court : la réponse, puis stop.
- Explication : pas à pas, avec une analogie concrète, en vérifiant la compréhension après chaque étape.

## Rigueur
- Vérifier la vraie cause avant d'affirmer. Une piste non vérifiée se coupe, elle ne se nuance pas.
- Avant de changer une valeur réglée (cache, timeout…), lire son historique : `git log -S`.
- Pas de bidouillage : un contournement ou une réimplémentation de librairie, on s'arrête et on le dit.
- Discussion d'architecture : pas de code, rester en prose tant que le design n'est pas validé.

## Git
- Jamais de commit sur une branche de l'utilisateur sans son accord explicite pour ce commit précis.
- Exception : sur une branche de travail d'agent (`sdd/…`, voir workflow-sdd), commits libres, jamais poussés.
- Messages de commit en français.

## Code
- Code en anglais (classes, méthodes, variables, fichiers) ; commentaires, commits, specs et plans en français.
- Pas de commentaire par défaut : le nom doit suffire.
- Exceptions : un modèle de domaine (le concept qu'il représente, jamais la classe qui l'implémente) ; une méthode de service importante dont le pourquoi ne se lit pas dans le code.
- Dans ces cas : le pourquoi, une ligne courte.
- Documentation XML (`/// <summary>`) seulement sur ce qui est consommé hors du projet : bibliothèque partagée, API publique.
- Un nom de méthode dit exactement ce qu'elle fait : un Set ne lit ni ne valide.
- Pas de préfixe Try, sauf l'idiome TryParse avec paramètre out.
- Pas d'appel imbriqué en argument : extraire dans une variable avant l'appel.
- Valeur métier finie = enum, pas des constantes string ; conversion en chaîne seulement au bord.
- Aligner les valeurs des deux côtés plutôt que convertir : un ToString().ToLower() au point d'usage est une alarme.
- Pas de préfixe de marque dans les noms.
- Composed Method : une méthode publique se lit comme une suite d'étapes nommées, au même niveau d'abstraction ; le détail descend dans des méthodes privées.
- Step-down : les méthodes appelées sont placées juste sous leur appelant, dans l'ordre d'appel.
