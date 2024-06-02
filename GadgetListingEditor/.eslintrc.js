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
        "no-trailing-spaces": 2,
        "template-curly-spacing": 2,
        "no-useless-concat": 2,
        "object-shorthand": 2,
        "prefer-template": 2
    }
}
