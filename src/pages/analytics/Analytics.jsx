import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Box } from "@mui/system";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Mock Data (Replace with actual data fetching)
const getGrossSalesData = () => ({
  today: 1616.44,
  yesterday: 1000, // Mock data
  change: 56, // Mock change percentage
});

const getReturningCustomerRateData = () => ({
  rate: 75,
  yesterdayRate: 60,
  change: 27,
});

const getOrdersFulfilledData = () => ({
  orders: 0,
  yesterdayOrders: 5,
  change: -100,
});

const getOrdersData = () => ({
  orders: 16,
  yesterdayOrders: 11,
  change: 43,
});

const getTotalSalesOverTimeData = () => ({
  labels: [
    "12 AM",
    "2 AM",
    "4 AM",
    "6 AM",
    "8 AM",
    "10 AM",
    "12 PM",
    "2 PM",
    "4 PM",
    "6 PM",
    "8 PM",
    "10 PM",
    "12 AM",
  ],
  data: [100, 200, 150, 300, 250, 400, 500, 600, 550, 700, 800, 750, 900],
  lastDayData: [
    // Mock data for the previous day
    50, 100, 80, 150, 120, 200, 250, 300, 280, 350, 400, 380, 450,
  ],
});

const getTotalSalesBreakdownData = () => ({
  labels: [
    "Gross Sales",
    "Discounts",
    "Returns",
    "Net Sales",
    "Shipping Charges",
    "Return Fees",
    "Taxes",
    "Total Sales",
  ],
  values: [1816.44, -160.0, 0.0, 1456.44, 19.9, 0.0, 133.16, 1609.5],
  changes: [56, 65, 0, 55, 27, 0, 54, 55], // Mock change percentages
});

const SalesOverview = () => {
  const grossSalesData = getGrossSalesData();
  const returningCustomerRateData = getReturningCustomerRateData();
  const ordersFulfilledData = getOrdersFulfilledData();
  const ordersData = getOrdersData();

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <Card sx={{ flex: 1, minWidth: 200 }}>
        <CardHeader title="Gross Sales" />
        <CardContent>
          <Typography variant="h5">
            CA$ {grossSalesData.today.toFixed(2)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            {grossSalesData.change >= 0 ? (
              <ArrowUpward sx={{ color: "green" }} />
            ) : (
              <ArrowDownward sx={{ color: "red" }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: grossSalesData.change >= 0 ? "green" : "red",
                ml: 0.5,
              }}
            >
              {grossSalesData.change.toFixed(2)}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: 200 }}>
        <CardHeader title="Returning Customer Rate" />
        <CardContent>
          <Typography variant="h5">
            {returningCustomerRateData.rate}%
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            {returningCustomerRateData.change >= 0 ? (
              <ArrowUpward sx={{ color: "green" }} />
            ) : (
              <ArrowDownward sx={{ color: "red" }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: returningCustomerRateData.change >= 0 ? "green" : "red",
                ml: 0.5,
              }}
            >
              {returningCustomerRateData.change.toFixed(2)}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: 200 }}>
        <CardHeader title="Orders Fulfilled" />
        <CardContent>
          <Typography variant="h5">{ordersFulfilledData.orders}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            {ordersFulfilledData.change >= 0 ? (
              <ArrowUpward sx={{ color: "green" }} />
            ) : (
              <ArrowDownward sx={{ color: "red" }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: ordersFulfilledData.change >= 0 ? "green" : "red",
                ml: 0.5,
              }}
            >
              {ordersFulfilledData.change.toFixed(2)}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: 200 }}>
        <CardHeader title="Orders" />
        <CardContent>
          <Typography variant="h5">{ordersData.orders}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            {ordersData.change >= 0 ? (
              <ArrowUpward sx={{ color: "green" }} />
            ) : (
              <ArrowDownward sx={{ color: "red" }} />
            )}
            <Typography
              variant="body2"
              sx={{ color: ordersData.change >= 0 ? "green" : "red", ml: 0.5 }}
            >
              {ordersData.change.toFixed(2)}%
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

