import { Button, Input } from '@telegram-apps/telegram-ui';
import { FC, useState } from 'react';

import '@/components/common/common.css';
import { Modal, ModalProps } from '../common/Modal';

interface ComissionModalProps extends ModalProps {
  onComissionSubmit: (value: number) => void;
}

export const ComissionModal: FC<ComissionModalProps> = ({ open, onOpenChange, onComissionSubmit }) => {
  const [comission, setComission] = useState<string>('');

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Input
        header={'Предложите долю комиссии'}
        value={comission}
        placeholder="0-100 %"
        onChange={e => {
          if (e.target.value === '') {
            setComission('');
            return;
          }

          let num = parseInt(e.target.value);
          if (isNaN(num)) {
            return;
          }

          if (num > 100) {
            num = 100;
          }
          if (num < 0) {
            num = 0;
          }
          setComission(`${num}`);
        }}
      ></Input>
      <div className="comission-modal__buttons">
        <Button mode="outline" onClick={() => onOpenChange(false)}>
          Отмена
        </Button>
        <Button
          mode="filled"
          disabled={comission === ''}
          onClick={() => {
            onComissionSubmit(parseInt(comission));
            setComission('');
            onOpenChange(false);
          }}
        >
          Предложить
        </Button>
      </div>
    </Modal>
  );
};
