import { TextUiProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugTextUI = () => {
  debugData<TextUiProps>([
    {
      action: 'textUi',
      data: {
        text: 'Move Forward {W}\nMove Backward {S}\nMove Left {A}\nMove Right {D}\nCancel {X}\nConfirm {SPACE}',
        position: 'right-center',
        icon: 'gamepad',
      },
    },
  ]);
};
