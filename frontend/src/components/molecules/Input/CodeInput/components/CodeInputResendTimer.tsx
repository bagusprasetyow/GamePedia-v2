import { type FC } from 'react';
import { Button, Text } from '@/components/atoms';

export interface CodeInputResendTimerProps {
  seconds: number;
  onResend: () => void;
  label?: string;
  resendText?: string;
  disabled?: boolean;
}

export const CodeInputResendTimer: FC<CodeInputResendTimerProps> = ({
  seconds,
  onResend,
  label = 'Tidak menerima kode?',
  resendText = 'Kirim Ulang Kode',
  disabled = false,
}) => {
  const isCanResend = seconds <= 0;

  return (
    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2">
      <Text size="xs" variant="muted">
        {label}
      </Text>
      {isCanResend ? (
        <Button
          type="button"
          variant="ghost"
          size="2xs"
          depth={0}
          disabled={disabled}
          onClick={onResend}
          className="text-primary font-semibold hover:underline p-0 h-auto"
        >
          {resendText}
        </Button>
      ) : (
        <Text size="xs" weight="semibold" className="text-primary font-mono">
          ({seconds}s)
        </Text>
      )}
    </div>
  );
};

export default CodeInputResendTimer;
