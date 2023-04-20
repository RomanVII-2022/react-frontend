import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React, { useState, useEffect, useMemo } from 'react'
import NavBar from './NavBar'
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { useSelector, useDispatch } from 'react-redux';
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";
import { getAllViolations, fetchViolations, addViolation, isLoading, editViolation, deleteViolation } from '../features/violations/violationSlice';
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

const Violations = () => {

    const [typeDelete, setTypeDelete] = useState({})

    const [deleteShow, setDeleteShow] = useState(false);

    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = () => setDeleteShow(true);

    function handleTypeDelete(type) {
        handleDeleteShow()
        setTypeDelete(type)
    }

    const handleDeleteBtn = (id) => {
        dispatch(deleteViolation(id))
    }

    const [typeEdit, setTypeEdit] = useState({})

    const [editShow, setEditShow] = useState(false);

    const handleEditClose = () => setEditShow(false);
    const handleEditShow = () => setEditShow(true);

    function handleTypeEdit(type) {
        handleEditShow()
        setTypeEdit(type)
    }

    const handleEditSubmitType = (e, id) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const ID = parseInt(id)
        formData.append('id', ID)

        const otherTypes = violations.filter(type => type.id !== id)
        const eName = otherTypes.filter(type => type.name === e.target.name.value)

        if (eName.length > 0) {
            setAlertShow(true)
            seterrmsg('Violation already exists')
        }else {
            dispatch(editViolation(formData))
            handleClose()
        }
    }

    const COLUMNS = [
        {
            Header: '#_ID',
            Footer: '#_ID',
            accessor: 'id',
            disableFilters: true
        },
        {
            Header: 'Type Name:',
            Footer: 'Type Name',
            accessor: 'name',
        },
        {
            Header: 'Description:',
            Footer: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Proposed Action:',
            Footer: 'Proposed Action',
            accessor: 'proposed',
        },
        {
            Header: "Action",
            Footer: "Action",
            accessor: "action",
            Cell: ({row}) => (
              <div>
                <i style={{cursor: 'pointer'}} onClick={() => handleTypeEdit(row.original)}><MdEdit /></i> | 
                {' '}<i style={{cursor: 'pointer'}} onClick={() => handleTypeDelete(row.original)}><MdDelete /></i>
              </div>
            ),
            disableFilters: true
        }
    ]

    const [alertShow, setAlertShow] = useState(false);

    const violations = useSelector(getAllViolations)

    const lding = useSelector(isLoading)

    const [errmsg, seterrmsg] = useState('')

    const dispatch = useDispatch()

   function handleSubmitAddType (e) {
    e.preventDefault()
    const eName = violations.filter(type => type.name === e.target.name.value)

    if (eName.length > 0) {
        setAlertShow(true)
        seterrmsg('Violation already exists')
    }else {
        const formData = new FormData(e.target)
        dispatch(addViolation(formData))
        handleClose()
    }

   }

   function handleCloseAlert() {
        setAlertShow(false)
        seterrmsg('')
   }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => violations, [violations])
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
        dispatch(fetchViolations())
        console.log("fetching violations ...")
    }, [dispatch])

  return (
    <div>
        <Container>
                    <Row>
                        <Col>
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
                    <Modal.Title>Add Violation</Modal.Title>
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
                    


                    <Form onSubmit={handleSubmitAddType}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label><strong>Type Name: </strong></Form.Label>
                                <Form.Control type="text" name="name" placeholder="Enter name" required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label><strong>Description:</strong></Form.Label>
                                <Form.Control as="textarea" name='description' rows={3} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicAction">
                                <Form.Label><strong>Proposed Action: </strong></Form.Label>
                                <Form.Control type="text" name="proposed" placeholder="Enter proposed action" required />
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
                    <Modal.Title>Edit Violation</Modal.Title>
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
                    


                    <Form onSubmit={(e) => handleEditSubmitType(e, typeEdit.id)}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label><strong>Name: </strong></Form.Label>
                                <Form.Control type="text" name="name" defaultValue={typeEdit.name} placeholder="Enter name" required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label><strong>Description:</strong></Form.Label>
                                <Form.Control as="textarea" name='description' defaultValue={typeEdit.description} rows={3} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicAction">
                                <Form.Label><strong>Proposed Action: </strong></Form.Label>
                                <Form.Control type="text" name="proposed" defaultValue={typeEdit.proposed} placeholder="Enter proposed action" required />
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
                    <Modal.Title>Delete Violation</Modal.Title>
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
                        <p className='text-danger'>Are you sure you want to delete this violation?</p>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        Close
                    </Button>
                    <Button type='submit' onClick={() => handleDeleteBtn(typeDelete.id)} variant="danger">
                        Delete
                    </Button>
                    </Modal.Footer>
                </Modal>
    </div>
  )
}

export default Violations