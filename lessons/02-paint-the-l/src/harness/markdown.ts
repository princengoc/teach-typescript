// A markdown subset, just enough to render a lesson card: headings, rules,
// paragraphs, bullets, fenced code, and pipe tables. The card stays the one
// source of its own words; this puts it on screen.

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
}

function isTableRule(line: string): boolean {
  return /^\|(\s*:?-+:?\s*\|)+$/.test(line.trim());
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
}

function row(line: string, tag: 'td' | 'th'): string {
  const html = cells(line)
    .map((cell) => `<${tag}>${inline(cell)}</${tag}>`)
    .join('');
  return `<tr>${html}</tr>`;
}

export function renderMarkdown(source: string): string {
  const lines = source.split('\n');
  const out: string[] = [];
  let index = 0;

  const paragraph: string[] = [];
  const flush = (): void => {
    if (paragraph.length === 0) return;
    out.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph.length = 0;
  };

  while (index < lines.length) {
    const line = lines[index] ?? '';

    if (line.startsWith('```')) {
      flush();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? '').startsWith('```')) {
        code.push(lines[index] ?? '');
        index += 1;
      }
      index += 1;
      out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    if (line.startsWith('|') && isTableRule(lines[index + 1] ?? '')) {
      flush();
      const head = row(line, 'th');
      index += 2;
      const body: string[] = [];
      while ((lines[index] ?? '').startsWith('|')) {
        body.push(row(lines[index] ?? '', 'td'));
        index += 1;
      }
      out.push(
        `<table><thead>${head}</thead><tbody>${body.join('')}</tbody></table>`,
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flush();
      out.push(`<h3>${inline(line.slice(3))}</h3>`);
    } else if (line.startsWith('# ')) {
      flush();
      out.push(`<h2>${inline(line.slice(2))}</h2>`);
    } else if (line.trim() === '---') {
      flush();
      out.push('<hr />');
    } else if (line.startsWith('- ')) {
      flush();
      const items: string[] = [];
      // An indented line continues the bullet above it, as in a wrapped
      // sentence; anything else ends the list.
      while (index < lines.length) {
        const current = lines[index] ?? '';
        const last = items.length - 1;
        const previous = items[last];
        if (current.startsWith('- ')) {
          items.push(current.slice(2).trim());
        } else if (previous !== undefined && /^\s+\S/.test(current)) {
          items[last] = `${previous} ${current.trim()}`;
        } else {
          break;
        }
        index += 1;
      }
      const list = items.map((item) => `<li>${inline(item)}</li>`).join('');
      out.push(`<ul>${list}</ul>`);
      continue;
    } else if (line.trim() === '') {
      flush();
    } else {
      paragraph.push(line.trim());
    }

    index += 1;
  }

  flush();
  return out.join('\n');
}
