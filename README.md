# Node-Express-TypeScript template

This project is created as a template to start any Node-Express project using typescript
## Scripts

### `yarn start`
Application starts with watch mode on.

### `yarn build`
Application build package is created in `./dist` folder.

### `postbuild`
The current script depends on linux's `cp` (copy) command.
The user has to change it according to their operating system.
> The developer does not have to run this as 
> it will automatically run after `yarn build`

## Features

1. TypeScript execution engine : [`tsx`](https://www.npmjs.com/package/tsx)
2. Live reload : [`livereload`](https://www.npmjs.com/package/livereload), [`connect-livereload`](https://www.npmjs.com/package/connect-livereload)
3. dotenv configuration : [`dotenv`](https://www.npmjs.com/package/dotenv)
4. Yarn is added if preferred

## Template information

1. Template engine : [`pug`](https://www.npmjs.com/package/pug)
2. HTTP request logger middleware : [`morgan`](https://www.npmjs.com/package/morgan)
