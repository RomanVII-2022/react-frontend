import React, { useState, useEffect, useMemo } from 'react'
import NavBar from './NavBar'
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { useSelector, useDispatch } from 'react-redux';
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";
import { getAllAudits, fetchAudits, addAudit, isLoading, editAudit, deleteAudit } from '../features/audits/auditSlice';
import { getAllCategories, fetchCategories } from '../features/auditCategory/auditCategorySlice';
import { getAllMeasure, fetchMeasures } from '../features/auditMeasure/auditMeasureSlice';
import { getAllOrganizations, fetchOrganizations } from '../features/organizations/organizationSlice';
import { getAllTypes, fetchTypes } from '../features/auditType/auditTypeSlice';
import { getAllStatus, fetchStatus } from '../features/auditStatus/auditStatusSlice';
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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const Incidents = () => {

    const categories = useSelector(getAllCategories)

    const measures = useSelector(getAllMeasure)

    const organizations = useSelector(getAllOrganizations)

    const types = useSelector(getAllTypes)

    const status = useSelector(getAllStatus)

    const [auditDelete, setAuditDelete] = useState({})

    const [deleteShow, setDeleteShow] = useState(false);

    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = () => setDeleteShow(true);

    function handleAuditDelete(audit) {
        handleDeleteShow()
        setAuditDelete(audit)
    }

    const handleDeleteBtn = (id) => {
        dispatch(deleteAudit(id))
    }

    const [auditEdit, setAuditEdit] = useState({})

    const [editShow, setEditShow] = useState(false);

    const handleEditClose = () => setEditShow(false);
    const handleEditShow = () => setEditShow(true);

    function handleAuditEdit(audit) {
        handleEditShow()
        setAuditEdit(audit)
    }

    const handleEditSubmitAudit = (e, id) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('id', id)
        dispatch(editAudit(formData))
    }

    const COLUMNS = [
        {
            Header: 'ID',
            Footer: 'ID',
            accessor: 'id',
            disableFilters: true
        },
        {
            Header: 'Name:',
            Footer: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Category:',
            Footer: 'Category',
            accessor: 'auditCategory',
            Cell: ({value}) => {return categories.filter(category => category.id === value).map(category => (category.name))}
        },
        {
            Header: 'Measure:',
            Footer: 'Measure',
            accessor: 'auditMeasure',
            Cell: ({value}) => {return measures.filter(measure => measure.id === value).map(measure => (measure.name))}
        },
        {
            Header: 'Type:',
            Footer: 'Type',
            accessor: 'auditType',
            Cell: ({value}) => {return types.filter(type => type.id === value).map(type => (type.name))}
        },
        {
            Header: 'Organization:',
            Footer: 'Organization',
            accessor: 'organization',
            Cell: ({value}) => {return organizations.filter(organization => organization.id === value).map(type => (type.name))}
        },
        {
            Header: 'Description:',
            Footer: 'Dascription',
            accessor: 'description',
            Cell: ({value}) => {return(
                <OverlayTrigger
                    trigger="click"
                    key="bottom"
                    placement="bottom"
                    overlay={
                        <Popover id={'popover-positioned-bottom'}>
                        <Popover.Header as="h3">Description</Popover.Header>
                        <Popover.Body>
                            <strong>{value}</strong>
                        </Popover.Body>
                        </Popover>
                    }
                    >
                    <a href='#'>Show Description</a>
                </OverlayTrigger>
            );}
        },
        {
            Header: 'Due Date:',
            Footer: 'Due Date',
            accessor: 'dateDue',
        }, 
        {
            Header: 'Status:',
            Footer: 'Status',
            accessor: 'auditStatus',
            Cell: ({value}) => {return status.filter(stat => stat.id === value).map(stat => (stat.name))}
        },
        {
            Header: "Action",
            accessor: "action",
            Cell: ({row}) => (
              <div>
                <i style={{cursor: 'pointer'}} onClick={() => handleAuditEdit(row.original)}><MdEdit /></i> | 
                {' '}<i style={{cursor: 'pointer'}} onClick={() => handleAuditDelete(row.original)}><MdDelete /></i>
              </div>
            ),
            disableFilters: true
        }
    ]

    const [alertShow, setAlertShow] = useState(false);

    const audits = useSelector(getAllAudits)

    const lding = useSelector(isLoading)

    const [errmsg, seterrmsg] = useState('')

    const dispatch = useDispatch()

   function handleSubmitAddAudit (e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    dispatch(addAudit(formData))
   }

   function handleCloseAlert() {
        setAlertShow(false)
        seterrmsg('')
   }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => audits, [audits])
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
        dispatch(fetchAudits())
        dispatch(fetchCategories())
        dispatch(fetchMeasures())
        dispatch(fetchTypes())
        dispatch(fetchStatus())
        dispatch(fetchOrganizations())
        console.log("fetching audits ...")
    }, [dispatch])

  return (
    <div>
        <NavBar />
        <Container>
            <Row>
                <Col>
                    <Button as={Link} to='/audits/manage' style={{marginTop: '10px'}} variant="secondary">Manage</Button>{' '}
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
            <Modal.Title>New Audit</Modal.Title>
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
            


            <Form onSubmit={handleSubmitAddAudit}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Name: </strong></Form.Label>
                        <Form.Control type="text" name="name" placeholder="Enter name" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label><strong> Audit Description:</strong></Form.Label>
                        <Form.Control as="textarea" name='description' rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Type: </strong></Form.Label>
                        <Form.Select name="auditType" aria-label="Default select example">
                            <option>Select Type</option>
                            {types.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Organization Requesting Audit: </strong></Form.Label>
                        <Form.Select name="organization" aria-label="Default select example">
                            <option>Select Organization</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Measure: </strong></Form.Label>
                        <Form.Select name="auditMeasure" aria-label="Default select example">
                            <option>Select Measure</option>
                            {measures.map(measure => (
                                <option key={measure.id} value={measure.id}>{measure.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Category: </strong></Form.Label>
                        <Form.Select name="auditCategory" aria-label="Default select example">
                            <option>Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Raised By: </strong></Form.Label>
                        <Form.Control type="text" name="raisedBy" placeholder="Raised by" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Date Raised: </strong></Form.Label>
                        <Form.Control type="date" name="dateRaised" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Date Due: </strong></Form.Label>
                        <Form.Control type="date" name="dateDue" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Assigned To: </strong></Form.Label>
                        <Form.Control type="text" name="assignedTo" placeholder="Assigned to" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Status: </strong></Form.Label>
                        <Form.Select name="auditStatus" aria-label="Default select example">
                            <option>Select Status</option>
                            {status.map(sts => (
                                <option key={sts.id} value={sts.id}>{sts.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label><strong> Notes:</strong></Form.Label>
                        <Form.Control as="textarea" name='notes' rows={3} required />
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
            <Modal.Title>Edit Audit</Modal.Title>
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
            


            <Form onSubmit={(e) => handleEditSubmitAudit(e, auditEdit.id)}>
                <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Name: </strong></Form.Label>
                        <Form.Control type="text" name="name" defaultValue={auditEdit.name} placeholder="Enter name" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label><strong> Audit Description:</strong></Form.Label>
                        <Form.Control as="textarea" name='description' defaultValue={auditEdit.description} rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Type: </strong></Form.Label>
                        <Form.Select name="auditType" defaultValue={auditEdit.auditType} aria-label="Default select example">
                            <option>Select Type</option>
                            {types.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Organization Requesting Audit: </strong></Form.Label>
                        <Form.Select name="organization" defaultValue={auditEdit.organization} aria-label="Default select example">
                            <option>Select Organization</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Measure: </strong></Form.Label>
                        <Form.Select name="auditMeasure" defaultValue={auditEdit.auditMeasure} aria-label="Default select example">
                            <option>Select Measure</option>
                            {measures.map(measure => (
                                <option key={measure.id} value={measure.id}>{measure.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Category: </strong></Form.Label>
                        <Form.Select name="auditCategory" defaultValue={auditEdit.auditCategory} aria-label="Default select example">
                            <option>Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Raised By: </strong></Form.Label>
                        <Form.Control type="text" name="raisedBy" defaultValue={auditEdit.raisedBy} placeholder="Raised by" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Date Raised: </strong></Form.Label>
                        <Form.Control type="date" name="dateRaised" defaultValue={auditEdit.dateRaised} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Date Due: </strong></Form.Label>
                        <Form.Control type="date" name="dateDue" defaultValue={auditEdit.dateDue} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Assigned To: </strong></Form.Label>
                        <Form.Control type="text" name="assignedTo" defaultValue={auditEdit.assignedTo} placeholder="Assigned to" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Audit Status: </strong></Form.Label>
                        <Form.Select name="auditStatus" defaultValue={auditEdit.auditStatus} aria-label="Default select example">
                            <option>Select Status</option>
                            {status.map(sts => (
                                <option key={sts.id} value={sts.id}>{sts.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label><strong> Notes:</strong></Form.Label>
                        <Form.Control as="textarea" name='notes' defaultValue={auditEdit.notes} rows={3} required />
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
            <Modal.Title>Delete Audit</Modal.Title>
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
                <p className='text-danger'>Are you sure you want to delete this audit?</p>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
                Close
            </Button>
            <Button type='submit' onClick={() => handleDeleteBtn(auditDelete.id)} variant="danger">
                Delete
            </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default Incidents