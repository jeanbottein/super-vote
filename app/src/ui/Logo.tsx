/**
 * The super-vote icon, as on a phone's home screen: the mark on its cream
 * tile, the same in light and dark. It is public/favicon.svg, icon.svg at the
 * repository root without the editor's data, so there is one drawing to keep.
 * Decorative: the name super-vote always stands beside it.
 */
export default function Logo({ className = 'logo' }: { className?: string }) {
  return <img className={className} src="/favicon.svg" alt="" />;
}
