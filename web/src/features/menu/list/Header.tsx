import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles(() => ({
  container: {
    textAlign: 'center',
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: '1px solid var(--ov-divider)',
  },
  heading: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--ov-text)',
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
