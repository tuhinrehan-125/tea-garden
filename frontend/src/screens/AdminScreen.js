import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchPacket } from '../actions/packetActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const AdminScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [packetNumber, setPacketNumber] = useState('');

    const packetSearch = useSelector(state => state.packetSearch);
    const { loading, error, packetInfo } = packetSearch;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo || !userInfo.data.isAdmin) {
            navigate('/login'); // Redirect if not admin
        }
    }, [navigate, userInfo]);

    const searchHandler = () => {
        dispatch(searchPacket(packetNumber)); // Dispatch search action
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <main className="col-md-12 col-lg-12 px-md-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">Dashboard</h1>
                    </div>
                    
                    <h2>Search Packet by Number</h2>
                    <div className="form-group">
                        <label>Packet Number</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={packetNumber} 
                            onChange={(e) => setPacketNumber(e.target.value)} 
                        />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={searchHandler}>
                        Search
                    </button>

                    {/* Display loading, error, or packet info */}
                    {loading && <Loader />}
                    {error && <Message variant="danger">{error}</Message>}
                    {packetInfo && (
                        <div className="mt-4">
                            <div className="card">
                                <div className="card-header bg-primary text-white">
                                    <h3>Packet Information</h3>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped">
                                        <tbody>
                                            <tr>
                                                <td><strong>Packet Number:</strong></td>
                                                <td>{packetInfo.packet_number}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Packet Name:</strong></td>
                                                <td>{packetInfo.packet_name}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Weight:</strong></td>
                                                <td>{packetInfo.packet_weight} kg</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Price:</strong></td>
                                                <td>{packetInfo.packet_price} USD</td>
                                            </tr>
                                            {packetInfo.powder && (
                                                <>
                                                    <tr>
                                                        <td><strong>Powder:</strong></td>
                                                        <td>{packetInfo.powder.powder_number} - {packetInfo.powder.powder_name}</td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>

                                    {packetInfo.powder && (
                                        <>
                                            <h4>Sacks Used for Powder</h4>
                                            <div className="row">
                                                {packetInfo.powder.sacks.map((sack, index) => (
                                                    <div key={index} className="col-md-6 mb-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <h5 className="card-title">Sack #{index + 1}</h5>
                                                                <table className="table table-bordered">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td><strong>Sack Number:</strong></td>
                                                                            <td>{sack.sack_number}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Sack Name:</strong></td>
                                                                            <td>{sack.sack_name}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Weight:</strong></td>
                                                                            <td>{sack.sack_weight} kg</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Invoice Number:</strong></td>
                                                                            <td>{sack.invoice.invoice_number}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><strong>Place Name:</strong></td>
                                                                            <td>{sack.invoice.place_name}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminScreen;
