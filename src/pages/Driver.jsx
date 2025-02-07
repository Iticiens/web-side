import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../Components/styles/Dashboard.css"; // Ensure this CSS file exists
const { Option } = Select;

const Drivers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [drivers, setDrivers] = useState([
    { key: "1", name: "John Doe", license: "DL-12345", contact: "123-456-7890", status: "Active" },
    { key: "2", name: "Jane Smith", license: "DL-67890", contact: "987-654-3210", status: "Inactive" },
    { key: "3", name: "Alice Johnson", license: "DL-54321", contact: "555-123-4567", status: "Active" },
  ]);

  const [driverStats, setDriverStats] = useState({
    temperature: [],
    speed: [],
    weight: [],
  });

  const [form] = Form.useForm();

  // Function to generate random data
  const generateRandomData = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to add new data points every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverStats((prevStats) => {
        const now = Date.now(); // Use timestamps instead of string times
  
        return {
          temperature: [
            ...prevStats.temperature.slice(-50), // Keep the last 50 points for smoothness
            { time: now, value: generateRandomData(20, 24) },
          ],
          speed: [
            ...prevStats.speed.slice(-50),
            { time: now, value: generateRandomData(50, 100) },
          ],
          weight: [
            ...prevStats.weight.slice(-50),
            { time: now, value: generateRandomData(500, 600) },
          ],
        };
      });
    }, 2000); // Increase update interval
  
    return () => clearInterval(interval);
  }, []);


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newDriver = { ...values, key: String(drivers.length + 1) };
      setDrivers([...drivers, newDriver]);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedDriver(null);
  };

  const columns = [
    { title: "Driver Name", dataIndex: "name", key: "name" },
    { title: "License No.", dataIndex: "license", key: "license" },
    { title: "Contact No.", dataIndex: "contact", key: "contact" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleDriverClick(record)}>
          View Stats
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Create Driver Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: 16 }} className="btn-create">
          Add Driver
        </Button>
      </div>

      {/* Data Table */}
      <Table columns={columns} dataSource={drivers} pagination={{ pageSize: 5 }} />

      {/* Modal Form */}
      <Modal
        title="Add Driver"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add Driver"
        okButtonProps={{ style: { backgroundColor: "#FCB218", padding: "16px 16px", fontWeight: "bold" } }}
        cancelButtonProps={{ style: { fontWeight: "bold", padding: "16px 16px" } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="license" label="License NCN" rules={[{ required: true, message: "Please enter national card number!" }]}>
            <Input placeholder="Enter national card number" />
          </Form.Item>

          <Form.Item name="name" label="Driver Name" rules={[{ required: true, message: "Please enter driver name!" }]}>
            <Input placeholder="Enter driver name" />
          </Form.Item>

          <Form.Item name="contact" label="Contact No." rules={[{ required: true, message: "Please enter contact number!" }]}>
            <Input placeholder="Enter contact number" />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status!" }]}>
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer for Driver Stats */}
      <Drawer
        title={`Driver Stats: ${selectedDriver?.name}`}
        placement="right"
        onClose={handleDrawerClose}
        open={isDrawerOpen}
        width={600}
      >
        {selectedDriver && (
          <div>
            <h3>Temperature Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={driverStats.temperature}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>

            <h3>Speed Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={driverStats.speed}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>

            <h3>Weight Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={driverStats.weight}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Drivers;