// src/components/PaymentDetails.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications.action';
import './PaymentDetails.css'; // Import the CSS file for styling

interface PaymentDetails {
    QRImage: string;
    currency: string;
    UPIId: string;
}

const PaymentDetails: React.FC = () => {
    const dispatch = useDispatch();
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
        QRImage: '',
        currency: 'INR',
        UPIId: ''
    });

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch payment details from the API
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get('https://backend-tradex.onrender.com/user/payment-info');
                if (response.data.status) {
                    setPaymentDetails(response.data.data);
                } else {
                    setError('Failed to fetch payment details.');
                }
            } catch (error) {
                setError('Error fetching payment details.');
                console.error('Error fetching payment details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentDetails();
    }, []);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentDetails({
            ...paymentDetails,
            [name]: value,
        });
    };

    // Handle QR Image upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);

            try {
                const response = await axios.post('https://backend-tradex.onrender.com/admin/intro/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.fileUrl) {
                    setPaymentDetails({
                        ...paymentDetails,
                        QRImage: `https://backend-tradex.onrender.com${response.data.fileUrl}`
                    });
                } else {
                    dispatch(addNotification("Failed", `Error uploading QR code image.`));
                }
            } catch (error) {
                dispatch(addNotification("Failed", `Error uploading QR code image.`));
                console.error('Error uploading QR image:', error);
            }
        }
    };

    // Handle save
    const handleSave = async () => {
        try {
            const response = await axios.post('https://backend-tradex.onrender.com/user/payment-info', paymentDetails);
            if (response.status === 200) {
                setIsEditing(false);
                dispatch(addNotification("Success", `Payment details updated successfully.`));
            } else {
                dispatch(addNotification("Failed", `Failed to update payment details.`));
            }
        } catch (error) {
            dispatch(addNotification("Failed", `Failed to update payment details.`));
            console.error('Error saving payment details:', error);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    if (isLoading) {
        return <p className="loading">Loading payment details...</p>;
    }

    return (
        <div className="payment-details-container bg-gradient-primary-green">
            <h2 className="title">Admin Payment Details</h2>
            {error && <p className="error-message">{error}</p>}
            {isEditing ? (
                <form className="payment-form">
                    <div className="form-group">
                        <label>UPI ID:</label>
                        <input
                            type="text"
                            name="UPIId"
                            value={paymentDetails.UPIId}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>QR Code:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                        {paymentDetails.QRImage && (
                            <img src={paymentDetails.QRImage} alt="QR Code" className="qr-image" />
                        )}
                    </div>
                    <div className="form-group">
                        <label>Currency:</label>
                        <input
                            type="text"
                            name="currency"
                            value={paymentDetails.currency}
                            onChange={handleChange}
                            className="form-input"
                            // disabled
                        />
                    </div>
                    <button type="button" onClick={handleSave} className="save-button btn-blue-pay">
                        Save
                    </button>
                    <button type="button" onClick={handleCancel} className="cancel-button btn-red-pay">
                        Cancel
                    </button>
                </form>
            ) : (
                <div className="payment-info">
                    <p><strong>UPI ID:</strong> {paymentDetails.UPIId}</p>
                    <p><strong>QR Code:</strong></p>
                    {paymentDetails.QRImage && (
                        <img src={paymentDetails.QRImage} alt="QR Code" className="qr-image" />
                    )}
                    <p><strong>Currency:</strong> {paymentDetails.currency}</p>
                        <button type="button" onClick={handleEdit} className="edit-button btn-blue-pay">
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentDetails;
