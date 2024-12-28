import React, { useState, useEffect } from "react";
import {
    getClients,
    getVoitures,
    addClient,
    addVoiture,
    getVoituresByClientId,
    deleteClient,
    deleteVoiture,
    updateClient,
    updateVoiture
} from "../services/apiService";
import { Modal, Button, Form, Card, Container } from "react-bootstrap";

function Dashboard() {
    const [clients, setClients] = useState([]);
    const [voitures, setVoitures] = useState([]);
    const [filteredVoitures, setFilteredVoitures] = useState([]);
    const [searchClientName, setSearchClientName] = useState("");

    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedVoitureId, setSelectedVoitureId] = useState(null);

    const [showClientModal, setShowClientModal] = useState(false);
    const [showVoitureModal, setShowVoitureModal] = useState(false);

    const [newClient, setNewClient] = useState({ nom: "", age: "" });
    const [newVoiture, setNewVoiture] = useState({
        marque: "",
        matricule: "",
        model: "",
    });

    const [isEditingClient, setIsEditingClient] = useState(false);
    const [isEditingVoiture, setIsEditingVoiture] = useState(false);

    useEffect(() => {
        fetchClients();
        fetchVoitures();
    }, []);

    const fetchClients = async () => {
        const response = await getClients();
        setClients(response.data);
    };

    const fetchVoitures = async () => {
        const response = await getVoitures();
        setVoitures(response.data);
    };

    const handleAddOrUpdateClient = async () => {
        if (isEditingClient) {
            await updateClient(selectedClientId, newClient);
        } else {
            await addClient(newClient);
        }
        setNewClient({ nom: "", age: "" });
        fetchClients();
        setShowClientModal(false);
        setIsEditingClient(false);
    };

    const handleAddOrUpdateVoiture = async () => {
        if (isEditingVoiture) {
            await updateVoiture(selectedVoitureId, newVoiture);
        } else {
            await addVoiture(selectedClientId, newVoiture);
        }
        setNewVoiture({ marque: "", matricule: "", model: "" });
        fetchVoitures();
        setShowVoitureModal(false);
        setIsEditingVoiture(false);
    };

    const handleSearchVoituresByClientName = () => {
        const client = clients.find((c) =>
            c.nom.toLowerCase().includes(searchClientName.toLowerCase())
        );
        if (client) {
            setSelectedClientId(client.id);
            handleSearchVoituresByClient(client.id);
        } else {
            setFilteredVoitures([]);
        }
    };

    const handleSearchVoituresByClient = async (clientId) => {
        const response = await getVoituresByClientId(clientId);
        setFilteredVoitures(response.data);
    };

    const handleDeleteClient = async (id) => {
        await deleteClient(id);
        fetchClients();
    };

    const handleDeleteVoiture = async (id) => {
        await deleteVoiture(id);
        fetchVoitures();
    };

    const openEditClientModal = (client) => {
        setNewClient({ nom: client.nom, age: client.age });
        setSelectedClientId(client.id);
        setIsEditingClient(true);
        setShowClientModal(true);
    };

    const openEditVoitureModal = (voiture) => {
        setNewVoiture({
            marque: voiture.marque,
            matricule: voiture.matricule,
            model: voiture.model,
        });
        setSelectedVoitureId(voiture.id);
        setIsEditingVoiture(true);
        setShowVoitureModal(true);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center" style={{ color: "#d63384" }}>Dashboard</h1>

            {/* Clients Section */}
            <Card className="mb-4" style={{ backgroundColor: "#fde2e4" }}>
                <Card.Header style={{ backgroundColor: "#f4978e" }}>
                    <h4 className="text-white">Clients</h4>
                </Card.Header>
                <Card.Body>
                    <Button
                        variant="primary"
                        className="mb-3"
                        onClick={() => {
                            setShowClientModal(true);
                            setIsEditingClient(false);
                            setNewClient({ nom: "", age: "" });
                        }}
                        style={{ backgroundColor: "#f28482" }}
                    >
                        Add Client
                    </Button>
                    {clients.map((client) => (
                        <Card key={client.id} className="mb-3" style={{ backgroundColor: "#ffe5ec" }}>
                            <Card.Body>
                                <h5>{client.nom}</h5>
                                <p>Age: {client.age}</p>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openEditClientModal(client)}
                                    style={{ backgroundColor: "#f8ad9d" }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteClient(client.id)}
                                    style={{ backgroundColor: "#f4978e" }}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                </Card.Body>
            </Card>

            {/* Voitures Section */}
            <Card className="mb-4" style={{ backgroundColor: "#fbe7c6" }}>
                <Card.Header style={{ backgroundColor: "#ffb5a7" }}>
                    <h4 className="text-white">Voitures</h4>
                </Card.Header>
                <Card.Body>
                    <Button
                        variant="success"
                        className="mb-3"
                        onClick={() => {
                            setShowVoitureModal(true);
                            setIsEditingVoiture(false);
                            setNewVoiture({ marque: "", matricule: "", model: "" });
                        }}
                        style={{ backgroundColor: "#ffb4a2" }}
                    >
                        Add Voiture
                    </Button>
                    {voitures.map((voiture) => (
                        <Card key={voiture.id} className="mb-3" style={{ backgroundColor: "#ffe5ec" }}>
                            <Card.Body>
                                <h5>{voiture.marque}</h5>
                                <p>Model: {voiture.model}</p>
                                <p>Matricule: {voiture.matricule}</p>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openEditVoitureModal(voiture)}
                                    style={{ backgroundColor: "#f8ad9d" }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteVoiture(voiture.id)}
                                    style={{ backgroundColor: "#f4978e" }}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                </Card.Body>
            </Card>

            {/* Search Section */}
            <Card className="mb-4" style={{ backgroundColor: "#e4bad4" }}>
                <Card.Header style={{ backgroundColor: "#c08497" }}>
                    <h4 className="text-white">Search Voitures by Client Name</h4>
                </Card.Header>
                <Card.Body>
                    <Form.Control
                        type="text"
                        placeholder="Enter client name"
                        value={searchClientName}
                        onChange={(e) => setSearchClientName(e.target.value)}
                        className="mb-3"
                    />
                    <Button
                        variant="info"
                        onClick={handleSearchVoituresByClientName}
                        className="mb-3"
                        style={{ backgroundColor: "#c08497" }}
                    >
                        Search
                    </Button>
                    <ul>
                        {filteredVoitures.map((voiture) => (
                            <li key={voiture.id}>
                                {voiture.marque} - {voiture.model} ({voiture.matricule})
                            </li>
                        ))}
                    </ul>
                </Card.Body>
            </Card>

            {/* Client Modal */}
            <Modal show={showClientModal} onHide={() => setShowClientModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingClient ? "Edit Client" : "Add Client"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={newClient.nom}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, nom: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter age"
                                value={newClient.age}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, age: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowClientModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddOrUpdateClient}>
                        {isEditingClient ? "Save Changes" : "Add Client"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Voiture Modal */}
            <Modal show={showVoitureModal} onHide={() => setShowVoitureModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingVoiture ? "Edit Voiture" : "Add Voiture"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Marque</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter marque"
                                value={newVoiture.marque}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, marque: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Matricule</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter matricule"
                                value={newVoiture.matricule}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, matricule: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Model</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter model"
                                value={newVoiture.model}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, model: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Select Client</Form.Label>
                            <Form.Select
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                value={selectedClientId}
                            >
                                <option value="">Select Client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.nom}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowVoitureModal(false)}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleAddOrUpdateVoiture}>
                        {isEditingVoiture ? "Save Changes" : "Add Voiture"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Dashboard;
