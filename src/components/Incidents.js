import React, { useState, useEffect, useMemo } from 'react'
import NavBar from './NavBar'
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { useSelector, useDispatch } from 'react-redux';
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";
import { getAllIncidents, fetchIncidents, addIncident, isLoading, editIncident, deleteIncident } from '../features/incidents/incidentSlice';
import { getAllTypes, fetchTypes } from '../features/incidentType/incidentTypeSlice';
import { getAllViolations, fetchViolations } from '../features/violations/violationSlice';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Incidents = () => {

    const types = useSelector(getAllTypes)

    const violations = useSelector(getAllViolations)

    const [incidentDelete, setIncidentDelete] = useState({})

    const [deleteShow, setDeleteShow] = useState(false);

    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = () => setDeleteShow(true);

    function handleIncidentDelete(incident) {
        handleDeleteShow()
        setIncidentDelete(incident)
    }

    const handleDeleteBtn = (id) => {
        dispatch(deleteIncident(id))
    }

    const [incidentEdit, setIncidentEdit] = useState({})

    const [editShow, setEditShow] = useState(false);

    const handleEditClose = () => setEditShow(false);
    const handleEditShow = () => setEditShow(true);

    function handleIncidentEdit(incident) {
        handleEditShow()
        setIncidentEdit(incident)
    }

    const handleEditSubmitIncident = (e, id) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('id', id)
        dispatch(editIncident(formData))
    }

    const COLUMNS = [
        {
            Header: 'ID',
            Footer: 'ID',
            accessor: 'id',
            disableFilters: true
        },
        {
            Header: 'Vehicle:',
            Footer: 'Vehicle',
            accessor: 'vehicle',
        },
        {
            Header: 'Driver:',
            Footer: 'Driver',
            accessor: 'driver',
        },
        {
            Header: 'Incident:',
            Footer: 'Incident',
            accessor: 'incident',
            Cell: ({value}) => {return types.filter(type => type.id === value).map(type => (type.name))}
        },
        {
            Header: 'Description:',
            Footer: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Violation:',
            Footer: 'Violation',
            accessor: 'violation',
            Cell: ({value}) => {return violations.filter(violation => violation.id === value).map(violation => (violation.name))}
        },
        {
            Header: 'Incident Date:',
            Footer: 'Incident Date',
            accessor: 'incidentDate',
        },
        {
            Header: 'Location:',
            Footer: 'Location',
            accessor: 'location',
        }, 
        {
            Header: 'Action:',
            Footer: 'Action',
            accessor: 'incidentAction',
        },
        {
            Header: "Edit/Delete",
            accessor: "edit/delete",
            Cell: ({row}) => (
              <div>
                <i style={{cursor: 'pointer'}} onClick={() => handleIncidentEdit(row.original)}><MdEdit /></i> | 
                {' '}<i style={{cursor: 'pointer'}} onClick={() => handleIncidentDelete(row.original)}><MdDelete /></i>
              </div>
            ),
            disableFilters: true
        }
    ]

    const [alertShow, setAlertShow] = useState(false);

    const incidents = useSelector(getAllIncidents)

    const lding = useSelector(isLoading)

    const [errmsg, seterrmsg] = useState('')

    const dispatch = useDispatch()

   function handleSubmitAddIncident (e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    dispatch(addIncident(formData))
   }

   function handleCloseAlert() {
        setAlertShow(false)
        seterrmsg('')
   }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => incidents, [incidents])
    const defaultColumn = useMemo(() => {
        return {Filter: ColumnFilter}
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
        state,
        setGlobalFilter,
        allColumns,
      } = useTable({
        columns: columns,
        data: data,
        defaultColumn: defaultColumn
    }, useFilters, useGlobalFilter, useSortBy, usePagination)

    const { globalFilter, pageIndex, pageSize } = state

    useEffect(() => {
        dispatch(fetchIncidents())
        dispatch(fetchTypes())
        dispatch(fetchViolations())
        console.log("fetching incidents ...")
    }, [dispatch])

  return (
    <div>
        <NavBar />
        <Container>
            <Row>
                <Col>
                    <Button as={Link} to='/incidents/manage' style={{marginTop: '10px'}} variant="secondary">Manage</Button>{' '}
                    <Button style={{marginTop: '10px'}} variant="secondary" onClick={handleShow}>Add</Button>
                </Col>
                <Col style={{marginTop: '20px'}}>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </Col>
                <Col>
                    <div className="float-end">
                        <DropdownButton
                            id="dropdown-button-dark-example2"
                            variant="secondary"
                            menuVariant="dark"
                            title="Column Slice"
                            className="mt-2"
                        >
                            {
                                allColumns.map(column => (
                                    <div key={column.id}>
                                        <label>
                                            <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
                                            {column.Header}
                                        </label>
                                    </div>
                                ))
                            }
                        </DropdownButton>
                    </div>
                </Col>
            </Row>

            
            <Table {...getTableProps()} style={{marginTop: '10px'}} striped bordered hover size="sm" responsive>
                <thead>
                    {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                        <th
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                        >
                            {column.render('Header')}
                            <span>{column.isSorted?(column.isSortedDesc? <FaArrowUp /> : <FaArrowDown />):''}</span>
                            <div>{column.canFilter ? column.render('Filter'):null}</div>
                        </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return (
                            <td
                                {...cell.getCellProps()}
                            >
                                {cell.render('Cell')}

                                {console.log()}

                            </td>
                            )
                        })}
                        </tr>
                    )
                    })}
                </tbody>
                <tfoot>
                    {footerGroups.map(footerGroup => (
                    <tr {...footerGroup.getFooterGroupProps()}>
                        {footerGroup.headers.map(column => (
                        <th
                            {...column.getFooterProps()}
                        >
                            {column.render('Footer')}
                        </th>
                        ))}
                    </tr>
                    ))}
                </tfoot>
            </Table>
            <div>
                <Row>
                    <Col>
                        <div>
                            <strong>
                            Page: {' '}
                                    {pageIndex + 1} of {pageOptions.length}
                            </strong>{' '}
                        </div> 
                    </Col>
                    <Col>
                        <div>
                            <strong>Go to page:</strong> {' '}
                            <input type="number" defaultValue={pageIndex + 1} 
                            onChange={e => {
                                const pageNumber = e.target.value ? Number(e.target.value) - 1: 0
                                gotoPage(pageNumber)
                            }}
                            style={{width: '50px', border: '1px solid grey', borderRadius: '5px',
                            outline: '0', backgroundColor: '#f5f5f5'}} />
                        </div>
                    </Col>
                    <Col>
                        <select
                            style={{width: '100px', border: '1px solid grey', borderRadius: '5px',
                            outline: '0', backgroundColor: '#f5f5f5'}}
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            {
                                [10, 25, 50, 100].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))
                            }
                        </select>
                    </Col>
                    <Col>
                            <div className="float-end">
                                <button style={{border: '1px solid grey', borderRadius: '5px', 
                                outline: '0', backgroundColor: '#f5f5f5'}} 
                                onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
                                <button style={{border: '1px solid grey', borderRadius: '5px', 
                                outline: '0', backgroundColor: '#f5f5f5'}} 
                                onClick={() => previousPage()} disabled={!canPreviousPage}>Prev</button>
                                <button style={{border: '1px solid grey', borderRadius: '5px', 
                                outline: '0', backgroundColor: '#f5f5f5'}} 
                                onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                                <button style={{border: '1px solid grey', borderRadius: '5px', 
                                outline: '0', backgroundColor: '#f5f5f5'}} 
                                onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
                            </div>
                    </Col>
                </Row>
            </div>
        </Container>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add Incident</Modal.Title>
            </Modal.Header>
            {lding ? <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    </Col>
                </Row>
            </Container> : ''}

            {alertShow && errmsg?
                <Container>
                    <div>
                        <Alert style={{height: '50px', marginTop: '4px'}} variant="danger" onClose={handleCloseAlert} dismissible>
                            <p><strong>{errmsg}</strong></p>
                        </Alert>
                    </div>
                </Container>: ''
            }
            


            <Form onSubmit={handleSubmitAddIncident}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Vehicle: </strong></Form.Label>
                        <Form.Control type="text" name="vehicle" placeholder="Enter vehicle" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Driver: </strong></Form.Label>
                        <Form.Control type="text" name="driver" placeholder="Enter driver" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Incident: </strong></Form.Label>
                        <Form.Select name="incident" required>
                            <option>Select Incident</option>
                            {types.map(type => (
                                <option value={type.id}>{type.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label><strong>Description: </strong></Form.Label>
                        <Form.Control as="textarea" name="description" rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicJob">
                        <Form.Label><strong>Action: </strong></Form.Label>
                        <Form.Control type="text" name="incidentAction" placeholder="Enter action" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicJob">
                        <Form.Label><strong>Location: </strong></Form.Label>
                        <Form.Control type="text" name="location" placeholder="Enter location" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicRole">
                        <Form.Label><strong>Violation: </strong></Form.Label>
                        <Form.Select name="violation" required>
                            <option>Select Violation</option>
                            {violations.map(violation => (
                                <option value={violation.id}>{violation.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label><strong>Incident Date: </strong></Form.Label>
                        <Form.Control type="date" name="incidentDate" required />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button type='submit' variant="primary">
                    Save
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>

        <Modal show={editShow} onHide={handleEditClose}>
            <Modal.Header closeButton>
            <Modal.Title>Edit Incident</Modal.Title>
            </Modal.Header>
            {lding ? <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    </Col>
                </Row>
            </Container> : ''}

            {alertShow && errmsg?
                <Container>
                    <div>
                        <Alert style={{height: '50px', marginTop: '4px'}} variant="danger" onClose={handleCloseAlert} dismissible>
                            <p><strong>{errmsg}</strong></p>
                        </Alert>
                    </div>
                </Container>: ''
            }
            


            <Form onSubmit={(e) => handleEditSubmitIncident(e, incidentEdit.id)}>
                <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Vehicle: </strong></Form.Label>
                        <Form.Control type="text" name="vehicle" defaultValue={incidentEdit.vehicle} placeholder="Enter vehicle" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Driver: </strong></Form.Label>
                        <Form.Control type="text" name="driver" defaultValue={incidentEdit.driver} placeholder="Enter driver" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Incident: </strong></Form.Label>
                        <Form.Select name="incident" defaultValue={incidentEdit.incident} required>
                            <option>Select Incident</option>
                            {types.map(type => (
                                <option value={type.id}>{type.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label><strong>Description: </strong></Form.Label>
                        <Form.Control as="textarea" name="description" defaultValue={incidentEdit.description} rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicJob">
                        <Form.Label><strong>Action: </strong></Form.Label>
                        <Form.Control type="text" name="incidentAction" defaultValue={incidentEdit.incidentAction} placeholder="Enter action" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicJob">
                        <Form.Label><strong>Location: </strong></Form.Label>
                        <Form.Control type="text" name="location" defaultValue={incidentEdit.location} placeholder="Enter location" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicRole">
                        <Form.Label><strong>Violation: </strong></Form.Label>
                        <Form.Select name="violation" defaultValue={incidentEdit.violation} required>
                            <option>Select Violation</option>
                            {violations.map(violation => (
                                <option value={violation.id}>{violation.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label><strong>Incident Date: </strong></Form.Label>
                        <Form.Control type="date" name="incidentDate" defaultValue={incidentEdit.incidentDate} required />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleEditClose}>
                    Close
                </Button>
                <Button type='submit' variant="primary">
                    Save
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>


        <Modal show={deleteShow} onHide={handleDeleteClose}>
            <Modal.Header closeButton>
            <Modal.Title>Delete Incident</Modal.Title>
            </Modal.Header>
            {lding ? <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    </Col>
                </Row>
            </Container> : ''}

            {alertShow && errmsg?
                <Container>
                    <div>
                        <Alert style={{height: '50px', marginTop: '4px'}} variant="danger" onClose={handleCloseAlert} dismissible>
                            <p><strong>{errmsg}</strong></p>
                        </Alert>
                    </div>
                </Container>: ''
            }
            


            
            <Modal.Body>
                <p className='text-danger'>Are you sure you want to delete this incident?</p>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
                Close
            </Button>
            <Button type='submit' onClick={() => handleDeleteBtn(incidentDelete.id)} variant="danger">
                Delete
            </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default Incidents