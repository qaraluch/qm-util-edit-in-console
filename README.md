![logo-qm](./pic/logo-qm.jpg)

# qm-util-edit-in-console [![npm version](https://badge.fury.io/js/qm-util-edit-in-console.svg)](https://badge.fury.io/js/qm-util-edit-in-console) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Edit .json data in console using terminal editor (promisfied).

## Installation

```sh
$ npm i -S qm-util-edit-in-console
```

## Usage

```js
import editInConsole from "qm-util-edit-in-console";

// default options
const options = {
  fileName: ".tempToEditInVim.json",
  editor: "vim",
  dirPath: process.cwd(),
  removeTempFile: true
};

(async function edit() {
  try {
    const objToEdit = { editMe: "terefere" };
    const newObj = await editInConsole(objToEdit, options);
    console.log("newObj ", newObj);
  } catch (error) {
    console.log("Error: ", error);
  }
})();
```

## Credits

Based on [substack/node-editor](https://github.com/substack/node-editor).

## License

MIT © [qaraluch](https://github.com/qaraluch)
