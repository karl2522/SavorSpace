import React, { memo, forwardRef, useState, useEffect} from 'react';
import { IoCloudUploadOutline, IoClose, IoChevronBack, IoChevronForward, IoCheckmark } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/CreateRecipeModal.css';

const CreateRecipeModal = memo(forwardRef(({ 
    show, 
    onClose,
    onSubmit 
}, ref) => {

    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && show) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [show, onClose]);

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            onClose();
        }
    };


    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        image: null
    });
    const [step, setStep] = useState(0);
    const [preview, setPreview] = useState(null);

    const steps = ['Basic Info', 'Ingredients', 'Instructions', 'Image'];

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            ingredients: '',
            instructions: '',
            image: null
        });
        setStep(0);
        setPreview(null);
    };

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
        resetForm();
        onClose();
    };

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="modal-step"
                    >
                        <input
                            type="text"
                            placeholder="Recipe Title"
                            value={formData.title}
                            onChange={handleChange('title')}
                            className="modal-input"
                        />
                        <textarea
                            placeholder="Recipe Description"
                            value={formData.description}
                            onChange={handleChange('description')}
                            className="modal-textarea"
                        />
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="modal-step"
                    >
                        <textarea
                            placeholder="Enter ingredients (one per line)"
                            value={formData.ingredients}
                            onChange={handleChange('ingredients')}
                            className="modal-textarea"
                        />
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="modal-step"
                    >
                        <textarea
                            placeholder="Enter cooking instructions"
                            value={formData.instructions}
                            onChange={handleChange('instructions')}
                            className="modal-textarea"
                        />
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="modal-step"
                    >
                        <div className="image-upload-container">
                            <label className="image-upload-label">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="image-preview"
                                    />
                                ) : (
                                    <>
                                        <IoCloudUploadOutline size={48} />
                                        <span>Upload Image</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden-input"
                                />
                            </label>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal-backdrop"
                    onClick={(e) => {
                        if(e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        ref={ref}
                    >
                        <button className="modal-close" onClick={onClose}>
                            <IoClose />
                        </button>
                        <div className="modal-header">
                            <h2>Create New Recipe</h2>
                            <div className="step-indicators">
                                {steps.map((stepName, index) => (
                                    <div
                                        key={stepName}
                                        className={`step-indicator ${index === step ? 'active' : ''} 
                                                  ${index < step ? 'completed' : ''}`}
                                        onClick={() => setStep(index)}
                                    >
                                        {index < step ? <IoCheckmark /> : index + 1}
                                        <span className="step-name">{stepName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {renderStepContent()}
                            <div className="modal-actions">
                                {step > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(prev => prev - 1)}
                                        className="btn-secondary"
                                    >
                                        <IoChevronBack /> Previous
                                    </button>
                                )}
                                {step < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(prev => prev + 1)}
                                        className="btn-primary"
                                    >
                                        Next <IoChevronForward />
                                    </button>
                                ) : (
                                    <button type="submit" className="btn-submit">
                                        Create Recipe <IoCheckmark />
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}));

CreateRecipeModal.displayName = 'CreateRecipeModal';

export default CreateRecipeModal;

