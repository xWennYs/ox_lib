import { Checkbox } from '@mantine/core';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const CheckboxField: React.FC<Props> = (props) => {
  return (
    <Checkbox
      {...props.register}
      sx={{ display: 'flex' }}
      required={props.row.required}
      label={props.row.label}
      defaultChecked={props.row.checked}
      disabled={props.row.disabled}
      styles={{
        input: {
          backgroundColor: 'transparent',
          borderColor: 'var(--ov-border)',
          '&:checked': {
            backgroundColor: 'var(--ov-accent)',
            borderColor: 'var(--ov-accent)',
          },
        },
        icon: { color: '#09090B' },
      }}
    />
  );
};

export default CheckboxField;
