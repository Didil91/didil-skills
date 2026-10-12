---
name: csharp-design
description: Use when writing, modifying or reviewing C# code (.cs files, ASP.NET Core controllers, ViewModels, services, enums). Personal C# rules on nullability, async, named arguments, controllers, LINQ, exceptions and formatting.
---

# Règles C#

Complète le socle (nommage, commentaires, Composed Method) avec ce qui est propre au C#.

## Arguments nommés
- Nommer les arguments dès qu'un appel prend plusieurs paramètres ; obligatoire dès que deux ont le même type. En production comme en test.
- Ne concerne pas la résolution par l'injection de dépendances.
- Nouvelle dépendance d'un constructeur existant : l'insérer à un emplacement logique (ex. après `logger`), jamais en dernier, pour éviter les conflits de merge.

```csharp
services.AddQueueStorage(
    storageConnectionString: connectionStrings.StorageConnectionString,
    storageLogsConnectionString: connectionStrings.StorageLogsConnectionString);
```

## Nullable
- Annoter `?` tout ce qui peut valoir `null`, même si le csproj n'active pas `<Nullable>` : l'annotation est la seule trace du contrat. Neutraliser CS8632 et CS8618 dans `.editorconfig` si besoin.
- Un retour nul si et seulement si l'entrée est nulle : `[return: NotNullIfNotNull(nameof(param))]`.
- Pas de `?? string.Empty` pour faire taire un warning : il change le contrat. Seulement s'il traduit une vraie décision, avec le pourquoi.
- Opérateur `!` interdit. Traiter le `null` : `?? throw` ou vérification explicite.
- Tester avec `!= null` / `== null`, jamais `.HasValue`.

## Async
- Jamais `.Result` ni `.GetAwaiter().GetResult()` : toujours `await`.
- Event handler à signature `void` : `async void` qui délègue à une méthode `async Task`.

## ViewModels
- Toutes les propriétés `required`.
- Nullables annotées, `string?` compris.

## Controllers d'API
- Une action qui renvoie un payload est typée `ActionResult<T>` et fait `return model;`, jamais `Ok(model)` ni `Json(model)`.
- `Ok()` sans payload, `BadRequest()`, `NotFound()` restent tels quels.
- Sans payload (200 vide, redirection, fichier) : `IActionResult`.

## LINQ
- Le prédicat va dans `Where`, jamais en argument de `FirstOrDefault`, `SingleOrDefault`, `Any`, `Count`… : `.Where(x => x.Id == id).FirstOrDefault()`.

## Enums
- Premier membre `None = 0`, chaque membre avec une valeur explicite.

## Exceptions et logs d'erreur
- Le message est fixe : il nomme le type de problème, jamais l'occurrence (ni identifiant, ni montant, ni nom d'objet), pour que les erreurs se regroupent.
- Le contexte passe dans les données de l'exception ou les propriétés structurées du log.
- Une catégorie en nombre fini (valeur d'enum, nom de variable de configuration) peut figurer dans le message.
- Vaut pour une exception levée comme pour une exception journalisée.

## Dates
- Tout formatage de date hors affichage utilisateur (clé de cache, chemin, nom de fichier) : `CultureInfo.InvariantCulture`. Sinon le `/` devient `.` sur certaines cultures (de-DE).

## Formatage
- Méthode dont le corps tient sur une ligne : expression body sur une seule ligne.
- Ligne vide avant un `return`, sauf si la méthode ne contient que lui.
- Ligne vide après un bloc de déclarations de variables.
- `if` sans accolades : l'instruction passe à la ligne suivante.
- Initialiseur d'objet : une propriété par ligne.
