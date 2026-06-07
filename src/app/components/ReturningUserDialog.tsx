import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from './ui/alert-dialog';
import { Button } from './ui';
import { useApp } from '../context/AppContext';

interface ReturningUserDialogProps {
  open: boolean;
  userName: string | null;
  onUseSaved: () => void;
  onStartFresh: () => void;
}

export const ReturningUserDialog: React.FC<ReturningUserDialogProps> = ({
  open,
  userName,
  onUseSaved,
  onStartFresh,
}) => {
  const { t } = useApp();
  const displayName = userName || t('welcomeBack').replace('!', '');

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {t('welcomeBackUser').replace('{name}', displayName)}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center pt-2">
            {t('useSavedData')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={onUseSaved}
            className="min-h-[48px] touch-manipulation"
          >
            {t('yesUseSaved')}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={onStartFresh}
            className="min-h-[48px] touch-manipulation"
          >
            {t('noStartFresh')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
