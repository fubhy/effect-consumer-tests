"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isChanged = exports.isInvalid = exports.isValid = exports.copy = exports.commit = exports.unsafeSet = exports.unsafeGet = exports.make = void 0;
const Versioned = /*#__PURE__*/require("./versioned.js");
/** @internal */
const make = (ref, isNew) => ({
  ref,
  isNew,
  isChanged: false,
  expected: ref.versioned,
  newValue: ref.versioned.value
});
exports.make = make;
const unsafeGet = self => {
  return self.newValue;
};
exports.unsafeGet = unsafeGet;
/** @internal */
const unsafeSet = (self, value) => {
  self.isChanged = true;
  self.newValue = value;
};
exports.unsafeSet = unsafeSet;
/** @internal */
const commit = self => {
  self.ref.versioned = new Versioned.Versioned(self.newValue);
};
exports.commit = commit;
/** @internal */
const copy = self => ({
  ref: self.ref,
  isNew: self.isNew,
  isChanged: self.isChanged,
  expected: self.expected,
  newValue: self.newValue
});
exports.copy = copy;
/** @internal */
const isValid = self => {
  return self.ref.versioned === self.expected;
};
exports.isValid = isValid;
/** @internal */
const isInvalid = self => {
  return self.ref.versioned !== self.expected;
};
exports.isInvalid = isInvalid;
/** @internal */
const isChanged = self => {
  return self.isChanged;
};
exports.isChanged = isChanged;
//# sourceMappingURL=entry.js.map