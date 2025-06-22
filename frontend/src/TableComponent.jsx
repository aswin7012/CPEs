import * as React from 'react';
import { styled } from '@mui/system';
import TablePagination from '@mui/material/TablePagination';
import { tablePaginationClasses as classes } from '@mui/material/TablePagination';
import axios from 'axios';

export default function TableUnstyled() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [filter, setFilter] = React.useState({});

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (
          filter.title ||
          filter.cpe23_url ||
          filter.references ||
          filter.deprecation_date
        ) {
          response = await axios.get('http://localhost:3000/api/cpes/search', {
            params: {
              cpe_title: filter.title || '',
              cpe23_url: filter.cpe23_url || '',
              references: filter.references || '',
              deprecation_date: filter.deprecation_date || '',
              page: page + 1,
              limit: rowsPerPage,
            },
          });
        } else {
          response = await axios.get('http://localhost:3000/api/cpes', {
            params: {
              page: page + 1,
              limit: rowsPerPage,
            },
          });
        }
        setRows(response.data.data);
        setTotalCount(response.data.totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRows([]);
        setTotalCount(0);
      }
    };

    fetchData();
  }, [page, rowsPerPage, filter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Root sx={{ maxWidth: '100%', width: "100%" }}>
      <table aria-label="custom pagination table">
        <thead>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[10,15,20,30, 50, { label: 'All', value: -1 }]}
              colSpan={5}
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  'aria-label': 'rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
          <tr>
            <th>ID</th>
            <th>Title<br />
              <input type="text" value={filter.title || ''} onChange={(e) => setFilter({ ...filter, title: e.target.value })} />
            </th>
            <th>CPE 2.3 URL
              <br />
              <input type="text" value={filter.cpe23_url || ''} onChange={(e) => setFilter({ ...filter, cpe23_url: e.target.value })} />
            </th>
            
            <th>References
              <br />
              <input type="text" value={filter.references || ''} onChange={(e) => setFilter({ ...filter, references: e.target.value })} />
            </th>
            <th>Deprecation Date
              <br />
              <input type="date" value={filter.deprecation_date || ''} onChange={(e) => setFilter({ ...filter, deprecation_date: e.target.value })} />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.title}</td>
              <td>{row.cpe23_url}</td>
              <td>
                {row.references && row.references.map((ref, idx) => (
                  <div key={idx}>
                    <a href={ref} target="_blank" rel="noopener noreferrer">{ref}</a>
                  </div>
                ))}
              </td>
              <td>{row.deprecation_date ? row.deprecation_date.slice(0, 10) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Root>
  );
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Root = styled('div')(
  ({ theme }) => `
  table {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid ${grey[800]};
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  }
  `,
);

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;