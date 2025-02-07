import { Table } from "antd";
import { useState } from "react";
import "../Components/styles/Dashboard.css"
const ProductsTable = () => {
  const [products] = useState([
    { key: "1", name: "Laptop", price: "$1200", quantity: 10 },
    { key: "2", name: "Smartphone", price: "$800", quantity: 25 },
    { key: "3", name: "Tablet", price: "$500", quantity: 15 },
    { key: "4", name: "Smartwatch", price: "$250", quantity: 30 },
    { key: "5", name: "Headphones", price: "$150", quantity: 50 },
  ]);

  const columns = [
    { title: "Product Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  ];

  return <Table columns={columns} dataSource={products} pagination={{ pageSize: 5 }} />;
};

export default ProductsTable;
