---
name: ef-core
description: Use when writing or reviewing Entity Framework Core code — DbContext queries, LINQ to entities, entity models, Fluent API configurations, migrations. Personal rules on tracking, projection, decimals and migration workflow.
---

# Règles EF Core

Complète `csharp-design` (LINQ, nullable) avec ce qui est propre à l'accès aux données.

## Requêtes
- Lecture : `AsNoTracking()`, projection dans le `Select` (`new { }` ou ViewModel). Jamais l'entité complète chargée puis mappée en mémoire.
- Entité complète chargée uniquement pour un update.

```csharp
var sponsorship = await dbContext.Sponsorships
    .AsNoTracking()
    .Where(x => x.Id == id)
    .Select(x => new SponsorshipViewModel { Amount = x.Amount })
    .FirstOrDefaultAsync();
```

## Concurrence
- Repérer le motif lire → calculer depuis l'ancienne valeur → réécrire, quand plusieurs acteurs peuvent agir en même temps (requêtes parallèles, job de fond, plusieurs utilisateurs). Le signaler, puis choisir dans cet ordre :
  1. **Contrainte en base** quand la règle s'y exprime : index unique (doublons), `CHECK`. Jamais un contrôle applicatif à la place ; la violation (PostgreSQL `23505`) devient une erreur métier.
  2. **Mise à jour atomique** pour un calcul simple sur une ligne (compteur, solde) : `ExecuteUpdateAsync(s => s.SetProperty(x => x.Amount, x => x.Amount + credit))`.
  3. **Concurrence optimiste** pour une fiche modifiée par plusieurs personnes : `RowVersion` (`.IsRowVersion()`, `xmin` sous PostgreSQL) et `DbUpdateConcurrencyException` traitée explicitement (« modifiée entre-temps, rechargez »).
  4. **Verrou pessimiste** quand la règle porte sur plusieurs lignes (ex. « au moins un administrateur par organisation ») : transaction + `SELECT … FOR UPDATE` sur le groupe de lignes, puis relecture avant de décider. Section verrouillée la plus courte possible. La concurrence optimiste ne protège pas ce cas : chaque acteur modifie une ligne différente.

## Modèle
- Toute propriété `decimal` a une précision explicite : `decimal(18,2)` pour un montant, davantage de décimales pour un taux ou un pourcentage.

## Migrations
- Aussi peu de migrations que possible par feature : regrouper les changements de schéma.
- Ne jamais réécrire une migration déjà partagée ou déployée.
- Avant d'en générer une : résumer les changements de schéma prévus, demander si c'est le bon moment ou s'il reste des changements à regrouper, attendre la confirmation.
- Une migration est toujours un commit à part : modèle, configuration éventuelle, fichiers de migration.
- Annuler une migration : ramener la base à la migration cible, restaurer le snapshot et les fichiers modifiés via git, supprimer les nouveaux fichiers non commités. Jamais `dotnet ef migrations remove` : il régénère le snapshot depuis la dernière migration, faux après un merge.
