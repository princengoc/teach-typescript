import { expect, test } from 'vitest';
import { renderMarkdown } from './markdown';

test('headings, inline code, and bold', () => {
  const html = renderMarkdown('# Card 01\n\n**`const`** names a `value`.');
  expect(html).toContain('<h2>Card 01</h2>');
  expect(html).toContain('<b><code>const</code></b>');
  expect(html).toContain('names a <code>value</code>');
});

test('a pipe table becomes a table', () => {
  const html = renderMarkdown('| A | B |\n| --- | --- |\n| one | two |');
  expect(html).toContain('<th>A</th><th>B</th>');
  expect(html).toContain('<td>one</td><td>two</td>');
});

test('fenced code keeps its line breaks and escapes markup', () => {
  const html = renderMarkdown('```ts\nconst a = 1;\nconst b = a < 2;\n```');
  expect(html).toContain(
    '<pre><code>const a = 1;\nconst b = a &lt; 2;</code></pre>',
  );
});

test('a paragraph joins its wrapped lines', () => {
  const html = renderMarkdown('one line\nand its wrap.\n\nA second.');
  expect(html).toContain('<p>one line and its wrap.</p>');
  expect(html).toContain('<p>A second.</p>');
});

test('bullets become a list', () => {
  const html = renderMarkdown('- first\n- second');
  expect(html).toBe('<ul><li>first</li><li>second</li></ul>');
});

test('an indented line continues the bullet above it', () => {
  const html = renderMarkdown('- one, and its\n  wrapped tail\n- two');
  expect(html).toBe('<ul><li>one, and its wrapped tail</li><li>two</li></ul>');
});

test('the lesson card renders every block it uses', () => {
  const html = renderMarkdown(
    '# Card\n\nWords.\n\n## The words\n\n```ts\nconst a = 1;\n```\n\n| A | B |\n| --- | --- |\n| x | y |\n\n- note\n',
  );
  for (const tag of ['<h2>', '<h3>', '<p>', '<pre>', '<table>', '<ul>']) {
    expect(html).toContain(tag);
  }
});
