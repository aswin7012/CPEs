import React, { useEffect, useState } from "react";

const PAGE_SIZES = [15, 20, 30, 50];

function App() {
  const [cpes, setCpes] = useState([]);
  const [filters, setFilters] = useState({ title: "", cpe23_url: "", deprecation_date: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPopover, setShowPopover] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.title) params.append("cpe_title", filters.title);
    if (filters.cpe23_url) params.append("cpe23_url", filters.cpe23_url);
    if (filters.deprecation_date) params.append("deprecation_date", filters.deprecation_date);

    const isFilterActive = [...params.keys()].length > 0;
    params.append("page", page);
    params.append("limit", limit);
    const endpoint = isFilterActive ? "/api/cpes/search" : "/api/cpes";
    const res = await fetch(`http://localhost:3000${endpoint}?${params}`);
    const data = await res.json();
    setCpes(data.data || []);
    setTotalCount(data.totalCount || data.count || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, limit, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-6 font-sans text-sm">
      <h1 className="text-xl font-bold mb-4">CPE Records</h1>

      <div className="mb-4 flex items-center gap-4">
        <label>Results per page:</label>
        <select value={limit} onChange={e => setLimit(Number(e.target.value))} className="border p-1 rounded">
          {PAGE_SIZES.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Title<br />
                <input
                  className="border rounded p-1 w-full"
                  placeholder="Search"
                  value={filters.title}
                  onChange={e => handleFilterChange("title", e.target.value)}
                />
              </th>
              <th className="p-2 border">URL_23<br />
                <input
                  className="border rounded p-1 w-full"
                  placeholder="Search"
                  value={filters.cpe23_url}
                  onChange={e => handleFilterChange("cpe23_url", e.target.value)}
                />
              </th>
              <th className="p-2 border">Deprecated Date<br />
                <input
                  className="border rounded p-1 w-full"
                  placeholder="YYYY-MM-DD"
                  value={filters.deprecation_date}
                  onChange={e => handleFilterChange("deprecation_date", e.target.value)}
                />
              </th>
              <th className="p-2 border">References</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
            ) : cpes.length === 0 ? (
              <tr><td colSpan="4" className="text-center p-4">No results found</td></tr>
            ) : (
              cpes.map((cpe, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 max-w-xs truncate" title={cpe.title}>{cpe.title}</td>
                  <td className="p-2 text-blue-600 underline truncate" title={cpe.cpe23_url}>
                    <a href={cpe.cpe23_url} target="_blank" rel="noopener noreferrer">{cpe.cpe23_url}</a>
                  </td>
                  <td className="p-2">
                    {cpe.deprecation_date ? new Date(cpe.deprecation_date).toLocaleDateString("en-US", {
                      month: "short", day: "2-digit", year: "numeric"
                    }) : "—"}
                  </td>
                  <td className="p-2 relative">
                    {cpe.references?.slice(0, 2).map((ref, idx) => (
                      <div key={idx} className="truncate" title={ref}>
                        <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{ref}</a>
                      </div>
                    ))}
                    {cpe.references?.length > 2 && (
                      <div>
                        <button
                          className="text-sm text-blue-500"
                          onClick={() => setShowPopover(showPopover === i ? null : i)}
                        >+{cpe.references.length - 2} more</button>

                        {showPopover === i && (
                          <div className="absolute z-10 bg-white border p-2 shadow rounded w-64 mt-2">
                            <h4 className="font-semibold mb-1">All References:</h4>
                            {cpe.references.map((ref, idx) => (
                              <div key={idx} className="truncate mb-1" title={ref}>
                                <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{ref}</a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          className="px-3 py-1 border rounded bg-gray-100"
          disabled={page === 1}
        >Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 border rounded bg-gray-100"
          disabled={page === totalPages}
        >Next</button>
      </div>
    </div>
  );
}

export default App;
