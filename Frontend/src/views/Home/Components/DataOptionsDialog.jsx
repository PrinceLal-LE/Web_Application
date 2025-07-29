import React, { useState } from 'react';
import { Modal, Button, Spinner, Alert, Form } from 'react-bootstrap';

const DataOptionsDialog = ({ show, onHide, data, loading, error }) => {
    const [selectedOptions, setSelectedOptions] = useState([]); // This line is crucial for defining selectedOptions
    const handleCheckboxChange = (event) => {
        const optionId = event.target.value;
        if (event.target.checked) {
            setSelectedOptions((prev) => [...prev, optionId]);
        } else {
            setSelectedOptions((prev) => prev.filter((id) => id !== optionId));
        }
    };
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>  
                <Modal.Title>Select Data Option</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p>Loading data...</p>
                    </div>
                )}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && !error && data.length === 0 && (
                    <p>No data available. Please add some data on the backend.</p>
                )}
                {!loading && !error && data.length > 0 && (
                    <div>
                        <Form>
                        <h5>Available Options:</h5>
                        {data.map((item) => (
                            <Form.Check
                                key={item.id}
                                type="checkbox"
                                id={`checkbox-${item.id}`}
                                label={item.name}
                                value={item.id}
                                checked={selectedOptions.includes(item.id)}
                                onChange={handleCheckboxChange}
                                className="mb-2"
                            />
                        ))}
                        </Form>
                        {/* You can add more interactive elements here, e.g., buttons to select data */}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DataOptionsDialog;