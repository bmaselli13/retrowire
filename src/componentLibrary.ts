import { ComponentDefinition } from './types';

// Initial component library as specified in the requirements
export const componentLibrary: ComponentDefinition[] = [
  {
    id: 'rpi-4',
    name: 'Raspberry Pi 4 Model B',
    category: 'controller',
    width: 200,
    height: 140,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="200" height="140" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#1a7f37" stroke="#333" stroke-width="2"/>
        <text x="100" y="70" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Raspberry Pi 4</text>
        <rect x="170" y="10" width="20" height="120" fill="#222"/>
      </svg>
    `),
    ports: [
      { id: 'p1', label: '3.3V', type: 'POWER', voltage: '3.3V', x: 90, y: 7 },
      { id: 'p2', label: '5V', type: 'POWER', voltage: '5V', x: 90, y: 14 },
      { id: 'p6', label: 'GND', type: 'POWER', voltage: 'GND', x: 90, y: 28 },
      { id: 'p7', label: 'GPIO 4', type: 'DIGITAL_IN', voltage: '3.3V', x: 90, y: 35 },
      { id: 'p12', label: 'GPIO 18 (PWM)', type: 'PWM', voltage: '3.3V', x: 90, y: 50 },
      { id: 'p16', label: 'GPIO 23', type: 'DIGITAL_IN', voltage: '3.3V', x: 90, y: 64 },
      { id: 'p18', label: 'GPIO 24', type: 'DIGITAL_IN', voltage: '3.3V', x: 90, y: 71 },
      { id: 'p20', label: 'GND', type: 'POWER', voltage: 'GND', x: 90, y: 78 },
    ]
  },
  {
    id: 'arcade-button',
    name: 'Arcade Button',
    category: 'input',
    width: 80,
    height: 80,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="35" fill="#e74c3c" stroke="#333" stroke-width="2"/>
        <circle cx="40" cy="40" r="28" fill="#c0392b"/>
        <circle cx="35" cy="35" r="8" fill="#e74c3c" opacity="0.5"/>
      </svg>
    `),
    ports: [
      { id: 'no', label: 'NO (to GPIO)', type: 'DIGITAL_OUT', voltage: '5V', x: 50, y: 10 },
      { id: 'gnd', label: 'GND (to ground)', type: 'POWER', voltage: 'GND', x: 50, y: 90 },
    ]
  },
  {
    id: 'joystick',
    name: 'Arcade Joystick',
    category: 'input',
    width: 120,
    height: 120,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="#34495e" stroke="#333" stroke-width="2"/>
        <circle cx="60" cy="60" r="40" fill="#2c3e50"/>
        <circle cx="60" cy="60" r="15" fill="#95a5a6"/>
        <line x1="60" y1="20" x2="60" y2="40" stroke="#e74c3c" stroke-width="3"/>
        <line x1="60" y1="80" x2="60" y2="100" stroke="#e74c3c" stroke-width="3"/>
        <line x1="20" y1="60" x2="40" y2="60" stroke="#e74c3c" stroke-width="3"/>
        <line x1="80" y1="60" x2="100" y2="60" stroke="#e74c3c" stroke-width="3"/>
      </svg>
    `),
    ports: [
      { id: 'up', label: 'Up', type: 'DIGITAL_OUT', voltage: '5V', x: 50, y: 5 },
      { id: 'down', label: 'Down', type: 'DIGITAL_OUT', voltage: '5V', x: 50, y: 95 },
      { id: 'left', label: 'Left', type: 'DIGITAL_OUT', voltage: '5V', x: 5, y: 50 },
      { id: 'right', label: 'Right', type: 'DIGITAL_OUT', voltage: '5V', x: 95, y: 50 },
      { id: 'gnd', label: 'GND', type: 'POWER', voltage: 'GND', x: 50, y: 50 },
    ]
  },
  {
    id: '12v-psu',
    name: '12V Power Supply',
    category: 'power',
    width: 160,
    height: 100,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="160" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="100" fill="#555" stroke="#333" stroke-width="2"/>
        <text x="80" y="45" font-family="Arial" font-size="18" font-weight="bold" fill="#ffd700" text-anchor="middle">12V PSU</text>
        <text x="80" y="65" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle">Power Supply</text>
        <circle cx="20" cy="20" r="6" fill="#ff0000"/>
        <circle cx="20" cy="50" r="6" fill="#000"/>
        <circle cx="20" cy="80" r="6" fill="#0f0"/>
      </svg>
    `),
    ports: [
      { id: 'vplus', label: 'V+', type: 'POWER', voltage: '12V', x: 5, y: 20 },
      { id: 'vminus', label: 'V-', type: 'POWER', voltage: 'GND', x: 5, y: 50 },
      { id: 'gnd', label: 'GND', type: 'POWER', voltage: 'GND', x: 5, y: 80 },
    ]
  },
  {
    id: 'arduino-uno',
    name: 'Arduino Uno',
    category: 'controller',
    width: 180,
    height: 120,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="180" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="120" fill="#00979d" stroke="#333" stroke-width="2"/>
        <text x="90" y="60" font-family="Arial" font-size="16" font-weight="bold" fill="white" text-anchor="middle">Arduino Uno</text>
        <rect x="160" y="10" width="15" height="100" fill="#222"/>
        <rect x="5" y="10" width="15" height="100" fill="#222"/>
      </svg>
    `),
    ports: [
      { id: 'vin', label: 'VIN', type: 'POWER', voltage: '5V', x: 10, y: 20 },
      { id: 'gnd1', label: 'GND', type: 'POWER', voltage: 'GND', x: 10, y: 35 },
      { id: '5v', label: '5V', type: 'POWER', voltage: '5V', x: 10, y: 50 },
      { id: 'd2', label: 'D2', type: 'DIGITAL_IN', voltage: '5V', x: 90, y: 8 },
      { id: 'd3', label: 'D3 (PWM)', type: 'PWM', voltage: '5V', x: 90, y: 15 },
      { id: 'd4', label: 'D4', type: 'DIGITAL_IN', voltage: '5V', x: 90, y: 22 },
      { id: 'gnd2', label: 'GND', type: 'POWER', voltage: 'GND', x: 90, y: 92 },
    ]
  },
  {
    id: 'zero-delay-encoder',
    name: 'Zero Delay USB Encoder',
    category: 'controller',
    width: 200,
    height: 140,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="200" height="140" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="140" fill="#2c3e50" stroke="#333" stroke-width="2"/>
        <text x="100" y="50" font-family="Arial" font-size="14" font-weight="bold" fill="white" text-anchor="middle">Zero Delay</text>
        <text x="100" y="68" font-family="Arial" font-size="11" fill="#ecf0f1" text-anchor="middle">USB Encoder</text>
        <rect x="90" y="15" width="20" height="15" fill="#555"/>
        <circle cx="25" cy="35" r="4" fill="#e74c3c"/>
        <circle cx="45" cy="35" r="4" fill="#3498db"/>
        <circle cx="65" cy="35" r="4" fill="#2ecc71"/>
        <circle cx="85" cy="35" r="4" fill="#f39c12"/>
        <circle cx="105" cy="35" r="4" fill="#9b59b6"/>
        <circle cx="125" cy="35" r="4" fill="#e74c3c"/>
      </svg>
    `),
    ports: [
      { id: 'p1', label: 'P1 (Button 1)', type: 'DIGITAL_IN', voltage: '5V', x: 10, y: 15 },
      { id: 'p2', label: 'P2 (Button 2)', type: 'DIGITAL_IN', voltage: '5V', x: 10, y: 28 },
      { id: 'p3', label: 'P3 (Button 3)', type: 'DIGITAL_IN', voltage: '5V', x: 10, y: 41 },
      { id: 'p4', label: 'P4 (Button 4)', type: 'DIGITAL_IN', voltage: '5V', x: 10, y: 54 },
      { id: 'p5', label: 'P5 (Button 5)', type: 'DIGITAL_IN', voltage: '5V', x: 10, y: 67 },
      { id: 'p6', label: 'P6 (Button 6)', type: 'DIGITAL_IN', voltage: '5V', x: 10, y: 80 },
      { id: 'up', label: 'UP (Joystick)', type: 'DIGITAL_IN', voltage: '5V', x: 90, y: 15 },
      { id: 'down', label: 'DOWN', type: 'DIGITAL_IN', voltage: '5V', x: 90, y: 28 },
      { id: 'left', label: 'LEFT', type: 'DIGITAL_IN', voltage: '5V', x: 90, y: 41 },
      { id: 'right', label: 'RIGHT', type: 'DIGITAL_IN', voltage: '5V', x: 90, y: 54 },
      { id: 'start', label: 'START', type: 'DIGITAL_IN', voltage: '5V', x: 90, y: 67 },
      { id: 'select', label: 'SELECT', type: 'DIGITAL_IN', voltage: '5V', x: 90, y: 80 },
      { id: 'gnd', label: 'GND (Common)', type: 'POWER', voltage: 'GND', x: 50, y: 95 },
    ]
  },
  {
    id: 'coin-mech',
    name: 'Coin Mechanism',
    category: 'input',
    width: 100,
    height: 140,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="100" height="140" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="140" fill="#7f8c8d" stroke="#333" stroke-width="2"/>
        <rect x="20" y="30" width="60" height="80" fill="#34495e" stroke="#222" stroke-width="1"/>
        <circle cx="50" cy="70" r="15" fill="#f39c12" stroke="#e67e22" stroke-width="2"/>
        <text x="50" y="75" font-family="Arial" font-size="16" font-weight="bold" fill="#333" text-anchor="middle">¢</text>
      </svg>
    `),
    ports: [
      { id: 'coin', label: 'COIN', type: 'DIGITAL_OUT', x: 50, y: 5 },
      { id: 'gnd', label: 'GND', type: 'POWER', voltage: 'GND', x: 50, y: 95 },
    ]
  },
  {
    id: 'led-strip',
    name: 'LED Strip (WS2812B)',
    category: 'output',
    width: 180,
    height: 40,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="180" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="40" fill="#1e1e1e" stroke="#333" stroke-width="2"/>
        <circle cx="30" cy="20" r="8" fill="#ff0000"/>
        <circle cx="60" cy="20" r="8" fill="#00ff00"/>
        <circle cx="90" cy="20" r="8" fill="#0000ff"/>
        <circle cx="120" cy="20" r="8" fill="#ff00ff"/>
        <circle cx="150" cy="20" r="8" fill="#ffff00"/>
      </svg>
    `),
    ports: [
      { id: 'din', label: 'DIN', type: 'DIGITAL_IN', voltage: '5V', x: 5, y: 50 },
      { id: '5v', label: '5V', type: 'POWER', voltage: '5V', x: 50, y: 50 },
      { id: 'gnd', label: 'GND', type: 'POWER', voltage: 'GND', x: 95, y: 50 },
    ]
  },
  {
    id: 'speaker-8ohm',
    name: 'Speaker (8Ohm)',
    category: 'output',
    width: 100,
    height: 100,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#34495e" stroke="#2c3e50" stroke-width="3"/>
        <circle cx="50" cy="50" r="35" fill="#1c2833" stroke="#17202a" stroke-width="2"/>
        <circle cx="50" cy="50" r="15" fill="#566573"/>
        <text x="50" y="85" font-family="Arial" font-size="10" fill="#ecf0f1" text-anchor="middle">8 Ohm</text>
      </svg>
    `),
    ports: [
      { id: 'plus', label: '+', type: 'AUDIO', x: 50, y: 5 },
      { id: 'minus', label: '-', type: 'AUDIO', x: 50, y: 95 },
    ]
  },
  {
    id: 'marquee-light',
    name: 'Marquee Light (12V)',
    category: 'output',
    width: 160,
    height: 60,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="160" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="60" fill="#f39c12" stroke="#d68910" stroke-width="2"/>
        <circle cx="30" cy="30" r="12" fill="#fff" opacity="0.8"/>
        <circle cx="60" cy="30" r="12" fill="#fff" opacity="0.8"/>
        <circle cx="90" cy="30" r="12" fill="#fff" opacity="0.8"/>
        <circle cx="120" cy="30" r="12" fill="#fff" opacity="0.8"/>
      </svg>
    `),
    ports: [
      { id: '12v', label: '12V', type: 'POWER', voltage: '12V', x: 5, y: 50 },
      { id: 'gnd', label: 'GND', type: 'POWER', voltage: 'GND', x: 95, y: 50 },
    ]
  },
  {
    id: 'atx-psu',
    name: 'ATX Power Supply',
    category: 'power',
    width: 180,
    height: 120,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="180" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="120" fill="#2c3e50" stroke="#1a252f" stroke-width="2"/>
        <text x="90" y="50" font-family="Arial" font-size="18" font-weight="bold" fill="#ecf0f1" text-anchor="middle">ATX PSU</text>
        <text x="90" y="70" font-family="Arial" font-size="12" fill="#95a5a6" text-anchor="middle">Power Supply</text>
        <rect x="10" y="10" width="160" height="8" fill="#555"/>
      </svg>
    `),
    ports: [
      { id: '3v3', label: '3.3V', type: 'POWER', voltage: '3.3V', x: 10, y: 20 },
      { id: '5v', label: '5V', type: 'POWER', voltage: '5V', x: 10, y: 35 },
      { id: '12v', label: '12V', type: 'POWER', voltage: '12V', x: 10, y: 50 },
      { id: 'gnd1', label: 'GND', type: 'POWER', voltage: 'GND', x: 10, y: 65 },
      { id: 'gnd2', label: 'GND', type: 'POWER', voltage: 'GND', x: 10, y: 80 },
    ]
  },
  {
    id: 'buck-12v-5v',
    name: 'Buck Converter (12V to 5V)',
    category: 'power',
    width: 120,
    height: 80,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#16a085" stroke="#138d75" stroke-width="2"/>
        <text x="60" y="35" font-family="Arial" font-size="14" font-weight="bold" fill="white" text-anchor="middle">12V to 5V</text>
        <text x="60" y="50" font-family="Arial" font-size="10" fill="#ecf0f1" text-anchor="middle">Buck Converter</text>
        <rect x="10" y="10" width="25" height="20" fill="#c0392b"/>
        <rect x="85" y="10" width="25" height="20" fill="#27ae60"/>
      </svg>
    `),
    ports: [
      { id: 'vin', label: 'IN+', type: 'POWER', voltage: '12V', x: 10, y: 40 },
      { id: 'gnd_in', label: 'IN-', type: 'POWER', voltage: 'GND', x: 10, y: 60 },
      { id: 'vout', label: 'OUT+', type: 'POWER', voltage: '5V', x: 90, y: 40 },
      { id: 'gnd_out', label: 'OUT-', type: 'POWER', voltage: 'GND', x: 90, y: 60 },
    ]
  },
  {
    id: 'buck-12v-3v3',
    name: 'Buck Converter (12V to 3.3V)',
    category: 'power',
    width: 120,
    height: 80,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#2980b9" stroke="#21618c" stroke-width="2"/>
        <text x="60" y="35" font-family="Arial" font-size="14" font-weight="bold" fill="white" text-anchor="middle">12V to 3.3V</text>
        <text x="60" y="50" font-family="Arial" font-size="10" fill="#ecf0f1" text-anchor="middle">Buck Converter</text>
        <rect x="10" y="10" width="25" height="20" fill="#c0392b"/>
        <rect x="85" y="10" width="25" height="20" fill="#3498db"/>
      </svg>
    `),
    ports: [
      { id: 'vin', label: 'IN+', type: 'POWER', voltage: '12V', x: 10, y: 40 },
      { id: 'gnd_in', label: 'IN-', type: 'POWER', voltage: 'GND', x: 10, y: 60 },
      { id: 'vout', label: 'OUT+', type: 'POWER', voltage: '3.3V', x: 90, y: 40 },
      { id: 'gnd_out', label: 'OUT-', type: 'POWER', voltage: 'GND', x: 90, y: 60 },
    ]
  },
  {
    id: '5v-psu-25w',
    name: '5V Power Supply (25W, 5A)',
    category: 'power',
    width: 160,
    height: 100,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="160" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="100" fill="#444" stroke="#222" stroke-width="2"/>
        <text x="80" y="40" font-family="Arial" font-size="16" font-weight="bold" fill="#4CAF50" text-anchor="middle">5V PSU</text>
        <text x="80" y="58" font-family="Arial" font-size="12" fill="#fff" text-anchor="middle">25W / 5A</text>
        <text x="80" y="73" font-family="Arial" font-size="9" fill="#aaa" text-anchor="middle">AC 100-240V</text>
        <circle cx="20" cy="30" r="6" fill="#ff0000"/>
        <circle cx="20" cy="60" r="6" fill="#000"/>
      </svg>
    `),
    ports: [
      { id: 'vout', label: '5V OUT', type: 'POWER', voltage: '5V', x: 5, y: 30 },
      { id: 'gnd', label: 'GND', type: 'POWER', voltage: 'GND', x: 5, y: 60 },
    ]
  },
  {
    id: 'dpdt-switch',
    name: 'DPDT Switch (Self-Locking)',
    category: 'input',
    width: 80,
    height: 100,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="80" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="100" fill="#34495e" stroke="#2c3e50" stroke-width="2" rx="4"/>
        <rect x="25" y="30" width="30" height="40" fill="#7f8c8d" stroke="#555" stroke-width="1" rx="2"/>
        <circle cx="40" cy="50" r="8" fill="#95a5a6"/>
        <text x="40" y="88" font-family="Arial" font-size="9" fill="#ecf0f1" text-anchor="middle">DPDT</text>
      </svg>
    `),
    ports: [
      { id: 'com1', label: 'COM1 (Common 1)', type: 'DIGITAL_IN', x: 10, y: 30 },
      { id: 'no1', label: 'NO1 (Norm Open 1)', type: 'DIGITAL_OUT', x: 10, y: 50 },
      { id: 'nc1', label: 'NC1 (Norm Close 1)', type: 'DIGITAL_OUT', x: 10, y: 70 },
      { id: 'com2', label: 'COM2 (Common 2)', type: 'DIGITAL_IN', x: 90, y: 30 },
      { id: 'no2', label: 'NO2 (Norm Open 2)', type: 'DIGITAL_OUT', x: 90, y: 50 },
      { id: 'nc2', label: 'NC2 (Norm Close 2)', type: 'DIGITAL_OUT', x: 90, y: 70 },
    ]
  },
  {
    id: 'micro-switch',
    name: 'Micro Switch',
    category: 'input',
    width: 60,
    height: 70,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="60" height="70" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="70" fill="#2c3e50" stroke="#1a252f" stroke-width="2" rx="3"/>
        <rect x="15" y="15" width="30" height="40" fill="#34495e" stroke="#222" stroke-width="1" rx="2"/>
        <rect x="42" y="25" width="12" height="4" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
        <circle cx="30" cy="35" r="6" fill="#7f8c8d"/>
      </svg>
    `),
    ports: [
      { id: 'com', label: 'COM (Common)', type: 'DIGITAL_IN', x: 50, y: 15 },
      { id: 'no', label: 'NO (Norm Open)', type: 'DIGITAL_OUT', x: 50, y: 50 },
      { id: 'nc', label: 'NC (Norm Close)', type: 'DIGITAL_OUT', x: 50, y: 85 },
    ]
  },
  {
    id: 'tactile-button',
    name: 'Tactile Push Button',
    category: 'input',
    width: 50,
    height: 50,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect width="50" height="50" fill="#1a252f" stroke="#111" stroke-width="2" rx="2"/>
        <circle cx="25" cy="25" r="15" fill="#34495e" stroke="#2c3e50" stroke-width="2"/>
        <circle cx="25" cy="25" r="10" fill="#555"/>
        <circle cx="22" cy="22" r="3" fill="#666" opacity="0.5"/>
      </svg>
    `),
    ports: [
      { id: 'pin1', label: 'Pin 1 (to GND)', type: 'DIGITAL_IN', x: 10, y: 10 },
      { id: 'pin2', label: 'Pin 2 (to GPIO)', type: 'DIGITAL_OUT', x: 90, y: 10 },
      { id: 'pin3', label: 'Pin 3 (to GND)', type: 'DIGITAL_IN', x: 10, y: 90 },
      { id: 'pin4', label: 'Pin 4 (to GPIO)', type: 'DIGITAL_OUT', x: 90, y: 90 },
    ]
  },
  {
    id: 'momentary-button-12mm',
    name: '12mm Momentary Push Button (SPST)',
    category: 'input',
    width: 60,
    height: 60,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="28" fill="#3498db" stroke="#2980b9" stroke-width="2"/>
        <circle cx="30" cy="30" r="22" fill="#5dade2" stroke="#3498db" stroke-width="1"/>
        <circle cx="30" cy="30" r="12" fill="#85c1e9"/>
        <circle cx="27" cy="27" r="4" fill="#aed6f1" opacity="0.6"/>
        <text x="30" y="52" font-family="Arial" font-size="7" fill="#2c3e50" text-anchor="middle">12mm SPST</text>
      </svg>
    `),
    ports: [
      { id: 'in', label: 'IN (signal in)', type: 'DIGITAL_IN', x: 50, y: 20 },
      { id: 'out', label: 'OUT (signal out)', type: 'DIGITAL_OUT', x: 50, y: 80 },
    ]
  },
  {
    id: 'rocker-switch',
    name: 'Rocker Power Switch (SPST)',
    category: 'power',
    width: 80,
    height: 60,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="80" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="60" fill="#2c3e50" stroke="#1a252f" stroke-width="2" rx="4"/>
        <rect x="15" y="12" width="50" height="36" fill="#34495e" stroke="#222" stroke-width="1" rx="4"/>
        <path d="M 25 24 L 35 24 L 40 36 L 30 36 Z" fill="#e74c3c"/>
        <circle cx="20" cy="30" r="2" fill="#27ae60"/>
        <text x="40" y="55" font-family="Arial" font-size="8" fill="#ecf0f1" text-anchor="middle">ON/OFF</text>
      </svg>
    `),
    ports: [
      { id: 'in', label: 'IN (from PSU+)', type: 'POWER', voltage: '12V', x: 10, y: 50 },
      { id: 'out', label: 'OUT (to devices+)', type: 'POWER', voltage: '12V', x: 90, y: 50 },
    ]
  },
  {
    id: 'battery-9v',
    name: '9V Battery',
    category: 'power',
    width: 60,
    height: 100,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="60" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="100" fill="#34495e" stroke="#2c3e50" stroke-width="2" rx="4"/>
        <rect x="20" y="5" width="20" height="10" fill="#555" rx="2"/>
        <text x="30" y="55" font-family="Arial" font-size="18" font-weight="bold" fill="#ecf0f1" text-anchor="middle">9V</text>
        <rect x="10" y="75" width="15" height="15" fill="#e74c3c" rx="2"/>
        <rect x="35" y="75" width="15" height="15" fill="#2c3e50" rx="2"/>
        <text x="17" y="86" font-family="Arial" font-size="12" font-weight="bold" fill="white" text-anchor="middle">+</text>
        <text x="42" y="86" font-family="Arial" font-size="12" font-weight="bold" fill="#95a5a6" text-anchor="middle">-</text>
      </svg>
    `),
    ports: [
      { id: 'plus', label: '+', type: 'POWER', voltage: '9V', x: 20, y: 92 },
      { id: 'minus', label: '-', type: 'POWER', voltage: 'GND', x: 80, y: 92 },
    ]
  },
  {
    id: 'battery-pack-4aa',
    name: 'Battery Pack (4x AA)',
    category: 'power',
    width: 120,
    height: 80,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#2c3e50" stroke="#1a252f" stroke-width="2" rx="4"/>
        <rect x="15" y="20" width="20" height="40" fill="#95a5a6" stroke="#7f8c8d" stroke-width="1" rx="2"/>
        <rect x="40" y="20" width="20" height="40" fill="#95a5a6" stroke="#7f8c8d" stroke-width="1" rx="2"/>
        <rect x="65" y="20" width="20" height="40" fill="#95a5a6" stroke="#7f8c8d" stroke-width="1" rx="2"/>
        <rect x="90" y="20" width="20" height="40" fill="#95a5a6" stroke="#7f8c8d" stroke-width="1" rx="2"/>
        <text x="60" y="73" font-family="Arial" font-size="9" fill="#ecf0f1" text-anchor="middle">4x AA = 6V</text>
      </svg>
    `),
    ports: [
      { id: 'plus', label: '+', type: 'POWER', voltage: '5V', x: 10, y: 50 },
      { id: 'minus', label: '-', type: 'POWER', voltage: 'GND', x: 90, y: 50 },
    ]
  },
  {
    id: 'usb-power-bank',
    name: 'USB Power Bank',
    category: 'power',
    width: 120,
    height: 80,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#34495e" stroke="#2c3e50" stroke-width="2" rx="8"/>
        <rect x="15" y="30" width="18" height="12" fill="#222" rx="2"/>
        <text x="60" y="45" font-family="Arial" font-size="14" font-weight="bold" fill="#3498db" text-anchor="middle">USB</text>
        <text x="60" y="60" font-family="Arial" font-size="10" fill="#ecf0f1" text-anchor="middle">Power Bank</text>
        <circle cx="95" cy="20" r="4" fill="#27ae60"/>
        <circle cx="105" cy="20" r="4" fill="#27ae60"/>
      </svg>
    `),
    ports: [
      { id: 'usb_out', label: '5V OUT', type: 'POWER', voltage: '5V', x: 25, y: 8 },
      { id: 'gnd', label: 'GND', type: 'POWER', voltage: 'GND', x: 25, y: 92 },
    ]
  },
  {
    id: 'power-button-latching-16mm',
    name: '16mm Latching Power Button (LED)',
    category: 'power',
    width: 70,
    height: 70,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="35" r="33" fill="#2c3e50" stroke="#1a252f" stroke-width="2"/>
        <circle cx="35" cy="35" r="26" fill="#34495e" stroke="#2c3e50" stroke-width="1"/>
        <circle cx="35" cy="35" r="18" fill="#1a252f"/>
        <path d="M 35 20 L 35 28 M 35 28 A 7 7 0 0 1 35 42" stroke="#27ae60" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="32" cy="32" r="3" fill="#27ae60" opacity="0.4"/>
        <text x="35" y="62" font-family="Arial" font-size="7" fill="#95a5a6" text-anchor="middle">16mm LED</text>
      </svg>
    `),
    ports: [
      { id: 'pwr_in', label: 'PWR IN (from PSU)', type: 'POWER', voltage: '12V', x: 10, y: 30 },
      { id: 'pwr_out', label: 'PWR OUT (to device)', type: 'POWER', voltage: '12V', x: 90, y: 30 },
      { id: 'led_plus', label: 'LED+', type: 'POWER', voltage: '12V', x: 10, y: 70 },
      { id: 'led_gnd', label: 'LED-', type: 'POWER', voltage: 'GND', x: 90, y: 70 },
    ]
  },
  {
    id: 'power-button-momentary-19mm',
    name: '19mm Momentary Power Button (LED Ring)',
    category: 'power',
    width: 80,
    height: 80,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="37" fill="#34495e" stroke="#2c3e50" stroke-width="2"/>
        <circle cx="40" cy="40" r="30" fill="#2c3e50" stroke="#1a252f" stroke-width="1"/>
        <circle cx="40" cy="40" r="28" fill="none" stroke="#3498db" stroke-width="2" opacity="0.8"/>
        <circle cx="40" cy="40" r="20" fill="#1a252f"/>
        <path d="M 40 25 L 40 32 M 40 32 A 8 8 0 0 1 40 48" stroke="#3498db" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="37" cy="37" r="4" fill="#5dade2" opacity="0.5"/>
        <text x="40" y="72" font-family="Arial" font-size="7" fill="#95a5a6" text-anchor="middle">19mm Ring</text>
      </svg>
    `),
    ports: [
      { id: 'sw_in', label: 'SW IN (signal)', type: 'DIGITAL_IN', x: 10, y: 35 },
      { id: 'sw_out', label: 'SW OUT (signal)', type: 'DIGITAL_OUT', x: 90, y: 35 },
      { id: 'led_plus', label: 'LED+', type: 'POWER', voltage: '12V', x: 10, y: 65 },
      { id: 'led_gnd', label: 'LED-', type: 'POWER', voltage: 'GND', x: 90, y: 65 },
    ]
  },
  {
    id: 'power-button-soft-power',
    name: 'Soft Power Button (ATX Style)',
    category: 'power',
    width: 90,
    height: 70,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="90" height="70" xmlns="http://www.w3.org/2000/svg">
        <rect width="90" height="70" fill="#1a252f" stroke="#0d1117" stroke-width="2" rx="6"/>
        <rect x="10" y="15" width="70" height="40" fill="#2c3e50" stroke="#1a252f" stroke-width="1" rx="4"/>
        <circle cx="45" cy="35" r="12" fill="#34495e"/>
        <path d="M 45 25 L 45 30 M 45 30 A 5 5 0 0 1 45 40" stroke="#e74c3c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="43" cy="33" r="2" fill="#e74c3c" opacity="0.4"/>
        <text x="45" y="64" font-family="Arial" font-size="7" fill="#95a5a6" text-anchor="middle">ATX/Soft</text>
      </svg>
    `),
    ports: [
      { id: 'pwr_sw', label: 'PWR_SW (to GPIO)', type: 'DIGITAL_OUT', x: 10, y: 50 },
      { id: 'gnd', label: 'GND', type: 'POWER', voltage: 'GND', x: 90, y: 50 },
      { id: 'led_plus', label: 'PWR_LED+', type: 'DIGITAL_IN', x: 50, y: 8 },
      { id: 'led_gnd', label: 'PWR_LED-', type: 'POWER', voltage: 'GND', x: 50, y: 92 },
    ]
  },
  {
    id: 'power-button-vandal-resistant',
    name: '22mm Vandal Resistant Power Button (Illuminated)',
    category: 'power',
    width: 90,
    height: 90,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="90" height="90" xmlns="http://www.w3.org/2000/svg">
        <circle cx="45" cy="45" r="42" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="3"/>
        <circle cx="45" cy="45" r="35" fill="#34495e" stroke="#2c3e50" stroke-width="2"/>
        <circle cx="45" cy="45" r="28" fill="#2c3e50"/>
        <circle cx="45" cy="45" r="22" fill="#1a252f"/>
        <path d="M 45 28 L 45 35 M 45 35 A 10 10 0 0 1 45 55" stroke="#f39c12" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="41" cy="41" r="5" fill="#f39c12" opacity="0.3"/>
        <text x="45" y="83" font-family="Arial" font-size="7" fill="#95a5a6" text-anchor="middle">22mm V.R.</text>
      </svg>
    `),
    ports: [
      { id: 'no', label: 'NO (Norm Open)', type: 'POWER', voltage: '12V', x: 10, y: 40 },
      { id: 'com', label: 'COM (Common)', type: 'POWER', voltage: '12V', x: 50, y: 10 },
      { id: 'nc', label: 'NC (Norm Close)', type: 'POWER', voltage: '12V', x: 90, y: 40 },
      { id: 'led_plus', label: 'LED+', type: 'POWER', voltage: '12V', x: 30, y: 92 },
      { id: 'led_gnd', label: 'LED-', type: 'POWER', voltage: 'GND', x: 70, y: 92 },
    ]
  },
  {
    id: 'power-button-emergency-stop',
    name: 'Emergency Stop Power Button (40mm)',
    category: 'power',
    width: 100,
    height: 100,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="47" fill="#2c3e50" stroke="#1a252f" stroke-width="2"/>
        <circle cx="50" cy="50" r="38" fill="#e74c3c" stroke="#c0392b" stroke-width="3"/>
        <circle cx="50" cy="50" r="30" fill="#c0392b"/>
        <polygon points="50,35 55,45 45,45" fill="#fff" opacity="0.3"/>
        <text x="50" y="58" font-family="Arial" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">STOP</text>
        <text x="50" y="92" font-family="Arial" font-size="7" fill="#95a5a6" text-anchor="middle">E-STOP 40mm</text>
      </svg>
    `),
    ports: [
      { id: 'nc1', label: 'NC1 (Norm Close 1)', type: 'POWER', voltage: '12V', x: 10, y: 35 },
      { id: 'com1', label: 'COM1 (Common 1)', type: 'POWER', voltage: '12V', x: 10, y: 65 },
      { id: 'nc2', label: 'NC2 (Norm Close 2)', type: 'POWER', voltage: '12V', x: 90, y: 35 },
      { id: 'com2', label: 'COM2 (Common 2)', type: 'POWER', voltage: '12V', x: 90, y: 65 },
    ]
  },
  {
    id: 'power-button-push-on-off',
    name: 'Push ON/OFF Power Button (Metal, 12mm)',
    category: 'power',
    width: 65,
    height: 65,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="65" height="65" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32.5" cy="32.5" r="30" fill="#95a5a6" stroke="#7f8c8d" stroke-width="2"/>
        <circle cx="32.5" cy="32.5" r="24" fill="#bdc3c7" stroke="#95a5a6" stroke-width="1"/>
        <circle cx="32.5" cy="32.5" r="18" fill="#34495e"/>
        <circle cx="32.5" cy="32.5" r="14" fill="#2c3e50"/>
        <path d="M 32.5 20 L 32.5 25 M 32.5 25 A 7.5 7.5 0 0 1 32.5 40" stroke="#ecf0f1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <text x="32.5" y="58" font-family="Arial" font-size="6" fill="#7f8c8d" text-anchor="middle">ON/OFF</text>
      </svg>
    `),
    ports: [
      { id: 'in', label: '+12V IN (from PSU)', type: 'POWER', voltage: '12V', x: 10, y: 35 },
      { id: 'out', label: '+12V OUT (to devices)', type: 'POWER', voltage: '12V', x: 90, y: 35 },
      { id: 'gnd_in', label: 'GND IN (from PSU)', type: 'POWER', voltage: 'GND', x: 10, y: 65 },
      { id: 'gnd_out', label: 'GND OUT (to devices)', type: 'POWER', voltage: 'GND', x: 90, y: 65 },
    ]
  },
  {
    id: 'barrel-jack-2.1mm',
    name: 'DC Barrel Jack (2.1mm, Panel Mount)',
    category: 'power',
    width: 80,
    height: 80,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#34495e" stroke="#2c3e50" stroke-width="2" rx="4"/>
        <circle cx="40" cy="40" r="28" fill="#7f8c8d" stroke="#5d6d7e" stroke-width="2"/>
        <circle cx="40" cy="40" r="20" fill="#2c3e50" stroke="#1a252f" stroke-width="1"/>
        <circle cx="40" cy="40" r="12" fill="#34495e"/>
        <circle cx="40" cy="40" r="6" fill="#555"/>
        <text x="40" y="70" font-family="Arial" font-size="8" fill="#ecf0f1" text-anchor="middle">2.1mm Jack</text>
      </svg>
    `),
    ports: [
      { id: 'center', label: 'Center Pin (+) [solder]', type: 'POWER', voltage: '5V', x: 50, y: 10 },
      { id: 'sleeve', label: 'Sleeve (-/GND) [solder]', type: 'POWER', voltage: 'GND', x: 50, y: 90 },
    ]
  },
  {
    id: 'barrel-jack-2.5mm',
    name: 'DC Barrel Jack (2.5mm, Panel Mount)',
    category: 'power',
    width: 80,
    height: 80,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#2c3e50" stroke="#1a252f" stroke-width="2" rx="4"/>
        <circle cx="40" cy="40" r="30" fill="#555" stroke="#333" stroke-width="2"/>
        <circle cx="40" cy="40" r="22" fill="#2c3e50" stroke="#1a252f" stroke-width="1"/>
        <circle cx="40" cy="40" r="14" fill="#34495e"/>
        <circle cx="40" cy="40" r="8" fill="#555"/>
        <text x="40" y="70" font-family="Arial" font-size="8" fill="#95a5a6" text-anchor="middle">2.5mm Jack</text>
      </svg>
    `),
    ports: [
      { id: 'center', label: 'Center Pin (+) [solder]', type: 'POWER', voltage: '5V', x: 50, y: 10 },
      { id: 'sleeve', label: 'Sleeve (-/GND) [solder]', type: 'POWER', voltage: 'GND', x: 50, y: 90 },
    ]
  },
  {
    id: 'iec-c14-inlet',
    name: 'IEC C14 Power Inlet (AC Mains)',
    category: 'power',
    width: 100,
    height: 70,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="100" height="70" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="70" fill="#1a1a1a" stroke="#000" stroke-width="2" rx="4"/>
        <rect x="15" y="15" width="70" height="40" fill="#34495e" stroke="#222" stroke-width="2" rx="3"/>
        <rect x="30" y="25" width="10" height="20" fill="#c0392b"/>
        <rect x="45" y="25" width="10" height="20" fill="#c0392b"/>
        <rect x="60" y="25" width="10" height="20" fill="#27ae60"/>
        <text x="50" y="63" font-family="Arial" font-size="7" fill="#95a5a6" text-anchor="middle">IEC C14</text>
      </svg>
    `),
    ports: [
      { id: 'live', label: 'Live (L) [solder/spade]', type: 'POWER', voltage: 'AC_MAINS', x: 20, y: 10 },
      { id: 'neutral', label: 'Neutral (N) [solder/spade]', type: 'POWER', voltage: 'AC_MAINS', x: 50, y: 10 },
      { id: 'ground', label: 'Ground (⏚) [solder/spade]', type: 'POWER', voltage: 'GND', x: 80, y: 10 },
    ]
  },
  {
    id: 'screw-terminal-2p',
    name: '2-Pin Screw Terminal Block',
    category: 'power',
    width: 70,
    height: 50,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="70" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect width="70" height="50" fill="#27ae60" stroke="#229954" stroke-width="2" rx="2"/>
        <rect x="10" y="10" width="22" height="30" fill="#2c3e50" stroke="#1a252f" stroke-width="1"/>
        <rect x="38" y="10" width="22" height="30" fill="#2c3e50" stroke="#1a252f" stroke-width="1"/>
        <circle cx="21" cy="18" r="3" fill="#555"/>
        <circle cx="49" cy="18" r="3" fill="#555"/>
        <line x1="18" y1="18" x2="24" y2="18" stroke="#777" stroke-width="1"/>
        <line x1="46" y1="18" x2="52" y2="18" stroke="#777" stroke-width="1"/>
        <text x="35" y="47" font-family="Arial" font-size="6" fill="#1a252f" text-anchor="middle">2P Terminal</text>
      </svg>
    `),
    ports: [
      { id: 'pin1', label: 'Pin 1 (+) [screw]', type: 'POWER', voltage: '5V', x: 25, y: 8 },
      { id: 'pin2', label: 'Pin 2 (-) [screw]', type: 'POWER', voltage: 'GND', x: 75, y: 8 },
    ]
  },
  {
    id: 'phoenix-connector-2p',
    name: 'Phoenix Connector (2-Pin, Pluggable)',
    category: 'power',
    width: 60,
    height: 50,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="60" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="50" fill="#16a085" stroke="#138d75" stroke-width="2" rx="2"/>
        <rect x="8" y="8" width="20" height="34" fill="#2c3e50" stroke="#1a252f" stroke-width="1"/>
        <rect x="32" y="8" width="20" height="34" fill="#2c3e50" stroke="#1a252f" stroke-width="1"/>
        <circle cx="18" cy="16" r="3" fill="#555"/>
        <circle cx="42" cy="16" r="3" fill="#555"/>
        <rect x="14" y="28" width="8" height="8" fill="#e67e22" stroke="#d35400" stroke-width="1"/>
        <rect x="38" y="28" width="8" height="8" fill="#e67e22" stroke="#d35400" stroke-width="1"/>
        <text x="30" y="47" font-family="Arial" font-size="6" fill="#0a3d2e" text-anchor="middle">Phoenix 2P</text>
      </svg>
    `),
    ports: [
      { id: 'pin1', label: 'Pin 1 (+) [pluggable]', type: 'POWER', voltage: '5V', x: 25, y: 8 },
      { id: 'pin2', label: 'Pin 2 (-) [pluggable]', type: 'POWER', voltage: 'GND', x: 75, y: 8 },
    ]
  },
  {
    id: 'spade-connector-pair',
    name: 'Spade Connector Pair (Insulated)',
    category: 'power',
    width: 100,
    height: 40,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="100" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="40" height="30" fill="#e74c3c" stroke="#c0392b" stroke-width="2" rx="3"/>
        <rect x="55" y="5" width="40" height="30" fill="#1a1a1a" stroke="#000" stroke-width="2" rx="3"/>
        <path d="M 25 20 L 10 15 L 10 25 Z" fill="#c0392b"/>
        <path d="M 75 20 L 90 15 L 90 25 Z" fill="#000"/>
        <text x="50" y="38" font-family="Arial" font-size="6" fill="#555" text-anchor="middle">Spade Pair</text>
      </svg>
    `),
    ports: [
      { id: 'plus', label: '+ (crimp wire)', type: 'POWER', voltage: '5V', x: 10, y: 50 },
      { id: 'minus', label: '- (crimp wire)', type: 'POWER', voltage: 'GND', x: 90, y: 50 },
    ]
  },
  {
    id: 'wire-splice-connector',
    name: 'Wire Splice Connector (Lever Nut)',
    category: 'power',
    width: 60,
    height: 50,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="60" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="50" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="2" rx="2"/>
        <rect x="10" y="12" width="15" height="26" fill="#e67e22" stroke="#d35400" stroke-width="1" rx="1"/>
        <rect x="35" y="12" width="15" height="26" fill="#e67e22" stroke="#d35400" stroke-width="1" rx="1"/>
        <line x1="10" y1="22" x2="25" y2="22" stroke="#555" stroke-width="2"/>
        <line x1="35" y1="22" x2="50" y2="22" stroke="#555" stroke-width="2"/>
        <text x="30" y="47" font-family="Arial" font-size="6" fill="#555" text-anchor="middle">Lever Nut</text>
      </svg>
    `),
    ports: [
      { id: 'in1', label: 'In 1 [insert wire]', type: 'POWER', voltage: '5V', x: 20, y: 8 },
      { id: 'in2', label: 'In 2 [insert wire]', type: 'POWER', voltage: '5V', x: 80, y: 8 },
    ]
  },
  {
    id: 'coin-light-12v',
    name: 'Coin Slot Light (12V LED)',
    category: 'output',
    width: 100,
    height: 60,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="100" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="#1a252f" stroke="#0d1117" stroke-width="2" rx="4"/>
        <ellipse cx="50" cy="30" rx="35" ry="18" fill="#f39c12" opacity="0.3"/>
        <ellipse cx="50" cy="30" rx="28" ry="14" fill="#f1c40f" opacity="0.5"/>
        <ellipse cx="50" cy="30" rx="20" ry="10" fill="#ffd700"/>
        <circle cx="45" cy="28" r="3" fill="#fff" opacity="0.7"/>
        <text x="50" y="54" font-family="Arial" font-size="8" fill="#95a5a6" text-anchor="middle">Coin Light</text>
      </svg>
    `),
    ports: [
      { id: 'plus', label: '5V (+) [solder]', type: 'POWER', voltage: '5V', x: 10, y: 50 },
      { id: 'gnd', label: 'GND (-) [solder]', type: 'POWER', voltage: 'GND', x: 90, y: 50 },
    ]
  },
  {
    id: 'coin-light-5v-rgb',
    name: 'Coin Slot RGB Light (5V Addressable)',
    category: 'output',
    width: 110,
    height: 65,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="110" height="65" xmlns="http://www.w3.org/2000/svg">
        <rect width="110" height="65" fill="#2c3e50" stroke="#1a252f" stroke-width="2" rx="4"/>
        <ellipse cx="55" cy="32" rx="38" ry="20" fill="#e74c3c" opacity="0.2"/>
        <ellipse cx="55" cy="32" rx="38" ry="20" fill="#2ecc71" opacity="0.2"/>
        <ellipse cx="55" cy="32" rx="38" ry="20" fill="#3498db" opacity="0.2"/>
        <ellipse cx="55" cy="32" rx="30" ry="15" fill="#fff" opacity="0.6"/>
        <circle cx="50" cy="30" r="4" fill="#fff" opacity="0.8"/>
        <text x="55" y="58" font-family="Arial" font-size="7" fill="#ecf0f1" text-anchor="middle">RGB Coin Light</text>
      </svg>
    `),
    ports: [
      { id: 'din', label: 'DIN (data) [solder]', type: 'DIGITAL_IN', voltage: '5V', x: 10, y: 50 },
      { id: '5v', label: '5V (+) [solder]', type: 'POWER', voltage: '5V', x: 50, y: 8 },
      { id: 'gnd', label: 'GND (-) [solder]', type: 'POWER', voltage: 'GND', x: 90, y: 50 },
    ]
  },
  {
    id: 'coin-light-strip-5v',
    name: 'Coin Light Strip (5V, 3 LEDs)',
    category: 'output',
    width: 140,
    height: 50,
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="140" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect width="140" height="50" fill="#34495e" stroke="#2c3e50" stroke-width="2" rx="3"/>
        <circle cx="30" cy="25" r="12" fill="#f39c12" opacity="0.6"/>
        <circle cx="70" cy="25" r="12" fill="#f39c12" opacity="0.6"/>
        <circle cx="110" cy="25" r="12" fill="#f39c12" opacity="0.6"/>
        <circle cx="30" cy="25" r="8" fill="#ffd700"/>
        <circle cx="70" cy="25" r="8" fill="#ffd700"/>
        <circle cx="110" cy="25" r="8" fill="#ffd700"/>
        <circle cx="27" cy="22" r="2" fill="#fff" opacity="0.8"/>
        <circle cx="67" cy="22" r="2" fill="#fff" opacity="0.8"/>
        <circle cx="107" cy="22" r="2" fill="#fff" opacity="0.8"/>
        <text x="70" y="46" font-family="Arial" font-size="7" fill="#95a5a6" text-anchor="middle">3x LED Strip</text>
      </svg>
    `),
    ports: [
      { id: '5v', label: '5V (+) [solder]', type: 'POWER', voltage: '5V', x: 10, y: 50 },
      { id: 'gnd', label: 'GND (-) [solder]', type: 'POWER', voltage: 'GND', x: 90, y: 50 },
    ]
  }
];
