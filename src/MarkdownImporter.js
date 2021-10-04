import * as remark from 'remark';
import { parseMarkdownToHeader } from './BlockTypeParsers/HeaderTypeParser';
import { parseMarkdownToParagraph } from './BlockTypeParsers/ParagraphTypeParser';
import { parseMarkdownToList } from './BlockTypeParsers/ListTypeParser';
import { parseMarkdownToDelimiter } from './BlockTypeParsers/DelimiterTypeParser';
import { parseMarkdownToCode } from './BlockTypeParsers/CodeTypeParser';
import { parseMarkdownToQuote } from './BlockTypeParsers/QuoteTypeParser';

/**
 * Markdown Import class
 */
export default class MarkdownImporter {
  /**
   * creates the Importer plugin
   * {editorData, api functions} - necessary to interact with the editor
   */
  constructor({ api }) {
    this.api = api;
  }

  /**
   * @return Plugin data such as title and icon
   */
  static get toolbox() {
    return {
      title: 'Paste Markdown',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(112, 118, 132)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-fileUpload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
    };
  }

  /**
   * @return HTMLElement Empty div. It is replaced after rendering.
   */
  render() {
    // Ask for markdown data
    const markdown = document.defaultView.prompt('Markdown text...', '');

    // Parse into a list of EditorJS blocks
    const blocks = this.markdownToBlock(markdown);
    blocks.forEach(({ type, data }) => this.api.blocks.insert(type, data));

    // Delete current block right after
    setTimeout(() => { this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex() - 1); }, 0);

    return document.createElement('div');
  }

  /**
   * Convert some text in Markdown format to a list of blocks
   *
   * @param markdown string Text to parse
   */
  markdownToBlock(markdown) {
    // Blocks with the parsed content
    const blocks = [];

    const parsedMarkdown = remark().parse(markdown);
    // Iterate over the pared remarkjs syntax tree and executing the json parsers
    parsedMarkdown.children.forEach((item) => {
      switch (item.type) {
        case 'heading':
          return blocks.push(parseMarkdownToHeader(item));
        case 'paragraph':
          return blocks.push(parseMarkdownToParagraph(item));
        case 'list':
          return blocks.push(parseMarkdownToList(item));
        case 'thematicBreak':
          return blocks.push(parseMarkdownToDelimiter());
        case 'code':
          return blocks.push(parseMarkdownToCode(item));
        case 'blockquote':
          return blocks.push(parseMarkdownToQuote(item));
        default:
          break;
      }
      return null;
    });

    return blocks;
  }

  save() {
    return {
      message: 'Uploading Markdown',
    };
  }
}
