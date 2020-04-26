# @thwack/resolve

## What is it?

- Functionally equivalent to `new URL(url, base).href`
- Works on browsers, NodeJS, and React Native
- Has loads of tests that use `URL` as its expected results

## Why?

I needed to resolve a URL against a base when writing [Thwack](https://github.com/donavon/thwack). Initially I used `new URL(url, base).href`, but found that it failed when running on React Native as it's implimenation of `URL` sucks (to put it mildly).

I initially imported [react-native-url-polyfill](https://github.com/charpeni/react-native-url-polyfill) but it's 41k, which is more than 10x Thwack itself!

So I set out to write my own and share it with the world.

## Installation

```bash
$ npm i @thwack/resolve
```

or

```bash
$ yarn add @thwack/resolve
```

## The RegEx

It is based on the RegEx in the RFC for Uniform Resource Identifier (i.e. the URL syntax for the internet)

```regex
^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
```

see https://tools.ietf.org/html/rfc3986#appendix-B

The RegEx returns:

```
$1 = http:
$2 = http                //protocol
$3 = //www.example.com
$4 = www.example.com     //domain
$5 = /foo/bar/ or foo    //path
$6 = ?a=b                //search
$7 = a=b
$8 = #hash               //hash
$9 = hash
```

> Note 1: all but $5 will be undefined if missing. $5 will be ""

> Note 2: \$5 will be "undefined" (a string) if uri is undefined

> Note 3: \$4 will be `undefined` if missing or "" if present but blank

## License

Licensed under [MIT](LICENSE)
