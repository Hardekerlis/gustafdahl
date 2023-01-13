import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import Code from '@editorjs/code';
import Embed from '@editorjs/embed';

const EDITOR_JS_TOOLS = {
  paragraph: Paragraph,
  header: Header,
  code: Code,
  embed: Embed,
};

Object.freeze(EDITOR_JS_TOOLS);

export { EDITOR_JS_TOOLS };
