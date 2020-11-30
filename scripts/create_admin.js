require('dotenv/config');
const { createInterface } = require('readline');
const validateEnv = require('../dist/utils/validateEnv').default;
const App = require('../dist/app').default;
const AuthService = require('../dist/auth/auth.service').default;

validateEnv();

const rl = createInterface(process.stdin, process.stdout);

// Used only to connect to DB
const app = new App([]);

const authService = new AuthService()

rl.question('Enter username: ', username => {
    rl.question('Enter password: ', password => {
        const userData = {
            username,
            password,
            admin: true,
        };

        authService.register(userData).then(user => {
            console.log('User created.');
            process.exit(0);
        }).catch(e => {
            console.error('Error:', e.message);
            process.exit(1);
        });
    });
});
