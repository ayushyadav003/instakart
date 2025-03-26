/* eslint-disable react/prop-types */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "@mui/material";
import "../styles/CommonTable.scss";

function CommonTable({ rows, type, head, onEdit, onDelete }) {
  let { productId } = useParams();
  const navigate = useNavigate();
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
                  <TableCell>{i + 1}</TableCell>
                  <TableCell style={{ textTransform: "capitalize" }}>
                    {row?.title}
                  </TableCell>
                  <TableCell>
                    <img
                      style={{ maxWidth: "100%", width: "80px" }}
                      src={row.image}
                      alt="Product"
                    />
                  </TableCell>
                  <TableCell>{row?.description || "--"}</TableCell>
                  <TableCell>₹{row?.price}</TableCell>
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

            case "orders":
              return (
                <TableRow
                  style={{ cursor: "pointer" }}
                  key={row._id}
                  onClick={() => navigate(`/orders/${row._id}`)}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell>{row.customer.firstName}</TableCell>
                  <TableCell>{row.orderDate}</TableCell>
                  <TableCell>{row.products.length}</TableCell>
                  <TableCell>{row.paymentMethod}</TableCell>
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

            case "variants":
              return (
                <TableRow
                  style={{ cursor: "pointer" }}
                  key={row._id}
                  onClick={() => navigate(`/variants/${productId}/${row._id}`)}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {row.media ? (
                      <img
                        style={{ maxWidth: "100%", width: "80px" }}
                        src={row.media[0]}
                        alt="Product"
                      />
                    ) : (
                      <img />
                    )}
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>₹{row.price}</TableCell>
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

            case "users":
              return (
                <TableRow key={row._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
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
