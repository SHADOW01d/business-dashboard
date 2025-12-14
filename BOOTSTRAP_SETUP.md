# 🎨 Bootstrap 5 Integration Guide

## 📦 Installation

```bash
cd frontend
npm install bootstrap react-bootstrap
```

## 🚀 Quick Setup

### **Step 1: Update index.js**

```javascript
// frontend/src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### **Step 2: Update App.js**

```javascript
// frontend/src/App.js
import { Container } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <Container fluid className="p-0">
      {/* Your app content */}
    </Container>
  );
}

export default App;
```

## 🎯 Common Bootstrap Components

### **Navbar**
```javascript
import { Navbar, Nav, Container } from 'react-bootstrap';

<Navbar bg="dark" expand="lg" sticky="top">
  <Container>
    <Navbar.Brand href="#home">ProShop</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#about">About</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
```

### **Cards**
```javascript
import { Card, Row, Col } from 'react-bootstrap';

<Row className="g-4">
  <Col md={6} lg={3}>
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Income</Card.Title>
        <Card.Text className="fs-5">675,000</Card.Text>
      </Card.Body>
    </Card>
  </Col>
</Row>
```

### **Buttons**
```javascript
import { Button } from 'react-bootstrap';

<Button variant="primary" size="lg">
  Add Stock
</Button>

<Button variant="success" className="me-2">
  Save
</Button>

<Button variant="danger">
  Delete
</Button>
```

### **Forms**
```javascript
import { Form, Button } from 'react-bootstrap';

<Form>
  <Form.Group className="mb-3">
    <Form.Label>Product Name</Form.Label>
    <Form.Control type="text" placeholder="Enter name" />
  </Form.Group>
  
  <Form.Group className="mb-3">
    <Form.Label>Price</Form.Label>
    <Form.Control type="number" placeholder="0.00" />
  </Form.Group>
  
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
```

### **Tables**
```javascript
import { Table } from 'react-bootstrap';

<Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>Product</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Shirts</td>
      <td>50</td>
      <td>15,000</td>
    </tr>
  </tbody>
</Table>
```

### **Alerts**
```javascript
import { Alert } from 'react-bootstrap';

<Alert variant="success">
  Settings saved successfully!
</Alert>

<Alert variant="danger">
  Error: Failed to save
</Alert>
```

### **Modals**
```javascript
import { Modal, Button } from 'react-bootstrap';

<Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Add Stock</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Form content */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
    <Button variant="primary" onClick={handleClose}>
      Save
    </Button>
  </Modal.Footer>
</Modal>
```

### **Spinners (Loading)**
```javascript
import { Spinner } from 'react-bootstrap';

<Spinner animation="border" role="status">
  <span className="visually-hidden">Loading...</span>
</Spinner>
```

## 🎨 Utility Classes

### **Spacing**
```
m-1, m-2, m-3, m-4, m-5  (margin)
p-1, p-2, p-3, p-4, p-5  (padding)
mb-3, mt-2, ms-4, me-1   (specific sides)
```

### **Display**
```
d-flex, d-grid, d-none
justify-content-center, align-items-center
flex-column, flex-wrap
```

### **Colors**
```
text-primary, text-success, text-danger, text-warning
bg-primary, bg-light, bg-dark
border-primary, border-success
```

### **Sizing**
```
w-100, h-100
fs-1, fs-2, fs-3, fs-4, fs-5, fs-6
fw-bold, fw-normal, fw-light
```

### **Shadows**
```
shadow, shadow-sm, shadow-lg
```

## 📱 Responsive Grid

```javascript
<Row>
  <Col xs={12} sm={6} md={4} lg={3} xl={2}>
    Responsive column
  </Col>
</Row>
```

- **xs**: Extra small (< 576px)
- **sm**: Small (≥ 576px)
- **md**: Medium (≥ 768px)
- **lg**: Large (≥ 992px)
- **xl**: Extra large (≥ 1200px)

## 🎯 Benefits

✅ **Responsive design** - Works on all devices
✅ **Professional look** - Modern UI
✅ **Consistent styling** - Same across app
✅ **Faster development** - Pre-built components
✅ **Mobile-first** - Mobile optimized
✅ **Accessibility** - Built-in ARIA labels
✅ **Dark mode ready** - Easy to customize

## 🚀 Next Steps

1. Install Bootstrap: `npm install bootstrap react-bootstrap`
2. Import in index.js
3. Replace custom components with Bootstrap
4. Test on mobile devices
5. Customize colors/theme if needed

**Your UI will look 10x better!** 🎨
