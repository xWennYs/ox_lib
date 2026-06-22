import React from 'react';
import { Box, createStyles, Group, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import LibIcon from '../../components/LibIcon';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles(() => ({
  wrapper: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  container: {
    width: 360,
    padding: '14px 16px',
    backgroundColor: 'var(--ov-surface)',
    border: '1px solid var(--ov-border)',
    borderRadius: 'var(--ov-r-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  header: {
    gap: 10,
    flexWrap: 'nowrap',
  },
  icon: {
    color: 'var(--ov-text)',
    flexShrink: 0,
  },
  title: {
    flex: 1,
    minWidth: 0,
    color: 'var(--ov-text)',
    fontSize: 15,
    fontWeight: 600,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  percent: {
    flexShrink: 0,
    color: 'var(--ov-muted)',
    fontSize: 13,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  description: {
    color: 'var(--ov-muted)',
    fontSize: 13,
    lineHeight: 1.3,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  track: {
    width: '100%',
    height: 6,
    backgroundColor: 'var(--ov-raised)',
    borderRadius: 'var(--ov-r-pill)',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: 'var(--ov-accent)',
    borderRadius: 'var(--ov-r-pill)',
  },
  footer: {
    color: 'var(--ov-faint)',
    fontSize: 12,
    marginTop: 2,
  },
  footerKey: {
    color: 'var(--ov-muted)',
    fontWeight: 600,
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = React.useState<ProgressbarProps>({ label: '', duration: 0 });
  const [percent, setPercent] = React.useState(0);
  const rafRef = React.useRef<number>();
  const startRef = React.useRef(0);

  const stopRaf = () => {
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
  };

  useNuiEvent('progressCancel', () => {
    stopRaf();
    setVisible(false);
  });

  useNuiEvent<ProgressbarProps>('progress', (payload) => {
    stopRaf();
    setData(payload);
    setPercent(0);
    setVisible(true);
    startRef.current = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const p = payload.duration > 0 ? Math.min(100, (elapsed / payload.duration) * 100) : 100;
      setPercent(Math.floor(p));
      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = undefined;
        setVisible(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  });

  React.useEffect(() => stopRaf, []);

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <Box className={classes.container}>
          <Group className={classes.header}>
            {data.icon && (
              <LibIcon icon={data.icon as IconProp} fixedWidth fontSize={18} className={classes.icon} />
            )}
            <Text className={classes.title}>{data.label}</Text>
            <Text className={classes.percent}>{percent}%</Text>
          </Group>
          {data.description && <Text className={classes.description}>{data.description}</Text>}
          <Box className={classes.track}>
            <Box className={classes.bar} sx={{ width: `${percent}%` }} />
          </Box>
          {data.canCancel !== false && (
            <Text className={classes.footer}>
              Press <span className={classes.footerKey}>X</span> to cancel
            </Text>
          )}
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default Progressbar;
