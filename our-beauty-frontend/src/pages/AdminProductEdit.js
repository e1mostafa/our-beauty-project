import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

const AdminProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [product, setProduct] = useState({ name: '', price: '', description: '', imageUrl: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const isNew = !id;

    useEffect(() => {
        if (!isNew) {
            setLoading(true);
            fetch(`${API_URL}/api/products/${id}`)
                .then(res => res.json())
                .then(data => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch(err => {
                    toast.error("Failed to load product data.");
                    setLoading(false);
                });
        }
    }, [id, isNew]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    // MODIFIED: This function now handles everything in one step.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let imageUrl = product.imageUrl;

        // Step 1: If a new file is selected, upload it first.
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const uploadResponse = await fetch(`${API_URL}/api/fileupload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    // Try to get more detailed error from backend
                    const errorData = await uploadResponse.text();
                    throw new Error(errorData || 'Image upload failed');
                }

                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.filePath; // Get the new image path
                toast.success("Image uploaded successfully!");

            } catch (error) {
                toast.error(`Image Upload Error: ${error.message}`);
                setLoading(false);
                return; // Stop if image upload fails
            }
        }

        // If creating a new product, an image is required.
        if (isNew && !imageUrl) {
            toast.error("Please select and upload an image for the new product.");
            setLoading(false);
            return;
        }

        // Step 2: Prepare product data with the correct image URL.
        const productData = { ...product, imageUrl: imageUrl, price: parseFloat(product.price) };
        const url = isNew ? `${API_URL}/api/products` : `${API_URL}/api/products/${id}`;
        const method = isNew ? 'POST' : 'PUT';

        // Step 3: Save the product data (name, price, etc.).
        try {
            const productResponse = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            if (!productResponse.ok) throw new Error('Failed to save product');

            toast.success(`Product ${isNew ? 'created' : 'updated'} successfully!`);
            navigate('/admin/products');

        } catch (error) {
            toast.error('Error saving product.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isNew) return <CircularProgress />;

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {isNew ? 'Add Product' : 'Edit Product'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth margin="normal" label="Product Name" name="name" value={product.name} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Price" name="price" type="number" value={product.price} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Description" name="description" multiline rows={4} value={product.description} onChange={handleChange} required />

                <Box sx={{ my: 2, border: '1px dashed grey', p: 2, textAlign: 'center' }}>
                    <Typography>Product Image</Typography>
                    <Button variant="contained" component="label" sx={{ my: 1 }}>
                        Choose File
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    {selectedFile && (
                        <Typography variant="body2" sx={{ mt: 1 }}>Selected: {selectedFile.name}</Typography>
                    )}

                    {product.imageUrl && !selectedFile && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">Current Image:</Typography>
                            <img src={`${API_URL}${product.imageUrl}`} alt="Product" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        </Box>
                    )}
                </Box>

                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
                    {loading ? 'Saving...' : 'Save Product'}
                </Button>
            </Box>
        </Container>
    );
};

export default AdminProductEdit;
