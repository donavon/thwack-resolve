// This is a clone of `new URL(url, base).href`
// It is bases on the following RegEx.
// ^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
// $1 = http:
// $2 = http                //protocol
// $3 = //www.example.com
// $4 = www.example.com     //domain `undefined` is missing or "" if present but blank
// $5 = /foo/bar/ or foo    //path
// $6 = ?a=b                //search
// $7 = a=b
// $8 = #hash               //hash
// $9 = hash
// Note 1: all but $5 will be undefined if missing. $5 will be ""
// Note 2: $5 will be "undefined" (the string) if uri is undefined
// see https://tools.ietf.org/html/rfc3986#appendix-B

const parseUri = (uri = '') => {
  const parts = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/i.exec(
    uri
  ) as Array<string>;
  const [
    ,
    ,
    protocol = '', // raw protocol ex: `http`
    slashslash, // domain with leading `//`
    domain, // let domain be undefined
    path,
    search = '',
    ,
    hash = '',
  ] = parts;
  return { protocol, slashslash, domain, path, search, hash };
};

// "?x=123", "http://ex.co/foo" => "http://ex.co/foo?x=123"
export const resolve = (url: string, base: string): string => {
  const u = parseUri(url);
  const b = parseUri(base);

  const getPath = () => {
    const searchHash = u.search + u.hash;

    if (u.path.startsWith('/')) {
      // u is absolute so ignore b
      return u.path.substr(1) + searchHash; // use u.path w/no leading slash
    }
    if (b.path.endsWith('/')) {
      // u="bar/baz/" b="/foo/" res="foo/bar/baz"
      return b.path.substr(1) + u.path + searchHash;
    }
    if (u.path) {
      return u.path + searchHash;
    }
    if (b.path.startsWith('/')) {
      return b.path.substr(1) + searchHash; // use u.path w/no leading slash
    }
    return b.path + searchHash;
  };

  const protocol = u.protocol || b.protocol;
  const domain = u.domain ?? b.domain;
  if (
    (u.slashslash === '//' && u.path === '/') ||
    !base ||
    !protocol ||
    domain === undefined
  ) {
    // A fully qualified URL *must* have a protocol and a domain
    throw new TypeError('Invalid base URL');
  }

  return `${protocol.toLowerCase()}://${domain.toLowerCase()}/${getPath()}`;
};
