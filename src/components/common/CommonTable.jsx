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
  console.log(rows, "rowsorder");
  const renderRows = () => {
    return rows?.length > 0
      ? rows.map((row, i) => {
          switch (type) {
            case "products":
              return (
                <TableRow
                  key={row._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/product/${row._id}`)}
                >
                  <TableCell component="th">{i + 1}</TableCell>
                  <TableCell component="th" style={{ textTransform: "capitalize" }}>
                    {row?.title}
                  </TableCell>
                  <TableCell component="th">
                    <img
                      src={row.image}
                      alt="Product"
                    />
                  </TableCell>
                  <TableCell component="th">{row?.description || "--"}</TableCell>
                  <TableCell>₹{row?.price}</TableCell>
                  <TableCell component="th">
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

            case "orders":
              return (
                <TableRow
                  style={{ cursor: "pointer" }}
                  key={row._id}
                  onClick={() => navigate(`/orders/${row._id}`)}
                >
                  <TableCell component="th">{i + 1}</TableCell>
                  <TableCell component="th">{row.orderId}</TableCell>
                  <TableCell component="th">{row.customer.firstName}</TableCell>
                  <TableCell component="th">{row.orderDate}</TableCell>
                  <TableCell component="th">{row.products.length}</TableCell>
                  <TableCell component="th">{row.paymentMethod}</TableCell>
                  <TableCell component="th">
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

            case "users":
              return (
                <TableRow key={row._id}>
                  <TableCell component="th">{i + 1}</TableCell>
                  <TableCell component="th">{row.name}</TableCell>
                  <TableCell component="th">{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell component="th">
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

            default:
              return (
                <TableRow key={row._id}>
                  <TableCell
                    colSpan={head.length}
                    style={{ textAlign: "center" }}
                  >
                    No Data Available
                  </TableCell>
                </TableRow>
              );
          }
        })
      : null;
  };

  return (
    <div className="tableContainer">
      <TableContainer className="innerTable">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {head?.length > 0 &&
                head.map((item, i) => (
                  <Tooltip title={item} key={i}>
                    <TableCell>{item}</TableCell>
                  </Tooltip>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CommonTable;
