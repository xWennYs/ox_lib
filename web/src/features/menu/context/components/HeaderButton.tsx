import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((_theme, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: 6,
    flex: '0 0 auto',
    width: 28,
    height: 28,
    minWidth: 28,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 0,
    background: 'transparent',
    '&:hover': {
      background: 'var(--ov-hover)',
    },
  },
  root: {
    border: 'none',
    background: 'transparent',
    '&:hover': {
      background: 'var(--ov-hover)',
    },
  },
  label: {
    color: params.canClose === false ? 'var(--ov-faint)' : 'var(--ov-muted)',
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;