const TotalSalesOverTime = () => {
  const salesData = getTotalSalesOverTimeData();

  const data = {
    labels: salesData.labels,
    datasets: [
      {
        label: "Mar 26, 2025", // Current day
        data: salesData.data,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        pointRadius: 0, // Remove points for a cleaner line
        tension: 0.4, // Add some curve to the line
      },
      {
        label: "Mar 25, 2025", // Previous day
        data: salesData.lastDayData,
        fill: false,
        backgroundColor: "rgba(220,220,220,0.2)",
        borderColor: "rgba(220,220,220,1)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows for custom size
    scales: {
      x: {
        display: true,
        title: {
          display: false, // No X-axis title
        },
        grid: {
          display: false, // Remove gridlines
        },
      },
      y: {
        display: true,
        title: {
          display: false, // No Y-axis title
        },
        ticks: {
          callback: function (value) {
            return "CA$" + value; // Add CA$ prefix
          },
        },
        grid: {
          color: function (context) {
            // Style gridlines
            if (context.tick.value === 0) {
              return "#000000"; // Make the zero line black
            }
            return "rgba(0,0,0,0.1)"; // Lighter gridlines
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: false, // Do not use points in the legend
        },
      },
      tooltip: {
        displayColors: false, // Remove color box in tooltip
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (typeof context.parsed.y !== "undefined") {
              label += "CA$" + context.parsed.y.toFixed(2);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <Card sx={{ width: "100%", height: "100%", minHeight: 300 }}>
      <CardHeader title="Total Sales Over Time" />
      <CardContent sx={{ height: "100%", display: "flex" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <Line data={data} options={options} height={"300px"} />
        </div>
      </CardContent>
    </Card>
  );
};

const TotalSalesBreakdown = () => {
  const breakdownData = getTotalSalesBreakdownData();

  const data = {
    labels: breakdownData.labels,
    datasets: [
      {
        label: "Sales Breakdown",
        data: breakdownData.values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)", // Added for Taxes
          "rgba(0, 128, 0, 0.6)", // Added for Total Sales
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
          "rgba(0, 128, 0, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return "CA$" + value;
          },
        },
        grid: {
          color: function (context) {
            if (context.tick.value === 0) {
              return "#000000";
            }
            return "rgba(0,0,0,0.1)";
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: false,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (typeof context.parsed.y !== "undefined") {
              label += "CA$" + context.parsed.y.toFixed(2);
              const change = breakdownData.changes[context.dataIndex];
              if (typeof change !== "undefined") {
                label +=
                  " (" + (change >= 0 ? "+" : "") + change.toFixed(2) + "%)";
              }
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <Card sx={{ width: "100%", height: "100%", minHeight: 300 }}>
      <CardHeader title="Total Sales Breakdown" />
      <CardContent sx={{ height: "100%", display: "flex" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <Bar data={data} options={options} height={"300px"} />
        </div>
      </CardContent>
    </Card>
  );
};

const SalesBreakdownPieChart = () => {
  const breakdownData = getTotalSalesBreakdownData();

  const pieData = {
    labels: breakdownData.labels,
    datasets: [
      {
        label: "Sales Breakdown",
        data: breakdownData.values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)", // Added for Taxes
          "rgba(0, 128, 0, 0.6)", // Added for Total Sales
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
          "rgba(0, 128, 0, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: false,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (typeof context.parsed !== "undefined") {
              label += "CA$" + context.parsed.toFixed(2);
              const change = breakdownData.changes[context.dataIndex];
              if (typeof change !== "undefined") {
                label +=
                  " (" + (change >= 0 ? "+" : "") + change.toFixed(2) + "%)";
              }
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <Card sx={{ width: "100%", height: "100%", minHeight: 300 }}>
      <CardHeader title="Sales Breakdown Pie Chart" />
      <CardContent sx={{ height: "100%", display: "flex" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <Pie data={pieData} options={pieOptions} height={"300px"} />
        </div>
      </CardContent>
    </Card>
  );
};

const Analytics = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleApplyRange = () => {
    console.log("Fetching data from:", startDate, "to", endDate);
    // Add API call or data fetching logic here
  };
  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography component="h2" variant="h5">
          Analytics
        </Typography>
      </Box>

      {/* Date Range Picker */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          inputProps={{ max: new Date().toISOString().split("T")[0] }}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleApplyRange}>
          Apply Range
        </Button>
      </Box>
      <SalesOverview />

      <Box sx={{ display: "flex", gap: 3, mt: 4 }}>
        <TotalSalesOverTime sx={{ flex: 2, minWidth: 300 }} />
        <TotalSalesBreakdown sx={{ flex: 1, minWidth: 300 }} />
        <SalesBreakdownPieChart sx={{ flex: 1, minWidth: 300 }} />
      </Box>
    </Box>
  );
};

export default Analytics;
