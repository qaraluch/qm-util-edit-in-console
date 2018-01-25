import path from "path";
import touch from "qm-fs-touch";
import { spawn } from "child_process";
import loadJsonFile from "load-json-file";
import del from "del";
import pIf from "p-if";

export default function editInConsole(object, options = {}) {
  const defaultOptions = {
    fileName: ".tempToEditInVim.json",
    editor: "vim",
    dirPath: process.cwd(),
    removeTempFile: true
  };

  const initState = {
    moduleName: "qm-util-edit-in-console",
    objToEdit: Object.assign(Object.create(null), object)
  };

  const state = Object.assign(
    Object.create(null),
    initState,
    defaultOptions,
    options
  );
  return Promise.resolve(state)
    .then(creatTempFile)
    .then(spawnEditor)
    .then(readEditedFile)
    .then(pIf(state.removeTempFile === true, removeTempFile))
    .then(returnEditedObject)
    .catch(handleExeptions.bind(state));
}

async function creatTempFile(state) {
  state.filePath = path.resolve(state.dirPath, state.fileName);
  const options = {
    encoding: "utf8",
    overwrite: true
  };
  try {
    await touch(
      state.filePath,
      JSON.stringify(state.objToEdit, null, 2),
      options
    );
    return state;
  } catch (err) {
    throw err;
  }
}

function spawnPromisfied(editor, filePath) {
  return new Promise((resolve, reject) => {
    const vim = spawn("vim", [filePath], { stdio: "inherit" });
    vim.on("close", code => {
      if (code !== 0) {
        reject(`Editor child process exited with code: ${code}`);
      }
      resolve(true);
    });
  });
}

async function spawnEditor(state) {
  try {
    await spawnPromisfied(state.editor, state.filePath);
    return state;
  } catch (error) {
    throw new Error(error);
  }
}

async function readEditedFile(state) {
  try {
    state.newObject = await loadJsonFile(state.filePath);
    return state;
  } catch (error) {
    throw error;
  }
}

async function removeTempFile(state) {
  try {
    del(state.filePath, { force: true });
    return state;
  } catch (error) {
    throw error;
  }
}

function returnEditedObject(state) {
  return state.newObject;
}

function handleExeptions(error) {
  const state = this;
  del(state.filePath, { force: true });
  throw new Error(`${state.moduleName} Error: ${error.message}`);
}
