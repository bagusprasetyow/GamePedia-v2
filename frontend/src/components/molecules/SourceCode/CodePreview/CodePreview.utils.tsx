import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import { syntaxTokenClasses } from './CodePreview.styles';

/**
 * Pola regex global untuk sintaks JSX, HTML, attributes, string literal, dan kurung kurawal.
 * Didefinisikan di level modul untuk menghindari alokasi memori berulang pada setiap baris kode.
 */
export const SYNTAX_REGEX = /("[^"]*"|=\{[^}]*\}|<\/?[a-zA-Z0-9_-]+|\/>|>|[a-zA-Z0-9_-]+(?==)|=)/g;

/**
 * Tokenizer untuk render syntax highlighting real-time bergaya resmi VS Code Dark+.
 * Menggunakan token warna khusus yang kontras dan konsisten di terminal gelap (bg-neutral-950).
 *
 * @param {string} line - Baris teks kode
 * @param {number} lineIndex - Indeks baris untuk React key
 * @returns {ReactElement} Elemen baris dengan token warna khusus
 */
export const renderHighlightedLine = (line: string, lineIndex: number): ReactElement => {
  if (line.trim().startsWith('<!--')) {
    const commentClasses = cn(
      syntaxTokenClasses.comment,
      // size
      'min-h-5'
    );
    return (
      <Text
        as="div"
        key={lineIndex}
        className={commentClasses}
      >
        {line}
      </Text>
    );
  }

  // Reset lastIndex agar pemindaian baris selalu dimulai dari karakter awal secara aman
  SYNTAX_REGEX.lastIndex = 0;
  const parts: ReactElement[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = SYNTAX_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      const plainText = line.substring(lastIndex, match.index);
      parts.push(
        <Text
          as="span"
          key={`plain-${lineIndex}-${lastIndex}`}
          className={syntaxTokenClasses.plainText}
        >
          {plainText}
        </Text>
      );
    }

    const token = match[0];
    if (token.startsWith('"') && token.endsWith('"')) {
      parts.push(
        <Text
          as="span"
          key={`str-${lineIndex}-${match.index}`}
          className={syntaxTokenClasses.string}
        >
          {token}
        </Text>
      );
    } else if (token.startsWith('={') && token.endsWith('}')) {
      const val = token.slice(2, -1);
      parts.push(
        <Text as="span" key={`expr-${lineIndex}-${match.index}`} className="font-mono">
          <Text as="span" className={syntaxTokenClasses.punctuation}>=</Text>
          <Text as="span" className={syntaxTokenClasses.punctuation}>{'{'}</Text>
          <Text as="span" className={syntaxTokenClasses.number}>{val}</Text>
          <Text as="span" className={syntaxTokenClasses.punctuation}>{'}'}</Text>
        </Text>
      );
    } else if (token.startsWith('<') || token === '>' || token === '/>') {
      parts.push(
        <Text
          as="span"
          key={`tag-${lineIndex}-${match.index}`}
          className={syntaxTokenClasses.tag}
        >
          {token}
        </Text>
      );
    } else if (token === '=') {
      parts.push(
        <Text
          as="span"
          key={`eq-${lineIndex}-${match.index}`}
          className={syntaxTokenClasses.punctuation}
        >
          =
        </Text>
      );
    } else {
      parts.push(
        <Text
          as="span"
          key={`attr-${lineIndex}-${match.index}`}
          className={syntaxTokenClasses.attribute}
        >
          {token}
        </Text>
      );
    }

    lastIndex = SYNTAX_REGEX.lastIndex;
  }

  if (lastIndex < line.length) {
    const trailingText = line.substring(lastIndex);
    const trimmed = trailingText.trim();
    if (trimmed === 'disabled' || trimmed === 'isLoading') {
      const indent = trailingText.match(/^\s*/)?.[0] || '';
      parts.push(
        <Text as="span" key={`bool-${lineIndex}`} className="font-mono">
          {indent}
          <Text as="span" className={syntaxTokenClasses.boolean}>{trimmed}</Text>
        </Text>
      );
    } else {
      parts.push(
        <Text
          as="span"
          key={`trailing-${lineIndex}`}
          className={syntaxTokenClasses.plainText}
        >
          {trailingText}
        </Text>
      );
    }
  }

  const lineContainerClasses = cn(
    // size
    'min-h-5'
  );

  return (
    <Text as="div" key={lineIndex} className={lineContainerClasses}>
      {parts.length > 0 ? parts : <Text as="span">&nbsp;</Text>}
    </Text>
  );
};
