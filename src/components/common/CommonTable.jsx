/* eslint-disable react/prop-types */
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Create, Delete } from '@mui/icons-material'
import { Tooltip } from '@mui/material'

function CommonTable({ rows, type, head, onEdit, onDelete }) {
  return (
    <div className="tableContainer">
      <TableContainer className="innerTable">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ fontWeight: '600' }}>
              {head?.length > 0 &&
                head.map((item, i) => (
                  <Tooltip title={item} key={i}>
                    <TableCell key={i}>{item}</TableCell>
                  </Tooltip>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.length > 0 &&
              rows.map((row, i) => {
                return (
                  <TableRow key={i}>
                    {type === 'products' && (
                      <>
                        <TableCell component="th" scope="row">
                          {i + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row?.title}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <img src={row.productImg} />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row?.description || '--'}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row?.price}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row?.sku}
                        </TableCell>
                        <TableCell>
                          <div className="centerItem">
                            <span
                              className="editBtn btn"
                              onClick={() => onEdit(row)}
                            >
                              <Create fontSize="small" />
                            </span>
                            <span
                              className="removeBtn btn"
                              onClick={() => onDelete(row)}
                            >
                              <Delete fontSize="small" />
                            </span>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default CommonTable
