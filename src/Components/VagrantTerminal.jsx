import { useState, useEffect, useRef } from 'react';
import { Button, Input, List, Tag, message } from 'antd';

const VagrantTerminal = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const outputEndRef = useRef(null); // Ref for auto-scrolling

  // Auto-scroll to the latest output
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  // Handle command submission
  const handleSubmit = async () => {
    if (command.trim()) {
      setIsLoading(true); // Start loading
      setOutput([]); // Clear previous output
  
      try {
        const response = await fetch('http://localhost:5000/api/vagrant/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Handle successful response
          setOutput([
            { type: 'output', text: data.stdout },
            { type: 'error', text: data.stderr },
          ]);
        } else {
          // Handle error response
          message.error(`Error: ${data.error || 'Unknown error'}`);
        }
  
      } catch (error) {
        // Handle fetch error
        message.error(`Failed to execute command: ${error.message}`);
      } finally {
        setIsLoading(false); // Stop loading
        setCommand(''); // Reset the input field
      }
  
      setCommandHistory((prevHistory) => [...prevHistory, command]); // Add command to history
    }
  };

  // Clear the output list
  const clearOutput = () => {
    setOutput([]);
  };

  // Re-run a command from history
  const rerunCommand = (cmd) => {
    setCommand(cmd);
    handleSubmit();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Vagrant Terminal</h2>

      {/* Command Input */}
      <Input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Enter command to run on Vagrant VM"
        onPressEnter={handleSubmit}
        disabled={isLoading}
      />

      {/* Run and Clear Buttons */}
      <div style={{ marginTop: '10px' }}>
        <Button onClick={handleSubmit} type="primary" loading={isLoading} style={{ marginRight: '10px' }}>
          Run Command
        </Button>
        <Button onClick={clearOutput} danger>
          Clear Output
        </Button>
      </div>

      {/* Command History */}
      <div style={{ marginTop: '20px' }}>
        <h4>Command History</h4>
        {commandHistory.map((cmd, index) => (
          <Tag
            key={index}
            color="blue"
            onClick={() => rerunCommand(cmd)}
            style={{ cursor: 'pointer', marginBottom: '5px' }}
          >
            {cmd}
          </Tag>
        ))}
      </div>

      {/* Output List */}
      <List
        style={{ marginTop: '20px' }}
        bordered
        dataSource={output}
        renderItem={(item) => (
          <List.Item style={{ color: item.type === 'error' ? 'red' : 'black' }}>
            {item.text}
          </List.Item>
        )}
      />

      {/* Auto-scroll anchor */}
      <div ref={outputEndRef} />
    </div>
  );
};

export default VagrantTerminal;
