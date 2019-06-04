# Inanium Engine

Simple and unnecessary GraphQL server to host a trash panda blog on [ideasyncratic](http://www.ideasyncratic.net).

Initially based on [How to build a GraphQL server](https://medium.com/apollo-stack/tutorial-building-a-graphql-server-cddaa023c035#.wy5h1htxs).

## Backend

```
npm install
./script/test.sh
npm start
```

## Frontend

build with:

```
./node_modules/.bin/browserify frontend/main.js -o frontend/bundle.js -t [ babelify --presets [ "@babel/preset-env" ] ]
```
