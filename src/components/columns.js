import Button from "react-bootstrap/esm/Button";
import { MdEdit, MdDelete } from 'react-icons/md';

export const COLUMNS = [
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
            {' '}<i style={{cursor: 'pointer'}}><MdDelete /></i>
          </div>
        ),
        disableFilters: true
    }
]

function handleUserEdit(user) {
    console.log(user.name)
}
