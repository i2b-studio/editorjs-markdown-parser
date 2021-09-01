export function parseParagraphToMarkdown(blocks) {
  return `${blocks.text}\n`;
}

export function parseMarkdownToParagraph(blocks) {
  console.log('Blocks', blocks);
  let paragraphData = {};

  if (blocks.type === 'paragraph') {
    paragraphData = {
      data: {
        text: blocks.children.reduce((acc, curr) => acc.concat(parsePhrasingContentToParagraph(curr)), ''),
      },
      type: 'paragraph'
    }
  }
  return paragraphData;
}


function parsePhrasingContentToParagraph(content) {
  let text = '';
  switch (content.type) {
    case 'break':
      text = text.concat('<br>');
      break;
    case 'text':
      text = text.concat(content.value);
      break;
    case 'emphasis':
      text = text.concat(`<i>${ content.children.reduce((acc, cur) => acc.concat(parsePhrasingContentToParagraph(cur)), '') }</i>`);
      break;
    case 'strong':
      text = text.concat(`<b>${ content.children.reduce((acc, cur) => acc.concat(parsePhrasingContentToParagraph(cur)), '') }</b>`);
      break;
  }
  return text;
}
