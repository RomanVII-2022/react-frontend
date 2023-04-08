import React from 'react'

const ColumnFilter = ({column}) => {

  const {filterValue, setFilter} = column

  return (
    <div>
        <input style={{width: '100%', border: '1px solid grey',
    borderRadius: '5px',
    height: '20px',
    padding: '2px 23px 2px 30px',
    outline: '0',
    backgroundColor: '#f5f5f5'}} 
    type="search" 
    value={filterValue || ''} onChange={(e) => setFilter(e.target.value)} 
    />
    </div>
  )
}

export default ColumnFilter