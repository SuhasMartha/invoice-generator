# InvoicePro - Professional Invoice Generator

<div align="center">

![InvoicePro Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=InvoicePro+-+Professional+Invoice+Generator)

A modern, feature-rich invoice generator web application built with vanilla HTML, CSS, and JavaScript. Create, manage, and export professional invoices with ease.

[![Version](https://img.shields.io/badge/Version-1.0.0-4F46E5?style=for-the-badge)](https://github.com/suhasmartha)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Suhas%20Martha-7C3AED?style=for-the-badge)](https://suhasmartha.github.io)

[Live Demo](https://suhasmartha.github.io/invoice-generator) • [Report Bug](https://github.com/suhasmartha/invoice-generator/issues) • [Request Feature](https://github.com/suhasmartha/invoice-generator/issues)

</div>

---

## 🚀 Features

### Invoice Management
- **Create Professional Invoices** - Beautiful, customizable invoice templates
- **Multiple Templates** - Choose from Modern, Classic, Minimal, and Creative designs
- **Live Preview** - See changes in real-time as you edit
- **PDF Export** - Download invoices as high-quality PDF files
- **Save & Load** - Save invoices locally and load them anytime

### Client Management
- **Client Database** - Store and manage all your clients
- **Quick Selection** - Auto-fill client details when creating invoices
- **Client History** - View all invoices for each client

### Dashboard
- **Overview Statistics** - Total invoices, paid, pending, and overdue counts
- **Revenue Tracking** - Monitor total and pending revenue
- **Recent Invoices** - Quick access to latest invoices
- **Top Clients** - See your most valuable clients

### Additional Features
- **Multi-Currency Support** - INR, USD, EUR, GBP, and more
- **Tax Calculations** - Automatic tax computation
- **Demo Mode** - Try the app without signing up
- **User Authentication** - Secure login to save your data
- **Company Profile** - Store your business details for invoices
- **Responsive Design** - Works on desktop, tablet, and mobile

## 📁 Project Structure

```
Invoice Generator/
├── index.html          # Create Invoice page
├── dashboard.html      # Dashboard with statistics
├── invoices.html       # All Invoices listing
├── clients.html        # Client management
├── settings.html       # App settings
├── profile.html        # Company profile
├── login.html          # Authentication page
├── css/
│   ├── styles.css      # Main styles
│   ├── dashboard.css   # Dashboard styles
│   ├── invoices.css    # Invoices page styles
│   ├── clients.css     # Clients page styles
│   ├── settings.css    # Settings page styles
│   ├── profile.css     # Profile page styles
│   └── auth.css        # Authentication styles
├── js/
│   ├── app.js          # Main application logic
│   ├── templates.js    # Invoice templates
│   ├── dashboard.js    # Dashboard functionality
│   ├── invoices.js     # Invoices listing logic
│   ├── clients.js      # Client management
│   ├── settings.js     # Settings functionality
│   ├── profile.js      # Profile management
│   ├── auth.js         # Authentication logic
│   ├── auth-check.js   # Auth state management
│   └── pdf-generator.js # PDF generation utilities
└── README.md
```

## 🛠️ Installation

No installation required! Simply open `index.html` in your web browser.

### Local Development
1. Clone or download this repository
2. Open `index.html` in your browser
3. Start creating invoices!

### Using a Local Server (Optional)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

## 💻 Usage

### Creating an Invoice
1. Navigate to **Create Invoice** page
2. Fill in your business details
3. Add client information
4. Add line items (description, quantity, price)
5. Preview your invoice in real-time
6. Click **Save** to store or **Download PDF** to export

### Managing Clients
1. Go to **Clients** page
2. Click **Add Client** to create a new client
3. Fill in client details (name, email, address, etc.)
4. Use stored clients when creating invoices

### Viewing All Invoices
1. Navigate to **All Invoices**
2. Filter by status, date, or search by client name
3. Click on an invoice to view, edit, or download
4. Use bulk actions for multiple invoices

### Demo Mode vs Logged In
- **Demo Mode**: Try all features, data stored temporarily
- **Logged In**: Data persists permanently, access company profile

## 🎨 Invoice Templates

| Template | Description |
|----------|-------------|
| **Modern** | Clean, contemporary design with accent colors |
| **Classic** | Traditional professional layout |
| **Minimal** | Simple, elegant with lots of whitespace |
| **Creative** | Bold design with unique styling |

## 💾 Data Storage

All data is stored locally in your browser using `localStorage`:
- Invoices
- Clients
- Company profile
- User preferences
- Authentication data

> **Note**: Clearing browser data will remove all stored information. Consider exporting important invoices regularly.

## 🔒 Privacy

- All data stays on your device
- No external servers or databases
- No tracking or analytics
- Complete privacy and control

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 📱 Responsive Design

InvoicePro is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Suhas Martha**
- Portfolio: [suhasmartha.github.io](https://suhasmartha.github.io)

## 🙏 Acknowledgments

- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) - PDF generation
- [Inter Font](https://fonts.google.com/specimen/Inter) - Typography
- Icons inspired by [Feather Icons](https://feathericons.com/)

---

© 2026 Suhas Martha. All rights reserved.
