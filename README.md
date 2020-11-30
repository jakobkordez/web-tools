# Web Tools

## Planned projects

- [X] Url shortener
- [ ] Image upload 

## Configuration & Setup

### Enviromental variables
```bash
PORT=3000

MONGO="mongodb://..."

JWT_SECRET="..."
```

### Installing node packages

To install npm packages run `npm install`  
To build the typescript code you will also need devDependencies, to install them run `npm install -D`

### Starting the server

To build and run the server run `npm start`

### Creating an admin account

To create an admin account you will need to build the code with and run the `create_admin.js` script in the `scripts/` folder.  
The script will ask for a username and password.
```
$ npm run build

> web-tools@1.0.0 build .../web-tools
> tsc

$ node scripts/create_admin.js
Enter username: admin
Enter password: password
User created.
```
