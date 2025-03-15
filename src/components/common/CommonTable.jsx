/* eslint-disable react/prop-types */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import "../styles/CommonTable.scss";

function CommonTable({ rows, type, head, onEdit, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className="tableContainer">
      <TableContainer className="innerTable">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ fontWeight: "600" }}>
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
                  <TableRow
                    style={{ cursor: "pointer" }}
                    key={row._id}
                    onClick={() => navigate(`/product/${row._id}`)}
                  >
                    <TableCell component="th" scope="row">
                      {i + 1}
                    </TableCell>
                    <TableCell
                      style={{ textTransform: "capitalize" }}
                      component="th"
                      scope="row"
                    >
                      {row?.title}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <img
                        style={{ maxWidth: "100%", width: "80px" }}
                        src={row.image}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.description || "--"}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      ₹{row?.price}
                    </TableCell>
                    <TableCell>
                      <div className="centerItem">
                        <span
                          className="removeBtn btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                        >
                          <Delete fontSize="small" />
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CommonTable;
