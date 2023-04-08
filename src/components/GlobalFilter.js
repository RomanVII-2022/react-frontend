import React, {useState} from 'react';
import { useAsyncDebounce } from 'react-table';

const GlobalFilter = ({filter, setFilter}) => {

  const [value, setValue] = useState(filter)

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined)
  }, 400)

  return (
    <div>
        <strong>Search:</strong> {' '}
        <input style={{width: '150px', border: '1px solid grey',
            borderRadius: '5px',
            height: '20px',
            padding: '2px 23px 2px 30px',
            outline: '0',
            backgroundColor: '#f5f5f5'}} type="search" value={value || ''} onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
            }} />
    </div>
  )
}

export default GlobalFilter