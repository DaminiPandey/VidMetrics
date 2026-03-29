export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="4" y="18" width="6" height="10" rx="1.5" fill="white" />
      <rect x="13" y="12" width="6" height="16" rx="1.5" fill="white" />
      <rect x="22" y="6" width="6" height="22" rx="1.5" fill="white" />
    </svg>
  );
}
