import React, { useState } from 'react';
import Menu from '../components/Menu';
import './BecomeModel.css';
import "../components/Footer.css";

const BecomeModel = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        age: '',
        city: '',
        phone: '',
        height: '',
        bust: '',
        waist: '',
        hips: '',
        shoe: '',
        eyes: '',
        hair: '',
        socialLink: '',
        message: '',
        photos: [] 
    });

    const [error, setError] = useState(''); 

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const allowed = value.replace(/[^\d()+]/g, "");

            const plusCount = (allowed.match(/\+/g) || []).length;
            const openParenCount = (allowed.match(/\(/g) || []).length;
            const closeParenCount = (allowed.match(/\)/g) || []).length;

            if (plusCount > 1 || openParenCount > 1 || closeParenCount > 1) {
                setError("The symbols '+', '(', ')' can only be used once each.");
                return;
            }

            const digitCount = allowed.replace(/\D/g, "").length;
            if (digitCount > 15) {
                setError("The phone number must contain no more than 15 digits.");
                return;
            }

            setFormData({ ...formData, [name]: allowed });
            setError('');
            return;
        }

        if (name === 'socialLink') {
            setFormData({ ...formData, [name]: value });
            setError('');
            return;
        }

        if ((name === "eyes" || name === "hair") && /\d/.test(value)) {
            setError(`${name} cannot contain numbers.`);
            return;
        }

        const latinRegex = /^[a-zA-Z0-9\s.,'-]*$/;
        if (!latinRegex.test(value)) {
            setError(`Only Latin characters are allowed in the field "${name}".`);
            return;
        }

        const numericFields = ['age', 'height', 'bust', 'waist', 'hips', 'shoe'];
        if (numericFields.includes(name) && value < 0) {
            setError(`${name} cannot be negative.`);
            return;
        }

        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handlePhotoChange = (e) => {
        const selectedFiles = Array.from(e.target.files); 
        if (formData.photos.length + selectedFiles.length <= 4) {
            setFormData((prevData) => ({
                ...prevData,
                photos: [...prevData.photos, ...selectedFiles]
            }));
            // setError(''); 
        } else {
            setError('You can upload a maximum of 4 photos.');
        }
    };

    const handleRemovePhoto = (fileName) => {
        const updatedPhotos = formData.photos.filter((photo) => photo.name !== fileName);
        setFormData({ ...formData, photos: updatedPhotos });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.photos.length !== 4) {
            setError('You must upload exactly 4 photos before submitting.');
            return;
        }

        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key !== 'photos') {
                formDataToSend.append(key, formData[key]);
            }
        });

        formData.photos.forEach((photo) => {
            formDataToSend.append('photos', photo);
        });

        try {
            const response = await fetch('http://localhost:5000/api/models', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                alert('Form data and photos saved successfully!');
                setFormData({
                    name: '',
                    surname: '',
                    age: '',
                    city: '',
                    phone: '',
                    height: '',
                    bust: '',
                    waist: '',
                    hips: '',
                    shoe: '',
                    eyes: '',
                    hair: '',
                    socialLink: '',
                    message: '',
                    photos: [] 
                });
                setError(''); 
            } else {
                alert('Error saving form data and photos.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="become-model">
            <Menu />
            <header className="become-header">
                <h1>Become a Model</h1>
            </header>
            <section className="become-content">
                <h2>Please, fill out the form</h2>
                <form onSubmit={handleSubmit} className="model-form">
                    <div className="main-information">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label>Surname</label>
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            required
                        />
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="18"
                            required
                        />
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                        <label>Phone number (with country code)</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <label>Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            min="170"
                            required
                        />
                        <label>Bust (cm)</label>
                        <input
                            type="number"
                            name="bust"
                            value={formData.bust}
                            onChange={handleChange}
                            min="70"
                            required
                        />
                        <label>Waist (cm)</label>
                        <input
                            type="number"
                            name="waist"
                            value={formData.waist}
                            onChange={handleChange}
                            min="50"
                            required
                        />
                        <label>Hips (cm)</label>
                        <input
                            type="number"
                            name="hips"
                            value={formData.hips}
                            onChange={handleChange}
                            min="70"
                            required
                        />
                        <label>Shoe (EU)</label>
                        <input
                            type="number"
                            name="shoe"
                            value={formData.shoe}
                            onChange={handleChange}
                            min="37"
                            required
                        />
                        <label>Eyes</label>
                        <input
                            type="text"
                            name="eyes"
                            value={formData.eyes}
                            onChange={handleChange}
                            required
                        />
                        <label>Hair</label>
                        <input
                            type="text"
                            name="hair"
                            value={formData.hair}
                            onChange={handleChange}
                            required
                        />
                        <label>Social network page link</label>
                        <input
                            type="url"
                            name="socialLink"
                            value={formData.socialLink}
                            onChange={handleChange}
                            required
                        />
                        <label>Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Add any additional information"
                        />
                    </div>
                    <div className="foto-inf">
                        
                        <label>Add photos</label>
                        <p>
                            Absolutely fine if you don't have professional snapshots.
                            Take a look at our example and make a few similar snaps
                            (without make-up and in good lighting). Please upload 4 photos in PNG, JPEG, or JPG format.
                        </p>
                        <img
                            src="/images/example.jpg"
                            alt="Example"
                            style={{ display: 'block', margin: '10px 0', width: '100%', maxWidth: '400px' }}
                        />
                        <input
                            type="file"
                            name="photos"
                            accept=".png, .jpeg, .jpg"
                            multiple
                            onChange={handlePhotoChange}
                        />
                        <p>
                        {formData.photos.length > 0
                            ? 'Selected photos: '
                            : 'No photos selected'}
                        {formData.photos.map((photo, index) => (
                            <span key={photo.name}>
                                {photo.name}
                                {index === formData.photos.length - 1 ? '.' : ', '}
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(photo.name)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'red',
                                        cursor: 'pointer',
                                        marginLeft: '5px'
                                    }}
                                >
                                    X
                                </button>
                            </span>
                        ))}
                    </p> 
                    {error && <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>{error}</p>}
                    <button type="submit" className="send-button">Send</button>
                    </div>
                </form>
            </section>
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default BecomeModel;
