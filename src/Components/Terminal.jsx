import { useState, useEffect, useRef } from 'react';
import { message, Tag } from 'antd';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css'; // Import xterm styles
import { Button } from 'antd';

const TerminalCode = () => {
  const [commandHistory, setCommandHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef(null); // Ref for the terminal container
  const term = useRef(null); // Ref for xterm instance
  const fitAddon = useRef(new FitAddon()); // Fit addon for resizing the terminal

  // API URL for the backend
  const apiUrl = 'http://localhost:5000/api/vagrant/execute'; // Replace with your API endpoint

  // Function to display the prompt in green
  const displayPrompt = () => {
    term.current.write('\x1b[32mamine@localhost$\x1b[39m '); // Green prompt
  };

  useEffect(() => {
    // Initialize xterm and fit the terminal inside the container
    term.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#171817',
        foreground: '#ffffff',
        cursor: '#ffffff',
      },
      convertEol: true, // Ensure proper line breaks after each command
    });

    // Attach fit addon to automatically resize terminal
    term.current.loadAddon(fitAddon.current);

    // Open terminal in the DOM container
    term.current.open(terminalRef.current);

    // Fit the terminal to the container size
    fitAddon.current.fit();

    // Display the initial prompt
    displayPrompt();

    // Handle user input in the terminal
    term.current.onData((data) => {
      // Handle backspace and delete keys
      if (data === '\x7F' || data === '\x08') { // Backspace or Delete key
        term.current.write('\b \b'); // Move cursor back, overwrite with space, move back again
        return;
      }

      // Write the user input to the terminal
      term.current.write(data);

      // Log the input command as the user types (this logs the entire input in real-time)
      if (data !== '\r') {
        console.log("Current Command Input:", data); // Log command as user types
      }

      // If the user presses Enter, send the command to the backend
      if (data === '\r') {
        // Get the last line from the buffer
        const buffer = term.current.buffer.active;
        const lastLine = buffer.getLine(buffer.cursorY + buffer.viewportY).translateToString().trim();
  
        // Remove the prompt from the command
        const command = lastLine.replace('amine@localhost$ ', '');
  
        console.log("Command before", command);
        handleCommandInput(command);
      }
    });

    // Resize the terminal when the window is resized
    window.addEventListener('resize', () => fitAddon.current.fit());

    // Clean up the terminal when the component is unmounted
    return () => {
      window.removeEventListener('resize', () => fitAddon.current.fit());
      term.current.dispose();
    };
  }, []);

  // Handle command input in the terminal (user typing)
  const handleCommandInput = async (input) => {
    setIsLoading(true);
    term.current.write(`\r\n`); // Move to the next line after the command

    // Log the full command when Enter is pressed
    console.log("Executing Command:", input); // Log the command before sending to backend

    // Send the command to the backend via API
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: input }),
      });

      const data = await response.json();

      // Display the backend output in the terminal
      const { stdout, stderr } = data;
      if (stdout) {
        term.current.writeln(stdout); // Output from the backend
      }
      if (stderr) {
        term.current.writeln(`\x1b[31m${stderr}\x1b[39m`); // Error in red
      }
    } catch (error) {
      term.current.writeln(`\x1b[31mError: ${error.message}\x1b[39m`); // API error in red
    } finally {
      setIsLoading(false);
      displayPrompt(); // Display the prompt again after command execution
    }

    // Add command to history
    setCommandHistory((prevHistory) => [...prevHistory, input]);
  };
  
  const destroyMachine = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/vagrant/destroy', {
        method: 'DELETE',
      });
  
      if (response.ok) {
        message.success('Machine destroyed successfully!');
        window.location.reload(false);
      } else {
        message.error('Failed to destroy the machine.');
      }
    } catch (error) {
      console.error('Error destroying machine:', error);
      message.error('An error occurred while destroying the machine.');
    } finally{
      setIsLoading(false);
    }
  };

  // Re-run a command from history
  const rerunCommand = (cmd) => {
    setIsLoading(true);
    term.current.write(`\r\n$ ${cmd}\r\n`);
    handleCommandInput(cmd); // Call the same function to send command again
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Command History */}
      <div style={{ marginBottom: '20px' }}>
        <h1>Command History</h1>
        {commandHistory.map((cmd, index) => (
          <Tag
            key={index}
            color="geekblue-inverse"
            onClick={() => rerunCommand(cmd)}
            style={{ cursor: 'pointer', marginBottom: '5px' }}
          >
            {cmd}
          </Tag>
        ))}
      </div>

      {/* Terminal Display */}
      <div ref={terminalRef} style={{ height: '50vh', width: '100%' }}></div>
      <div style={{ width:"100%",display:"flex", justifyContent:"flex-end", marginTop:16 }}>
        <Button
          variant='solid'
          type='primary'
          color='danger'
          onClick={destroyMachine}
          loading={isLoading}
        >Destroy</Button>
      </div>
    </div>
  );
};

export default TerminalCode;
