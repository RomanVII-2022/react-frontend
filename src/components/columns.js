
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
    },
    {
        Header: 'Role:',
        Footer: 'Role',
        accessor: 'role',
    },
    {
        Header: 'Created On:',
        Footer: 'Created On',
        accessor: 'created_on',
        Cell: ({value}) => {const date = new Date(value); return date.toDateString()},
    }
]