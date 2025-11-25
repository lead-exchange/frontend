import { FC } from 'react';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Modal: FC<ModalProps & React.PropsWithChildren> = ({ open, onOpenChange, children }) => {
  return (
    <div className={open ? 'modal__overlay' : 'modal__overlay hidden'} onClick={() => onOpenChange(false)}>
      <div className={open ? 'modal' : 'modal hidden'} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
