// Appointments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentCard from './AppointmentCard';
import './Appointments.css';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [appointmentData, setAppointmentData] = useState({
        patientName: '',
        doctorName: '',
        date: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleAddOrUpdateAppointment = async (e) => {
        e.preventDefault();
        if (!appointmentData.patientName || !appointmentData.doctorName || !appointmentData.date) {
            alert('All fields are required!');
            return;
        }
        try {
            if (isEditMode) {
                await axios.post(`http://localhost:5000/appointments/update/${selectedAppointmentId}`, appointmentData);
                setAppointments(appointments.map(app => app._id === selectedAppointmentId ? { ...appointmentData, _id: selectedAppointmentId } : app));
            } else {
                const response = await axios.post('http://localhost:5000/appointments/add', appointmentData);
                setAppointments([...appointments, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Error saving appointment:', error);
        }
    };

    const handleEditAppointment = (appointment) => {
        setAppointmentData(appointment);
        setSelectedAppointmentId(appointment._id);
        setIsEditMode(true);
    };

    const handleDeleteAppointment = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/appointments/delete/${id}`);
            setAppointments(appointments.filter(app => app._id !== id));
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    const resetForm = () => {
        setAppointmentData({ patientName: '', doctorName: '', date: '' });
        setIsEditMode(false);
        setSelectedAppointmentId(null);
    };

    return (
        <div className="flex-row">
            <div className="flex-column">
                <div className="add-form">
                    <h4>{isEditMode ? 'Edit Appointment' : 'Add New Appointment'}</h4>
                    <form onSubmit={handleAddOrUpdateAppointment}>
                        <label>Patient Name:</label>
                        <input type="text" value={appointmentData.patientName} onChange={(e) => setAppointmentData({ ...appointmentData, patientName: e.target.value })} />
                        <label>Doctor Name:</label>
                        <input type="text" value={appointmentData.doctorName} onChange={(e) => setAppointmentData({ ...appointmentData, doctorName: e.target.value })} />
                        <label>Date:</label>
                        <input type="date" value={appointmentData.date} onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })} />
                        <button type="submit">{isEditMode ? 'Update Appointment' : 'Add Appointment'}</button>
                    </form>
                </div>
            </div>
            <div className="appointments">
                <h3>Appointments ({appointments.length})</h3>
                <div className="appointment-list">
                    {appointments.map(appointment => (
                        <AppointmentCard key={appointment._id} appointment={appointment} onEdit={handleEditAppointment} onDelete={handleDeleteAppointment} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Appointments;
