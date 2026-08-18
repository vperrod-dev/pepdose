export function DisclaimerFooter({ className = '' }: { className?: string }) {
  return (
    <p className={`text-center text-[10px] text-text-muted mt-6 mb-2 ${className}`}>
      Educational information only. Not medical advice. Consult your healthcare provider.
    </p>
  );
}
