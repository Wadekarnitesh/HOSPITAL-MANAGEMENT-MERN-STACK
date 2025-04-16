// Doctors.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorCard from './DoctorCard';
import './Doctor.css';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [doctorData, setDoctorData] = useState({
        name: '',
        specialty: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:5000/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleAddOrUpdateDoctor = async (e) => {
        e.preventDefault();
        if (!doctorData.name || !doctorData.specialty) {
            alert('All fields are required!');
            return;
        }
        try {
            if (isEditMode) {
                await axios.post(`http://localhost:5000/doctors/update/${selectedDoctorId}`, doctorData);
                setDoctors(doctors.map(doc => doc._id === selectedDoctorId ? { ...doctorData, _id: selectedDoctorId } : doc));
            } else {
                const response = await axios.post('http://localhost:5000/doctors/add', doctorData);
                setDoctors([...doctors, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Error saving doctor:', error);
        }
    };

    const handleEditDoctor = (doctor) => {
        setDoctorData(doctor);
        setSelectedDoctorId(doctor._id);
        setIsEditMode(true);
    };

    const handleDeleteDoctor = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/doctors/delete/${id}`);
            setDoctors(doctors.filter(doc => doc._id !== id));
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    const resetForm = () => {
        setDoctorData({ name: '', specialty: '' });
        setIsEditMode(false);
        setSelectedDoctorId(null);
    };

    return (
        <div className='main-doc-container'>
            <div className='form-sections'>
                <h4>{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</h4>
                <form onSubmit={handleAddOrUpdateDoctor}>
                    <label>Name:</label>
                    <input type='text' value={doctorData.name} onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })} />
                    <label>Specialty:</label>
                    <input type='text' value={doctorData.specialty} onChange={(e) => setDoctorData({ ...doctorData, specialty: e.target.value })} />
                    <button type='submit'>{isEditMode ? 'Update Doctor' : 'Add Doctor'}</button>
                </form>
            </div>
            <div className='doctors-section'>
                <h3>Doctors ({doctors.length})</h3>
                <div className='doctor-list'>
                    {doctors.map(doctor => (
                        <DoctorCard key={doctor._id} doctor={doctor} onEdit={handleEditDoctor} onDelete={handleDeleteDoctor} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
