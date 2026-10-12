---
name: angular
description: Use when writing, modifying or reviewing Angular code — components, templates, services, signals, RxJS, routing, interceptors. Personal rules on component decomposition (container/presentational, facade, OnPush) and modern Angular syntax.
---

# Règles Angular

## Découpage
- **Container / Presentational.** Le container obtient les données (façade ou services), tient l'état et orchestre le parcours avec des signals. Le presentational affiche ce qu'il reçoit en `input()` et signale en `output()` : aucun service métier, aucun appel HTTP.
- **Flux unidirectionnel.** Les données descendent par les inputs, les événements remontent par les outputs. Un enfant ne modifie jamais l'état de son parent.
- **Façade.** Un container parle à une façade (service qui expose l'état en signals et des actions nommées), pas à plusieurs services. La logique qui grossit sort du composant vers la façade.
- **Projection plutôt que configuration.** Un composant qui accumule des inputs pour couvrir des variantes (`showHeader`, `headerTitle`…) passe à `ng-content`.
- **OnPush** sur tout composant.
- **Rangement par fonctionnalité** (`orders/`, `profile/`), chaque fonctionnalité chargée en lazy loading ; pas par type technique.
- Extraire un sous-composant quand un morceau de template a son propre état, se répète, ou quand le template ne se lit plus d'un coup d'œil (repère : ~150 lignes).

## Composants
- Standalone uniquement, aucun `NgModule`.
- `input()`, `input.required()`, `output()` ; jamais `@Input` / `@Output`. État local en `signal`, dérivé en `computed`.
- `inject()`, jamais d'injection par constructeur.
- Visibilité explicite sur tout membre : `public`, `protected`, `private`.
- Imports TypeScript et tableau `imports` du composant triés par ordre alphabétique.

## Templates
- `@if`, `@for`, `@switch`, `@defer` ; jamais `*ngIf`, `*ngFor`, `*ngSwitch`.
- `@for` avec `track` sur l'identifiant (`track item.id`) ; `$index` seulement pour une liste statique.
- `@let` pour lire un signal plusieurs fois.
- Un `ng-template` à variables `let-` a son contexte typé (directive avec `ngTemplateContextGuard`, ou cast typé) : sinon tout y est `any`.

## Services et RxJS
- Service d'API mince : renvoie un `Observable` typé, jamais une `Promise`, pas de `try/catch`. L'appelant gère l'erreur. Le service peut seulement traduire une erreur attendue en valeur métier par un `catchError` court.
- Afficher un Observable : `toSignal()` plutôt que `async` pipe ou `subscribe`.
- Observable HTTP partagé entre composants : `shareReplay(1)` dans le service.
- Abonnement manuel : `takeUntil` lié au cycle de vie dans un composant, `take(1)` dans un service sans cycle de vie.
- Interceptors fonctionnels (`HttpInterceptorFn`) enregistrés via `withInterceptors`, jamais en classe.

## SSR
- Projet en SSR : toute manipulation du DOM est gardée par `isPlatformBrowser`.
