import { Skeleton } from './Skeleton';

export { Loader } from './Loader';
export { Progress } from './Progress';

/**
 * Table-shaped loading skeleton — a header row plus N shimmering body rows,
 * matching the .admin-table column rhythm so it doesn't visually jump when
 * real data swaps in.
 */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="admin-table-wrap" aria-hidden="true">
      <table className="admin-table">
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, i) => (
              <th key={i}>
                <Skeleton width="60%" height="0.75rem" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r}>
              {Array.from({ length: columns }, (_, c) => (
                <td key={c}>
                  <Skeleton width={c === 0 ? '80%' : '50%'} height="0.875rem" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
