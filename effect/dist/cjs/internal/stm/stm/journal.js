"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInvalid = exports.isValid = exports.addTodo = exports.execTodos = exports.collectTodos = exports.prepareResetJournal = exports.analyzeJournal = exports.commitJournal = exports.JournalAnalysisReadOnly = exports.JournalAnalysisReadWrite = exports.JournalAnalysisInvalid = void 0;
const Entry = /*#__PURE__*/require("./entry.js");
/** @internal */
exports.JournalAnalysisInvalid = "Invalid";
/** @internal */
exports.JournalAnalysisReadWrite = "ReadWrite";
/** @internal */
exports.JournalAnalysisReadOnly = "ReadOnly";
/** @internal */
const commitJournal = journal => {
  for (const entry of journal) {
    Entry.commit(entry[1]);
  }
};
exports.commitJournal = commitJournal;
/**
 * Analyzes the journal, determining whether it is valid and whether it is
 * read only in a single pass. Note that information on whether the
 * journal is read only will only be accurate if the journal is valid, due
 * to short-circuiting that occurs on an invalid journal.
 *
 * @internal
 */
const analyzeJournal = journal => {
  let val = exports.JournalAnalysisReadOnly;
  for (const [, entry] of journal) {
    val = Entry.isInvalid(entry) ? exports.JournalAnalysisInvalid : Entry.isChanged(entry) ? exports.JournalAnalysisReadWrite : val;
    if (val === exports.JournalAnalysisInvalid) {
      return val;
    }
  }
  return val;
};
exports.analyzeJournal = analyzeJournal;
/** @internal */
const prepareResetJournal = journal => {
  const saved = new Map();
  for (const entry of journal) {
    saved.set(entry[0], Entry.copy(entry[1]));
  }
  return () => {
    journal.clear();
    for (const entry of saved) {
      journal.set(entry[0], entry[1]);
    }
  };
};
exports.prepareResetJournal = prepareResetJournal;
/** @internal */
const collectTodos = journal => {
  const allTodos = new Map();
  for (const [, entry] of journal) {
    for (const todo of entry.ref.todos) {
      allTodos.set(todo[0], todo[1]);
    }
    entry.ref.todos = new Map();
  }
  return allTodos;
};
exports.collectTodos = collectTodos;
/** @internal */
const execTodos = todos => {
  const todosSorted = Array.from(todos.entries()).sort((x, y) => x[0] - y[0]);
  for (const [_, todo] of todosSorted) {
    todo();
  }
};
exports.execTodos = execTodos;
/** @internal */
const addTodo = (txnId, journal, todoEffect) => {
  let added = false;
  for (const [, entry] of journal) {
    if (!entry.ref.todos.has(txnId)) {
      entry.ref.todos.set(txnId, todoEffect);
      added = true;
    }
  }
  return added;
};
exports.addTodo = addTodo;
/** @internal */
const isValid = journal => {
  let valid = true;
  for (const [, entry] of journal) {
    valid = Entry.isValid(entry);
    if (!valid) {
      return valid;
    }
  }
  return valid;
};
exports.isValid = isValid;
/** @internal */
const isInvalid = journal => {
  return !(0, exports.isValid)(journal);
};
exports.isInvalid = isInvalid;
//# sourceMappingURL=journal.js.map