module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "globals": {
        "module": "writable",
        "$": "readonly",
        "mw": "readonly"
    },
    "rules": {
        "no-shadow": 2,
        "no-trailing-spaces": 2,
        "template-curly-spacing": [ "error", "never" ],
        "no-useless-concat": 2,
        "object-shorthand": 2,
        "prefer-template": 2
    }
}
