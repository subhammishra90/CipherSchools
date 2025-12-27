import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import '../styles/AssignmentAttempt.scss';

const AssignmentAttempt = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hintLoading, setHintLoading] = useState(false);
    const [hint, setHint] = useState(null);
    const [activeTab, setActiveTab] = useState('question');

    useEffect(() => {
        fetchAssignment();
    }, [id]);

    const fetchAssignment = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/assignments/${id}`);
            setAssignment(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load assignment. Please try again.');
            console.error('Error fetching assignment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExecute = async () => {
        if (!query.trim()) {
            setError('Please write a query before executing.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setResults(null);

            const response = await axios.post('/api/query/execute', {
                query: query,
                assignmentId: id
            });

            if (response.data.success) {
                setResults(response.data.data);
                setError(null);
            } else {
                setError(response.data.error || 'Query execution failed');
                setResults(null);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to execute query. Please check your syntax.');
            setResults(null);
        } finally {
            setLoading(false);
        }
    };

    const handleGetHint = async () => {
        try {
            setHintLoading(true);
            setHint(null);

            const response = await axios.post('/api/hint', {
                assignmentId: id,
                userQuery: query,
                errorMessage: error
            });

            if (response.data.success) {
                setHint(response.data.hint);
            } else {
                setError('Failed to get hint. Please try again.');
            }
        } catch (err) {
            setError('Failed to get hint. Please try again.');
            console.error('Error getting hint:', err);
        } finally {
            setHintLoading(false);
        }
    };

    if (loading && !assignment) {
        return (
            <div className="assignment-attempt">
                <div className="assignment-attempt__loading">Loading assignment...</div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="assignment-attempt">
                <div className="assignment-attempt__error">Assignment not found.</div>
                <button onClick={() => navigate('/')} className="button button--primary">
                    Back to Assignments
                </button>
            </div>
        );
    }

    return (
        <div className="assignment-attempt">
            <div className="assignment-attempt__header">
                <button
                    onClick={() => navigate('/')}
                    className="button button--secondary"
                >
                    ← Back to Assignments
                </button>
                <h2 className="assignment-attempt__title">{assignment.title}</h2>
                <span className={`assignment-attempt__difficulty assignment-attempt__difficulty--${assignment.difficulty.toLowerCase()}`}>
                    {assignment.difficulty}
                </span>
            </div>

            <div className="assignment-attempt__layout">
                <div className="assignment-attempt__left">
                    <div className="tabs">
                        <button
                            className={`tabs__tab ${activeTab === 'question' ? 'tabs__tab--active' : ''}`}
                            onClick={() => setActiveTab('question')}
                        >
                            Question
                        </button>
                        <button
                            className={`tabs__tab ${activeTab === 'data' ? 'tabs__tab--active' : ''}`}
                            onClick={() => setActiveTab('data')}
                        >
                            Sample Data
                        </button>
                    </div>

                    <div className="panel">
                        {activeTab === 'question' && (
                            <div className="panel__content">
                                <h3 className="panel__title">Question</h3>
                                <p className="panel__text">{assignment.question}</p>
                                <h4 className="panel__subtitle">Requirements:</h4>
                                <ul className="panel__list">
                                    {assignment.requirements.map((req, index) => (
                                        <li key={index} className="panel__list-item">{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="panel__content">
                                <h3 className="panel__title">Sample Data</h3>
                                {assignment.sampleData.tables.map((table, tableIndex) => (
                                    <div key={tableIndex} className="sample-data">
                                        <h4 className="sample-data__table-name">{table.name}</h4>
                                        <div className="sample-data__columns">
                                            <strong>Columns:</strong>
                                            <ul className="sample-data__column-list">
                                                {table.columns.map((col, colIndex) => (
                                                    <li key={colIndex} className="sample-data__column-item">
                                                        <code>{col.name}</code> ({col.type})
                                                        {col.description && ` - ${col.description}`}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {table.sampleRows && table.sampleRows.length > 0 && (
                                            <div className="sample-data__rows">
                                                <strong>Sample Rows:</strong>
                                                <div className="sample-data__table-wrapper">
                                                    <table className="sample-data__table">
                                                        <thead>
                                                            <tr>
                                                                {Object.keys(table.sampleRows[0]).map((key) => (
                                                                    <th key={key}>{key}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {table.sampleRows.map((row, rowIndex) => (
                                                                <tr key={rowIndex}>
                                                                    {Object.values(row).map((value, valIndex) => (
                                                                        <td key={valIndex}>{String(value)}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hint-section">
                        <button
                            onClick={handleGetHint}
                            disabled={hintLoading}
                            className="button button--hint"
                        >
                            {hintLoading ? 'Getting Hint...' : 'Get Hint'}
                        </button>
                        {hint && (
                            <div className="hint-section__content">
                                <h4 className="hint-section__title">Hint:</h4>
                                <p className="hint-section__text">{hint}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="assignment-attempt__right">
                    <div className="editor-section">
                        <div className="editor-section__header">
                            <h3 className="editor-section__title">SQL Editor</h3>
                            <button
                                onClick={handleExecute}
                                disabled={loading}
                                className="button button--primary button--execute"
                            >
                                {loading ? 'Executing...' : 'Execute Query'}
                            </button>
                        </div>
                        <div className="editor-section__editor">
                            <Editor
                                height="400px"
                                defaultLanguage="sql"
                                value={query}
                                onChange={(value) => setQuery(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    </div>

                    <div className="results-section">
                        <h3 className="results-section__title">Results</h3>
                        {error && (
                            <div className="results-section__error">{error}</div>
                        )}
                        {results && (
                            <div className="results-section__content">
                                <div className="results-section__info">
                                    Rows returned: {results.rowCount}
                                </div>
                                <div className="results-section__table-wrapper">
                                    <table className="results-table">
                                        <thead>
                                            <tr>
                                                {results.columns.map((col) => (
                                                    <th key={col.name}>{col.name}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.rows.map((row, index) => (
                                                <tr key={index}>
                                                    {results.columns.map((col) => (
                                                        <td key={col.name}>{row[col.name]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {!results && !error && (
                            <div className="results-section__empty">
                                Execute a query to see results here.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentAttempt;

