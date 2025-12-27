import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AssignmentList.scss';

const AssignmentList = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/assignments');
            setAssignments(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load assignments. Please try again later.');
            console.error('Error fetching assignments:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyClass = (difficulty) => {
        const difficultyLower = difficulty.toLowerCase();
        return `assignment-card__difficulty assignment-card__difficulty--${difficultyLower}`;
    };

    if (loading) {
        return (
            <div className="assignment-list">
                <div className="assignment-list__loading">Loading assignments...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assignment-list">
                <div className="assignment-list__error">{error}</div>
            </div>
        );
    }

    return (
        <div className="assignment-list">
            <h2 className="assignment-list__title">Available Assignments</h2>
            <div className="assignment-list__grid">
                {assignments.map((assignment) => (
                    <div
                        key={assignment._id}
                        className="assignment-card"
                        onClick={() => navigate(`/assignment/${assignment._id}`)}
                    >
                        <div className="assignment-card__header">
                            <h3 className="assignment-card__title">{assignment.title}</h3>
                            <span className={getDifficultyClass(assignment.difficulty)}>
                                {assignment.difficulty}
                            </span>
                        </div>
                        <p className="assignment-card__description">{assignment.description}</p>
                        <div className="assignment-card__footer">
                            <button className="assignment-card__button">Start Assignment</button>
                        </div>
                    </div>
                ))}
            </div>
            {assignments.length === 0 && (
                <div className="assignment-list__empty">
                    No assignments available at the moment.
                </div>
            )}
        </div>
    );
};

export default AssignmentList;

