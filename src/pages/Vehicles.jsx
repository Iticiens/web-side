import { useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "../Components/styles/Dashboard.css";

const { Option } = Select;

const Vehicles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState([
    { key: "1", name: "Truck A", size: "Large", limit: 2000, type: "Cargo", registration: "AB-1234" },
    { key: "2", name: "Van B", size: "Medium", limit: 1200, type: "Delivery", registration: "XY-5678" },
    { key: "3", name: "Pickup C", size: "Small", limit: 800, type: "Utility", registration: "LM-9101" },
  ]);

  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState(null);

  // Define vehicle sizes and limits
  const vehicleData = {
    "Semi 20": { size: "Large", limit: 2000 },
    "Semi 10": { size: "Medium", limit: 1000 },
    Fourgon: { size: "Small", limit: 500 },
  };

  // Handle Vehicle Type Selection
  const handleTypeChange = (value) => {
    setSelectedType(value);
    const vehicle = vehicleData[value] || {};
    
    form.setFieldsValue({
      size: vehicle.size,
      limit: vehicle.limit,
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newVehicle = { ...values, key: String(vehicles.length + 1) };
      setVehicles([...vehicles, newVehicle]);
      setIsModalOpen(false);
      form.resetFields();
      setSelectedType(null);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { title: "Vehicle Name", dataIndex: "name", key: "name" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Limit (KG)", dataIndex: "limit", key: "limit" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Registration No.", dataIndex: "registration", key: "registration" },
  ];

  return (
    <div>
      {/* Create Vehicle Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: 16 }} className="btn-create">
          Create Vehicle
        </Button>
      </div>

      {/* Data Table */}
      <Table columns={columns} dataSource={vehicles} pagination={{ pageSize: 5 }} />

      {/* Modal Form */}
      <Modal title="Create Vehicle" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Add Vehicle" okButtonProps={{ style: { backgroundColor: "#FCB218", padding: "16px 16px", fontWeight: "bold" } }} cancelButtonProps={{ style: { fontWeight: "bold", padding: "16px 16px" } }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Vehicle Name" rules={[{ required: true, message: "Please enter vehicle name!" }]}>
            <Input placeholder="Enter vehicle name" />
          </Form.Item>

          <Form.Item name="type" label="Vehicle Type" rules={[{ required: true, message: "Please select vehicle type!" }]}>
            <Select placeholder="Select type" onChange={handleTypeChange}>
              <Option value="Semi 20">Semi 20</Option>
              <Option value="Semi 10">Semi 10</Option>
              <Option value="Fourgon">Fourgon</Option>
            </Select>
          </Form.Item>

          <Form.Item name="size" label="Size">
            <Input placeholder="Auto-filled size" disabled />
          </Form.Item>

          <Form.Item name="limit" label="Limit (KG)">
            <InputNumber style={{ width: "100%" }} placeholder="Auto-filled limit" disabled />
          </Form.Item>

          <Form.Item name="registration" label="Registration No." rules={[{ required: true, message: "Please enter registration number!" }]}>
            <Input placeholder="Enter registration number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vehicles;
