function generateArrayBuffer (data: number[]) {
  const uintArray = new Uint8Array(data)
  return uintArray.buffer.slice(uintArray.byteOffset, uintArray.byteLength + uintArray.byteOffset);
}

export class TestTaggedValue {
  constructor (value: any, tag: number) {
    this.value = value
    this.tag = tag
  }

  value: any
  tag: number

  toArgs (): [any, number] {
    return [this.value, this.tag]
  }
}

export const testcases: any[][] = [
  ['PositiveIntegerFix 0', '00', 0],
  ['PositiveIntegerFix 1', '01', 1],
  ['PositiveIntegerFix 10', '0a', 10],
  ['PositiveIntegerFix 23', '17', 23],
  ['PositiveIntegerFix 24', '1818', 24],
  ['PositiveInteger8 25', '1819', 25],
  ['PositiveInteger8 100', '1864', 100],
  ['PositiveInteger16 1000', '1903e8', 1000],
  ['PositiveInteger32 1000000', '1a000f4240', 1000000],
  ['PositiveInteger64 1000000000000', '1b000000e8d4a51000', 1000000000000],
  ['PositiveInteger64 9007199254740991', '1b001fffffffffffff', 9007199254740991],
  ['PositiveInteger64 9007199254740992', '1b0020000000000000', 9007199254740992],
  ['PositiveInteger64 18446744073709551615', '1bffffffffffffffff', 18446744073709551615, true],
  ['NegativeIntegerFix -1', '20', -1],
  ['NegativeIntegerFix -10', '29', -10],
  ['NegativeIntegerFix -24', '37', -24],
  ['NegativeInteger8 -25', '3818', -25],
  ['NegativeInteger8 -26', '3819', -26],
  ['NegativeInteger8 -100', '3863', -100],
  ['NegativeInteger16 -1000', '3903e7', -1000],
  ['NegativeInteger32 -1000000', '3a000f423f', -1000000],
  ['NegativeInteger64 -1000000000000', '3b000000e8d4a50fff', -1000000000000],
  ['NegativeInteger64 -9007199254740992', '3b001fffffffffffff', -9007199254740992],
  ['NegativeInteger64 -18446744073709551616', '3bffffffffffffffff', -18446744073709551616, true],
  ['ByteString []', '40', generateArrayBuffer([])],
  ['Bytestring [1,2,3,4]', '4401020304', generateArrayBuffer([1, 2, 3, 4])],
  ['Bytestring [1,2,3,4,5]', '5f42010243030405ff', generateArrayBuffer([1, 2, 3, 4, 5]), true],
  ["String ''", '60', ''],
  ["String 'a'", '6161', 'a'],
  ["String 'IETF'", '6449455446', 'IETF'],
  ["String '\"\\'", '62225c', '"\\'],
  ["String '\u00fc' (U+00FC)", '62c3bc', '\u00fc'],
  ["String '\u6c34' (U+6C34)", '63e6b0b4', '\u6c34'],
  ["String '\ud800\udd51' (U+10151)", '64f0908591', '\ud800\udd51'],
  ["String 'streaming'", '7f657374726561646d696e67ff', 'streaming', true],
  ['Array []', '80', []],
  ["Array ['a', {'b': 'c'}]", '826161a161626163', ['a', { b: 'c' }]],
  ["Array ['a, {_ 'b': 'c'}]", '826161bf61626163ff', ['a', { b: 'c' }], true],
  ['Array [1,2,3]', '83010203', [1, 2, 3]],
  ['Array [1, [2, 3], [4, 5]]', '8301820203820405', [1, [2, 3], [4, 5]]],
  ['Array [1, [2, 3], [_ 4, 5]]', '83018202039f0405ff', [1, [2, 3], [4, 5]], true],
  ['Array [1, [_ 2, 3], [4, 5]]', '83019f0203ff820405', [1, [2, 3], [4, 5]], true],
  [
    'Array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]',
    '98190102030405060708090a0b0c0d0e0f101112131415161718181819',
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  ],
  [
    'Array [_ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]',
    '9f0102030405060708090a0b0c0d0e0f101112131415161718181819ff',
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    true
  ],
  ['Array [_ 1, [2, 3], [4, 5]]', '9f01820203820405ff', [1, [2, 3], [4, 5]], true],
  ['Array [_ 1, [2, 3], [_ 4, 5]]', '9f018202039f0405ffff', [1, [2, 3], [4, 5]], true],
  ['Array [_ ]', '9fff', [], true],
  ['Object {}', 'a0', {}],
  ['Object {1: 2, 3: 4}', 'a201020304', { 1: 2, 3: 4 }, true],
  ["Object {'a': 1, 'b': [2, 3]}", 'a26161016162820203', { a: 1, b: [2, 3] }, true],
  [
    "Object {'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E'}",
    'a56161614161626142616361436164614461656145',
    { a: 'A', b: 'B', c: 'C', d: 'D', e: 'E' },
    true
  ],
  ["Object {_ 'a': 1, 'b': [_ 2, 3]}", 'bf61610161629f0203ffff', { a: 1, b: [2, 3] }, true],
  ["Object {_ 'Fun': true, 'Amt': -2}", 'bf6346756ef563416d7421ff', { Fun: true, Amt: -2 }, true],
 ['false', 'f4', false],
  ['true', 'f5', true],
  ['null', 'f6', null],
  ['undefined', 'f7', undefined],
  ['UnassignedSimpleValue 255', 'f8ff', undefined, true],
  ['Float16 0.0', 'f90000', 0.0, true],
  ['Float16 -0.0', 'f98000', -0.0, true],
  ['Float16 1.0', 'f93c00', 1.0, true],
  ['Float16 1.5', 'f93e00', 1.5, true],
  ['Float16 65504.0', 'f97bff', 65504.0, true],
  ['Float16 5.960464477539063e-8', 'f90001', 5.960464477539063e-8, true],
  ['Float16 0.00006103515625', 'f90400', 0.00006103515625, true],
  ['Float16 -5.960464477539063e-8', 'f98001', -5.960464477539063e-8, true],
  ['Float16 -4.0', 'f9c400', -4.0, true],
  ['Float16 +Infinity', 'f97c00', Infinity, true],
  ['Float16 NaN', 'f97e00', NaN, true],
  ['Float16 -Infinity', 'f9fc00', -Infinity, true],
  ['Float32 100000.0', 'fa47c35000', 100000.0, true],
  ['Float32 3.4028234663852886e+38', 'fa7f7fffff', 3.4028234663852886e38, true],
  ['Float32 +Infinity', 'fa7f800000', Infinity, true],
  ['Float32 NaN', 'fa7fc00000', NaN, true],
  ['Float32 -Infinity', 'faff800000', -Infinity, true],
  ['Float64 1.1', 'fb3ff199999999999a', 1.1],
  ['Float64 9007199254740994', 'fb4340000000000001', 9007199254740994],
  ['Float64 1.0e+300', 'fb7e37e43c8800759c', 1.0e300],
  ['Float64 -4.1', 'fbc010666666666666', -4.1],
  ['Float64 -9007199254740994', 'fbc340000000000001', -9007199254740994],
  ['Float64 +Infinity', 'fb7ff0000000000000', Infinity],
  ['Float64 NaN', 'fb7ff8000000000000', NaN, true],
  ['Float64 -Infinity', 'fbfff0000000000000', -Infinity],
  ['Tagged 55799(0) (aka Self-describe CBOR)', 'd9d9f700', new TestTaggedValue(0, 55799)],
  ['Tagged 0xffffffff(0)', 'db000000ffffffffff00', new TestTaggedValue(0, 0xffffffffff)],
  ['Tagged 0xffffffff(0)', 'daffffffff00', new TestTaggedValue(0, 0xffffffff)],
  ['Tagged 25(0)', 'd81900', new TestTaggedValue(0, 25)],
  ['Tagged 0("2020-09-20T00:11:24.937Z") (aka iso date)', 'c07818323032302d30392d32305430303a31313a32342e3933375a', new TestTaggedValue('2020-09-20T00:11:24.937Z', 0)],
  ['Tagged 1(1600560146.876) (aka fractional date)', 'c1fb41d7d9a704b81062', new TestTaggedValue(1600560146.876, 1)],
  ['Tagged 1(1600560146) (aka integer date)', 'c11a5f669c12', new TestTaggedValue(1600560146, 1)],
  ['Uint8Array [1,2]', 'd8404401020304', new Uint8Array([1, 2, 3, 4])],
  ['Int8Array [1,2]', 'd848440102fdfc', new Int8Array([1, 2, -3, -4])],
  ['Uint16Array', 'd8454801000200ffff0400', new Uint16Array([1, 2, 65535, 4])],
  ['Int16Array', 'd84d4801000200ff7ffcff', new Int16Array([1, 2, 32767, -4])],
  ['Uint32Array', 'd8465001000000020000000000010004000000', new Uint32Array([1, 2, 65536, 4])],
  ['Int32Array', 'd84e50010000000200000000000100fcffffff', new Int32Array([1, 2, 65536, -4])],
  ['Float32Array', 'd855500000803f000000400000a03f0000a0bf', new Float32Array([1, 2, 1.25, -1.25])],
  [
    'Float64Array',
    'd8565820000000000000f03f0000000000000040000000000000f43f000000000000f4bf',
    new Float64Array([1, 2, 1.25, -1.25])
  ]
]
