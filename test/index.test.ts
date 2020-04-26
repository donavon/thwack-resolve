import { resolve } from '../src';

const testCases = [
  // relative url
  ['bar', 'http://ex.co/foo'],
  ['bar', 'http://ex.co/foo/'],
  ['bar/', 'http://ex.co/foo'],
  ['bar/', 'http://ex.co/foo/'],

  // absolute url
  ['/bar', 'http://ex.co/foo'],
  ['/bar', 'http://ex.co/foo/'],
  ['/bar/', 'http://ex.co/foo'],
  ['/bar/', 'http://ex.co/foo/'],

  // search
  ['bar', 'http://ex.co/foo?a=b'],
  ['bar?x=y', 'http://ex.co/foo'],
  ['bar?x=y', 'http://ex.co/foo?a=b'],
  ['http://xx.com/bar', 'http://ex.co/foo?a=b'],
  ['http://xx.com/bar?x=y', 'http://ex.co/foo'],
  ['http://xx.com/bar?x=y', 'http://ex.co/foo?a=b'],

  // hash (never use hash from base)
  ['bar', 'http://ex.co/foo#b'],
  ['bar#a', 'http://ex.co/foo'],
  ['bar#a', 'http://ex.co/foo#b'],
  ['http://xx.com/bar', 'http://ex.co/foo#b'],
  ['http://xx.com/bar#a', 'http://ex.co/foo'],
  ['http://xx.com/bar#a', 'http://ex.co/foo#b'],

  ['foo', 'bar'],
  [undefined, 'bar'],
  ['foo', undefined],
  [undefined, undefined],

  ['foo', 'bar'],
  ['', 'bar'],
  ['foo', ''],
  ['', ''],
  ['http://ex.co/foo', ''],
  ['https://ex.co/foo', ''],
  ['http://ex.co/foo/', ''],

  ['?x=1', 'http://ex.co/foo'],
  ['?x=1', 'http://ex.co/foo?y=4'],
  ['?x=1#h', 'http://ex.co/foo'],
  ['?x=1#h', 'http://ex.co/foo?y=4'],
  ['?x=1#h', 'http://ex.co/foo#f'],
  ['?x=1#h', 'http://ex.co/foo?y=4#f'],
  ['bar?x=1', 'http://ex.co/foo'],
  ['bar', 'http://ex.co/foo'],
  ['bar?x=1', 'http://ex.co/foo'],
  ['bar?x=1', 'http://ex.co/foo'],
  ['http://a.ex.co/', 'http://b.ex.co'],
  ['http://a.ex.co', 'http://b.ex.co/'],
  ['http://a.ex.co', 'http://b.ex.co'],

  ['/bar', 'http://ex.co/foo/'],
  ['/', 'http://ex.co/foo/'],

  // url missing protocol
  ['//x.com', 'http://ex.co/'],
  ['//x.com', 'https://ex.co/'],
  ['//x.com/foo', 'https://ex.co/'],
  ['//x.com/foo', 'https://ex.co/bar'],
  ['///', 'http://ex.co/'],
  ['//foo/', 'http://ex.co/'],
  // ['///foo', 'http://ex.co/'], // TODO should be http://foo/ Why?

  // proper case
  ['foo', 'HTTP://EX.COM'],
  ['foo', 'HttP://Ec.Com'],
  ['FOO', 'HTTP://EX.COM'],
  ['FOO', 'http://ex.com'],
  ['FOO?x=Y', 'http://ex.com'],
  ['FOO?X=y', 'http://ex.com'],
  ['FOO#BAR', 'http://ex.com'],
];

// Compare our implimentation using `new URL()` as a reference
describe('resolve', () => {
  testCases.forEach((testCase: any) => {
    const [url, baseURL] = testCase;
    try {
      const expectedResult = new URL(url, baseURL).href;
      it(`returns "${expectedResult}" given resolve("${url}", "${baseURL}")`, () => {
        const result = resolve(url, baseURL);
        expect(result).toBe(expectedResult);
      });
    } catch (ex) {
      it(`properly throws with resolve("${url}", "${baseURL}")`, () => {
        expect(() => resolve(url, baseURL)).toThrow();
      });
    }
  });
});
