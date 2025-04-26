import React, { useEffect, useState } from 'react'
import CommonTable from '../../components/common/CommonTable'
import { apiConfig } from '../../services/ApiConfig'
import axios from 'axios'
import { userTableHead } from '../../utils/tableHead'
import "../../components/styles/Admin.scss"

const Admin = () => {
  const [users, setUsers] = useState([])
  const getUsers  = async () => {
    const response = await axios({
        url: apiConfig.getUsers,
        method: 'GET',
    })
    if (response?.status === 200) {
        const resData = response?.data
        setUsers(resData)
        console.log('Users data:', resData)
    } else {
        console.error('Error fetching users:', response?.message)
    }}
    useEffect(() => {   
        getUsers()
    },[])
  return (
    <div>
      <CommonTable
         head={userTableHead}
              rows={users}
              type="users"
      />

    </div>
  )
}

export default Admin
