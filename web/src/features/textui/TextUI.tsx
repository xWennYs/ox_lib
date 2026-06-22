import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const KEY_TOKEN = /\{([^}]+)\}/g;
const hasKeyToken = (text: string) => /\{[^}]+\}/.test(text);

const useStyles = createStyles((_theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems:
      params.position === 'top-center' ? 'baseline' : params.position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent:
      params.position === 'right-center' ? 'flex-end' : params.position === 'left-center' ? 'flex-start' : 'center',
  },
  container: {
    fontSize: 16,
    padding: '12px 16px',
    margin: 8,
    backgroundColor: 'var(--ov-surface)',
    color: 'var(--ov-text)',
    fontFamily: 'var(--ov-font)',
    borderRadius: 'var(--ov-r-md)',
    border: '1px solid var(--ov-border)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 200,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  rowInline: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  label: {
    color: 'var(--ov-text)',
  },
  keys: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  key: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    height: 24,
    padding: '0 7px',
    backgroundColor: 'var(--ov-raised)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: 6,
    color: 'var(--ov-text)',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'var(--ov-font)',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
}));

// Splits a string into text spans and key-cap badges for any {KEY} tokens.
const renderInline = (text: string, keyClass: string, prefix: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  KEY_TOKEN.lastIndex = 0;
  while ((match = KEY_TOKEN.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(<span key={`${prefix}-t${i}`}>{text.slice(lastIndex, match.index)}</span>);
    nodes.push(
      <kbd key={`${prefix}-k${i}`} className={keyClass}>
        {match[1].trim()}
      </kbd>
    );
    lastIndex = match.index + match[0].length;
    i++;
  }
  if (lastIndex < text.length) nodes.push(<span key={`${prefix}-t${i}`}>{text.slice(lastIndex)}</span>);
  return nodes;
};

const KeyContent: React.FC<{ text: string; classes: Record<string, string> }> = ({ text, classes }) => {
  const lines = text.split('\n');
  return (
    <Box className={classes.content}>
      {lines.map((line, idx) => {
        // "Label {KEY}" -> label on the left, key-cap(s) pushed to the right
        const trailing = line.match(/^(.*?\S)\s+((?:\{[^}]+\}\s*)+)$/);
        if (trailing) {
          return (
            <Box key={idx} className={classes.row}>
              <span className={classes.label}>{trailing[1]}</span>
              <Box className={classes.keys}>{renderInline(trailing[2], classes.key, `r${idx}`)}</Box>
            </Box>
          );
        }
        return (
          <Box key={idx} className={classes.rowInline}>
            {renderInline(line, classes.key, `r${idx}`)}
          </Box>
        );
      })}
    </Box>
  );
};

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center'; // Default right position
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box style={data.style} className={classes.container}>
            <Group spacing={12} align={data.text.includes('\n') ? 'flex-start' : 'center'} noWrap>
              {data.icon && (
                <LibIcon
                  icon={data.icon}
                  fixedWidth
                  size="lg"
                  animation={data.iconAnimation}
                  style={{
                    color: data.iconColor ?? 'var(--ov-muted)',
                    alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                  }}
                />
              )}
              {hasKeyToken(data.text) ? (
                <KeyContent text={data.text} classes={classes} />
              ) : (
                <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                  {data.text}
                </ReactMarkdown>
              )}
            </Group>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
