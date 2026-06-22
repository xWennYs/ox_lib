import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles(() => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '25%',
    width: 340,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 580,
    background: 'var(--ov-surface)',
    border: '1px solid var(--ov-border)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    padding: '14px 16px',
    borderBottom: '1px solid var(--ov-divider)',
  },
  titleContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  titleText: {
    color: 'var(--ov-text)',
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.25,
  },
  subtitleText: {
    color: 'var(--ov-muted)',
    fontSize: 13,
    lineHeight: 1.3,
  },
  buttonsContainer: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: 6,
  },
  buttonsFlexWrapper: {
    gap: 2,
  },
  footer: {
    padding: '10px 16px',
    borderTop: '1px solid var(--ov-divider)',
    color: 'var(--ov-faint)',
    fontSize: 12,
  },
  footerKey: {
    color: 'var(--ov-muted)',
    fontWeight: 600,
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Box className={classes.panel}>
          <Flex className={classes.header}>
            {contextMenu.menu && (
              <HeaderButton icon="chevron-left" iconSize={18} handleClick={() => openMenu(contextMenu.menu)} />
            )}
            <Box className={classes.titleContainer}>
              <Text className={classes.titleText}>
                <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
              </Text>
              {contextMenu.subtitle && (
                <Text className={classes.subtitleText}>
                  <ReactMarkdown components={MarkdownComponents}>{contextMenu.subtitle}</ReactMarkdown>
                </Text>
              )}
            </Box>
            <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
          </Flex>
          <Box className={classes.buttonsContainer}>
            <Stack className={classes.buttonsFlexWrapper}>
              {Object.entries(contextMenu.options).map((option, index) => (
                <ContextButton option={option} key={`context-item-${index}`} />
              ))}
            </Stack>
          </Box>
          <Box className={classes.footer}>
            Press <span className={classes.footerKey}>ESC</span> to close
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;
