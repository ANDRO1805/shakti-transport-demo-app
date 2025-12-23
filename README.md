# Shakti Transport | Industrial Command Center

A high-performance, industrial-grade Logistics and Freight Management System designed for the Gujarat industrial sector. This platform provides real-time telemetry, manifest lifecycle management, and financial oversight.

## 🚀 Key Modules

### 1. Mission Control (Overview)
- **Financial Node**: Track Gross Revenue (MTD), Settled Capital, and Outstanding Dues.
- **Operational Heartbeat**: Real-time monitoring of system manifest nodes.
- **Fleet Readiness**: Visual gauges for available, in-transit, and maintenance-hold assets.

### 2. Manifest Engine
- **Command Console**: Administrative override to update shipment statuses (Dispatched, In Transit, Delivered, Invoiced).
- **Multi-Stop Routing**: Support for complex delivery chains with sequential node tracking.
- **Audit Logs**: Full historical tracking of status changes and asset assignments.

### 3. Fleet & Personnel
- **Asset Vault**: Detailed management of truck categories (Eicher, Bolero, Carry) and maintenance cycles.
- **Identity Vault**: Role-based access control for Super Admins, Owners, and Representatives.

### 4. AI Intelligence
- **AI Fleet Guard**: Simulated neural network monitoring driver biometrics and vehicle integrity.
- **Cargo Optimizer**: Volumetric load simulation for maximizing payload efficiency.
- **Shakti AI Core**: Gemini 3 Flash-powered assistant for logistics queries.

## 🛠 Tech Stack

- **Frontend**: React 19 (TSX), Tailwind CSS
- **Icons**: Lucide React
- **Analytics**: Recharts
- **AI**: Google Gemini API (@google/genai)
- **Deployment**: ES6 Module structure with standard Import Maps

## ⚙️ Local Development

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   Create a `.env` file and add your Gemini API Key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```
4. **Launch Application**:
   ```bash
   npm start
   ```

## 🔒 Security
The application features a secure identity vault with auto-logout protection for blocked accounts and hierarchical permission levels.

---
*Built for industrial precision. Optimized for Shakti Transport.*