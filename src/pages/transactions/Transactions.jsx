import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CommonTable from '../../components/common/CommonTable'
import { transactionTableHead } from '../../utils/tableHead'
import { useDispatch } from 'react-redux'
import { startLoading, stopLoading } from '../../redux/features/userSlice'
import { apiConfig } from '../../services/ApiConfig'
import { useEffect } from 'react'
import { ApiWithToken } from '../../services/ApiWithToken'

const transactionTypes = [
  { title: 'All', route: 'all', value: null },
  { title: 'Remmitence', route: 'remmitence', value: 'RECHARGE' },
  { title: 'Deductions', route: 'deductions', value: 'DEDUCTION' },
]
export default function Transactions() {
  const location = useLocation()
  const [transactions, setTransactions] = useState([])
  const dispatch = useDispatch()
  const currentPath = location?.pathname.split('/')

    const getTransactions = async () => {
      try {
        dispatch(startLoading())
        const apiOptions = {
          url: `${apiConfig.transaction}`,
          method: 'GET',
          params: {
            transactionType: currentPath[2],
            page:1,
            limit:100,
          },
        }
        const response = await ApiWithToken(apiOptions)
        if (response?.status === 200) {
          setTransactions(response?.data?.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        dispatch(stopLoading())
      }
    }

    useEffect(()=>{
        getTransactions()
    },[])

  return (
    <div>
      <div className="optionsWrapper">
        <div className="optionsInner">
          {transactionTypes.map((data, i) => (
            <Link
              key={i}
              to={`/transactions/${data.route}`}
              className={currentPath[2] === data.route && 'selectedOption'}
            >
              {data.title}
            </Link>
          ))}
        </div>
        <div className="balanceWrapper">
          {/* <div>
            <span>Total balance : </span>

            <span>
              {' '}
              {localStorage.getItem('currentBalance')
                ? `Rs. ${localStorage.getItem('currentBalance')}`
                : '...'}
            </span>
          </div> */}
        </div>
      </div>
      <CommonTable
        head={transactionTableHead}
        rows={transactions}
        type="transactions"
      />
    </div>
  )
}
