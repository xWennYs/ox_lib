import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'transparent',
    border: '1px solid var(--ov-border)',
    borderRadius: 5,
    cursor: 'pointer',
    '&:checked': {
      backgroundColor: 'var(--ov-accent)',
      borderColor: 'var(--ov-accent)',
    },
  },
  inner: {
    '> svg > path': {
      fill: '#09090B',
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      size="md"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
