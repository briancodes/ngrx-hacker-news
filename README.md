# NgRxackerNews

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.4.

## Live Demo

// TODO

## NgRx References

[Announcing NgRx Version 8: creator functions, *Tim Deschryver, 2019*](https://medium.com/ngrx/announcing-ngrx-version-8-ngrx-data-create-functions-runtime-checks-and-mock-selectors-a44fac112627)

- [with NgRx official example on Github](https://github.com/ngrx/platform/tree/master/projects/example-app/src/app)

[Start Using NgRx Effects for This, *Tim Deschryver, 2018*](https://timdeschryver.dev/blog/start-using-ngrx-effects-for-this#4-using-a-selector-inside-your-effects)

```
@Effect()
shipOrder = this.actions.pipe(
  ofType<ShipOrder>(ActionTypes.ShipOrder),
  map(action => action.payload),
  concatMap(action =>
    of(action).pipe(
      withLatestFrom(store.pipe(select(getUserName)))
    )
  ),
  map([payload, username] => {
    ...
  })
)
```

[NGRX a clean and clear introduction, *Santiago García da Rosa, 2018*](https://levelup.gitconnected.com/angular-ngrx-a-clean-and-clear-introduction-4ed61c89c1fc)

[Start Flying with Angular and NgRx, *andrewevans0102, inDepth.dev, 2019*](https://indepth.dev/how-to-start-flying-with-angular-and-ngrx/)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
