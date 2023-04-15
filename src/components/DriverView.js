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
import { AiFillEye } from 'react-icons/ai';
import CONSTANTS from './Drivers';

const DriverView = () => {

    const COLUMNS = [
        {
            Header: 'Core ID',
            Footer: 'Core ID',
            accessor: 'id',
            disableFilters: true
        },
        {
            Header: 'Driver Name:',
            Footer: 'Driver Name',
            accessor: 'name',
        },
        {
            Header: 'Driver Email:',
            Footer: 'Driver Email',
            accessor: 'email',
        },
        {
            Header: 'Driver Phone:',
            Footer: 'Driver Phone',
            accessor: 'phone',
        },
        {
            Header: "Action",
            accessor: "action",
            Cell: ({row}) => (
              <div>
                <i style={{cursor: 'pointer', marginLeft: '10px'}}><AiFillEye /></i>
              </div>
            ),
            disableFilters: true
        }
    ]


    const drivers = CONSTANTS.drivers


    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => drivers, [])
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

  return (
    <div>
        <NavBar />
        <Container>
            <Row>
                <Col>
                    <Button style={{marginTop: '10px'}} variant="secondary">Add</Button>
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
    </div>
  )
}

export default DriverView