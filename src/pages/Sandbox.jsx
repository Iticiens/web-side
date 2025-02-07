import  { useState, useEffect } from "react";
import { Form, Input, Select, Slider, Checkbox, Button, Card, message, Switch, Spin } from "antd";
import TerminalCode from "../Components/Terminal"; // Import the TerminalCode component

const { Option } = Select;
const { TextArea } = Input;

const VagrantConfig = () => {
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [statusLoading, setStatusLoading] = useState(true); // Loading state for fetching VM status
  const [status, setStatus] = useState(null); // State to track VM status
  const [config, setConfig] = useState({
    box: "ubuntu/focal64",
    provider: "virtualbox",
    memory: 1024,
    cpus: 2,
    ip: "",
    forwardedPort: "",
    hostname: "",
    autoStart: true,
    gui: false,
    provisioning: [],
    provisionScript: "",
    envVariables: "",
  });

  // Handle form field changes
  const handleChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Generate Vagrantfile
  const generateVagrantfile = async () => {
    const { box, provider, memory, cpus, ip, forwardedPort, hostname, autoStart, gui, provisioning, provisionScript, envVariables } = config;

    const vagrantfileData = {
      box,
      provider,
      memory,
      cpus,
      ip,
      forwardedPort,
      hostname: hostname || box.split('/')[0],
      autoStart,
      gui,
      provisioning,
      provisionScript,
      envVariables,
    };
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/vagrant/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vagrantfileData),
      });

      const result = await response.json();

      if (response.ok) {
        message.success(result.message || "Vagrantfile created successfully!");
        window.location.reload(false);
      } else {
        message.error(result.message || "Error generating Vagrantfile.");
      }
    } catch (error) {
      message.error("Failed to generate Vagrantfile. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch VM status on component mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vagrant/status", {
          method: "GET",
        });
        const data = await response.json();
        if (data.message.includes("running")) {
          setStatus("running");
        } else {
          setStatus("poweroff");
        }
      } catch (error) {
        message.error("Failed to get status. Please try again.");
        console.error("Error:", error);
      } finally {
        setStatusLoading(false); // Stop loading after fetching status
      }
    };

    fetchStatus();
  }, []);

  // Conditional rendering based on VM status
  return (
    <div style={{ height: "80vh" }}>
      {statusLoading ? (
        // Display loader while fetching VM status
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Spin size="large" tip="Loading VM status..." />
        </div>
      ) : status === "running" ? (
        // Display TerminalCode if VM is running
        <TerminalCode />
      ) : (
        // Display Vagrant configuration form if VM is not running
        <Card title="VM Configuration" style={{ maxWidth: 700, margin: "auto" }}>
          <Form layout="vertical">
            <Form.Item label="Box Type">
              <Select value={config.box} onChange={(value) => handleChange("box", value)}>
                <Option value="ubuntu/focal64">Ubuntu 20.04</Option>
                <Option value="centos/7">CentOS 7</Option>
                <Option value="debian/buster64">Debian 10</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Provider">
              <Select value={config.provider} onChange={(value) => handleChange("provider", value)}>
                <Option value="virtualbox">VirtualBox</Option>
                <Option value="hyperv">Hyper-V</Option>
                <Option value="aws">AWS</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Memory (MB)">
              <Slider min={512} max={8192} step={256} value={config.memory} onChange={(value) => handleChange("memory", value)} />
            </Form.Item>

            <Form.Item label="CPUs">
              <Slider min={1} max={8} value={config.cpus} onChange={(value) => handleChange("cpus", value)} />
            </Form.Item>

            <Form.Item label="Static IP (Optional)">
              <Input placeholder="192.168.33.10" value={config.ip} onChange={(e) => handleChange("ip", e.target.value)} />
            </Form.Item>

            <Form.Item label="Forwarded Port (Optional)">
              <Input placeholder="8080" value={config.forwardedPort} onChange={(e) => handleChange("forwardedPort", e.target.value)} />
            </Form.Item>

            <Form.Item label="Hostname (Optional)">
              <Input placeholder="my-vm" value={config.hostname} onChange={(e) => handleChange("hostname", e.target.value)} />
            </Form.Item>

            <Form.Item label="Provisioning Methods">
              <Checkbox.Group
                options={["shell", "ansible", "puppet", "docker"]}
                value={config.provisioning}
                onChange={(value) => handleChange("provisioning", value)}
              />
            </Form.Item>

            {config.provisioning.includes("shell") && (
              <Form.Item label="Shell Provisioning Script">
                <TextArea
                  rows={4}
                  placeholder="Enter shell script here..."
                  value={config.provisionScript}
                  onChange={(e) => handleChange("provisionScript", e.target.value)}
                />
              </Form.Item>
            )}

            <Form.Item label="Environment Variables">
              <TextArea
                rows={3}
                placeholder="E.g., VAR1=value1\nVAR2=value2"
                value={config.envVariables}
                onChange={(e) => handleChange("envVariables", e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Auto Start VM">
              <Switch checked={config.autoStart} onChange={(checked) => handleChange("autoStart", checked)} />
            </Form.Item>

            <Form.Item label="Enable GUI Mode">
              <Switch checked={config.gui} onChange={(checked) => handleChange("gui", checked)} />
            </Form.Item>
            <div style={{ display:"flex",justifyContent:"center" }}>
              <Button type="primary" className="btn" loading={loading} onClick={generateVagrantfile}>
                Create Virtual Machine
              </Button>
            </div>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default VagrantConfig;