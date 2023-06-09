import React, { useState, useEffect, useMemo } from 'react'
import NavBar from './NavBar'
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { useSelector, useDispatch } from 'react-redux';
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";
import { getAllUsers, fetchUsers, addUser, isLoading, editUser, deleteUser } from '../features/users/userSlice';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { MdEdit, MdDelete } from 'react-icons/md';
import * as XLSX from 'xlsx';

const Users = () => {

    const [userDelete, setUserDelete] = useState({})

    const [deleteShow, setDeleteShow] = useState(false);

    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = () => setDeleteShow(true);

    function handleUserDelete(user) {
        handleDeleteShow()
        setUserDelete(user)
    }

    const handleDeleteBtn = (id) => {
        dispatch(deleteUser(id))
    }

    const [userEdit, setUserEdit] = useState({})

    const [editShow, setEditShow] = useState(false);

    const handleEditClose = () => setEditShow(false);
    const handleEditShow = () => setEditShow(true);

    function handleUserEdit(user) {
        handleEditShow()
        setUserEdit(user)
    }

    const handleEditSubmitUser = (e, id, passwrd) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        formData.append('password', passwrd)
        const ID = parseInt(id)
        formData.append('id', ID)

        const otherUsers = users.filter(user => user.id !== id)
        const eEmail = otherUsers.filter(user => user.email === e.target.email.value)
        const ePhone = otherUsers.filter(user => user.phone === e.target.phone.value)

        if (eEmail.length > 0) {
            setAlertShow(true)
            seterrmsg('Email entered already exists')
        }else if (ePhone.length > 0) {
            setAlertShow(true)
            seterrmsg('Phone number entered already exists')
        }else if (e.target.role.value === 'Select Role') {
            setAlertShow(true)
            seterrmsg('Please Select Role')
        }else if (e.target.status.value === 'Select Status') {
            setAlertShow(true)
            seterrmsg('Please Select Status')
        }else {
            dispatch(editUser(formData))
            handleClose()
        }
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
            Header: 'Email:',
            Footer: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Phone:',
            Footer: 'Phone',
            accessor: 'phone',
        },
        {
            Header: 'Job Title:',
            Footer: 'Job Title',
            accessor: 'jobTitle',
        },
        {
            Header: 'Status:',
            Footer: 'Status',
            accessor: 'status',
            Cell: ({value}) => value === 1 ? 'Active' : 'Inactive'
        },
        {
            Header: 'Role:',
            Footer: 'Role',
            accessor: 'role',
            Cell: ({value}) => value === 1 ? 'Admin' : 'User'
        },
        {
            Header: 'Created On:',
            Footer: 'Created On',
            accessor: 'created_on',
            Cell: ({value}) => {const date = new Date(value); return date.toDateString()},
        }, 
        {
            Header: "Action",
            accessor: "action",
            Cell: ({row}) => (
              <div>
                <i style={{cursor: 'pointer'}} onClick={() => handleUserEdit(row.original)}><MdEdit /></i> | 
                {' '}<i style={{cursor: 'pointer'}} onClick={() => handleUserDelete(row.original)}><MdDelete /></i>
              </div>
            ),
            disableFilters: true
        }
    ]

    const [alertShow, setAlertShow] = useState(false);

    const users = useSelector(getAllUsers)

    const lding = useSelector(isLoading)

    const [errmsg, seterrmsg] = useState('')

    const dispatch = useDispatch()

   function handleSubmitAddUser (e) {
    e.preventDefault()
    const eEmail = users.filter(user => user.email === e.target.email.value)
    const ePhone = users.filter(user => user.phone === e.target.phone.value)

    if (eEmail.length > 0) {
        setAlertShow(true)
        seterrmsg('Email entered already exists')
    }else if (ePhone.length > 0) {
        setAlertShow(true)
        seterrmsg('Phone number entered already exists')
    }else if (e.target.role.value === 'Select Role') {
        setAlertShow(true)
        seterrmsg('Please Select Role')
    }else if (e.target.status.value === 'Select Status') {
        setAlertShow(true)
        seterrmsg('Please Select Status')
    }else {
        dispatch(addUser(e.target))
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
    const data = useMemo(() => users, [users])
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

    const handleOnExport = () => {
        var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(users);

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1")

        XLSX.writeFile(wb, "Users.xlsx")

    }

    useEffect(() => {
        dispatch(fetchUsers())
        console.log("fetching users ...")
    }, [dispatch])

  return (
    <div>
        <NavBar />
        <Container>
            <Row>
                <Col>
                    <Button style={{marginTop: '10px'}} variant="secondary" onClick={handleShow}>Add</Button>
                </Col>
                <Col style={{marginTop: '20px'}}>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </Col>
                <Col>
                    <Button style={{marginTop: '10px'}} variant="secondary" onClick={handleOnExport}>Export</Button>
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
            <Modal.Title>Add Personel</Modal.Title>
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
            


            <Form onSubmit={handleSubmitAddUser}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Full Name: </strong></Form.Label>
                        <Form.Control type="text" name="name" placeholder="Enter name" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label><strong>Email address: </strong></Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Label><strong>Phone Number: </strong></Form.Label>
                        <Form.Control type="text" name="phone" placeholder="Enter phone number eg: +254712345678" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicJob">
                        <Form.Label><strong>Job Title: </strong></Form.Label>
                        <Form.Control type="text" name="jobTitle" placeholder="Enter job title" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label><strong>Password: </strong></Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicRole">
                        <Form.Label><strong>Role: </strong></Form.Label>
                        <Form.Select name="role" required>
                            <option>Select Role</option>
                            <option value="0">User</option>
                            <option value="1">Admin</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label><strong>Status: </strong></Form.Label>
                        <Form.Select aria-label="Default select example" name="status" required>
                            <option>Select Status</option>
                            <option value="0">Inactive</option>
                            <option value="1">Active</option>
                        </Form.Select>
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
            <Modal.Title>Edit User</Modal.Title>
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
            


            <Form onSubmit={(e) => handleEditSubmitUser(e, userEdit.id, userEdit.password)}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label><strong>Full Name: </strong></Form.Label>
                        <Form.Control type="text" name="name" defaultValue={userEdit.name} placeholder="Enter name" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label><strong>Email address: </strong></Form.Label>
                        <Form.Control type="email" name="email" defaultValue={userEdit.email} placeholder="Enter email" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Label><strong>Phone Number: </strong></Form.Label>
                        <Form.Control type="text" name="phone" defaultValue={userEdit.phone} placeholder="Enter phone number eg: +254712345678" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicJob">
                        <Form.Label><strong>Job Title: </strong></Form.Label>
                        <Form.Control type="text" name="jobTitle" defaultValue={userEdit.jobTitle} placeholder="Enter job title" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicRole">
                        <Form.Label><strong>Role: </strong></Form.Label>
                        <Form.Select name="role" defaultValue={userEdit.role} required>
                            <option>Select Role</option>
                            <option value="0">User</option>
                            <option value="1">Admin</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label><strong>Status: </strong></Form.Label>
                        <Form.Select defaultValue={userEdit.status} aria-label="Default select example" name="status" required>
                            <option>Select Status</option>
                            <option value="0">Inactive</option>
                            <option value="1">Active</option>
                        </Form.Select>
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
            <Modal.Title>Delete User</Modal.Title>
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
                <p className='text-danger'>Are you sure you want to delete this user?</p>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
                Close
            </Button>
            <Button type='submit' onClick={() => handleDeleteBtn(userDelete.id)} variant="danger">
                Delete
            </Button>
            </Modal.Footer>
        </Modal>

    </div>
  )
  
}

export default Users