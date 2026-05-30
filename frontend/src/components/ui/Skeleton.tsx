const WIDTHS = ['62%', '78%', '50%', '70%', '58%'];

function SkeletonCell({ width }: { width: string }) {
  return (
    <div
      className="h-[14px] rounded-md animate-pulse bg-gradient-to-r from-[#f0f0f0] via-[#e8e8e8] to-[#f0f0f0]"
      style={{ width }}
    />
  );
}

export function SkeletonRows({ rows = 5, cols = 3 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className={i > 0 ? 'border-t border-[#f5f5f7]' : ''}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-6 py-[14px]">
              <SkeletonCell width={WIDTHS[(i + j) % WIDTHS.length]} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
