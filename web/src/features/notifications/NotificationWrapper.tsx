import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, createStyles, keyframes, Stack, Text } from '@mantine/core';
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles(() => ({
  container: {
    width: 'fit-content',
    maxWidth: 320,
    height: 'fit-content',
    backgroundColor: 'var(--ov-surface)',
    border: '1px solid var(--ov-border)',
    borderRadius: 10,
    padding: '11px 13px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  durationBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 2,
    backgroundColor: 'var(--ov-accent)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 5,
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--ov-muted)',
    fontSize: 16,
    flexShrink: 0,
    marginTop: 2,
  },
  title: {
    color: 'var(--ov-text)',
    fontWeight: 600,
    lineHeight: 'normal',
  },
  description: {
    fontSize: 12,
    color: 'var(--ov-muted)',
    lineHeight: 'normal',
  },
  descriptionOnly: {
    fontSize: 14,
    color: 'var(--ov-muted)',
    lineHeight: 'normal',
  },
}));

const createAnimation = (from: string, to: string, visible: boolean) => keyframes({
  from: {
    opacity: visible ? 0 : 1,
    transform: `translate${from}`,
  },
  to: {
    opacity: visible ? 1 : 0,
    transform: `translate${to}`,
  },
});

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.2s ease-out forwards' : '0.4s ease-in forwards'
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('bottom') ? { from: 'Y(30px)', to: 'Y(0px)' } : { from: 'Y(-30px)', to:'Y(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'X(0px)', to: 'X(100%)' }
    } else if (position.includes('left')) {
      animation = { from: 'X(0px)', to: 'X(-100%)' };
    } else if (position === 'top-center') {
      animation = { from: 'Y(0px)', to: 'Y(-100%)' };
    } else if (position === 'bottom-center') {
      animation = { from: 'Y(0px)', to: 'Y(100%)' };
    } else {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`
};

const durationBarShrink = keyframes({
  from: { width: '100%' },
  to: { width: '0%' },
});

const getDotColor = (type?: string): string => {
  switch (type) {
    case 'success':
      return 'var(--ov-ok)';
    case 'error':
      return 'var(--ov-danger)';
    case 'warning':
      return 'var(--ov-warn)';
    default:
      return 'var(--ov-text)';
  }
};

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let position = data.position || 'top-right';

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    if (toastId) setToastKey(prevKey => prevKey + 1);

    // Backwards compat with old notifications
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    // Resolve icon: caller-supplied takes precedence; fall back to type defaults
    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    // Resolve icon color: caller-supplied wins; default is subdued (--ov-muted)
    const resolvedIconColor = data.iconColor
      ? tinycolor(data.iconColor).toRgbString()
      : 'var(--ov-muted)';

    // Status dot color is always driven by type (not caller-overridable via iconColor)
    const dotColor = getDotColor(data.type);

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            ...data.style,
          }}
          className={classes.container}
        >
          {/* Status dot — primary semantic signal */}
          <div className={classes.dot} style={{ backgroundColor: dotColor }} />

          {/* Optional icon — secondary, subdued */}
          {data.icon && (
            <div
              className={classes.iconWrapper}
              style={data.iconColor ? { color: resolvedIconColor } : undefined}
            >
              <LibIcon
                icon={data.icon}
                fixedWidth
                color={resolvedIconColor}
                animation={data.iconAnimation}
              />
            </div>
          )}

          <Stack spacing={0}>
            {data.title && <Text className={classes.title}>{data.title}</Text>}
            {data.description && (
              <ReactMarkdown
                components={MarkdownComponents}
                className={`${!data.title ? classes.descriptionOnly : classes.description} description`}
              >
                {data.description}
              </ReactMarkdown>
            )}
          </Stack>

          {/* Countdown indicator — hairline progress bar shrinking over the duration */}
          {data.showDuration && (
            <div
              key={toastKey}
              className={classes.durationBar}
              style={{ animation: `${durationBarShrink} linear forwards`, animationDuration: `${duration}ms` }}
            />
          )}
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: position,
      }
    );
  });

  return <Toaster />;
};

export default Notifications;
