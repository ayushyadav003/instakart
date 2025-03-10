import React from 'react'
import CommonTable from '../../components/common/CommonTable'
import { productTableHead } from '../../utils/tableHead'
import { apiConfig } from '../../services/ApiConfig'

export default function Products() {
  // const getTransactions = async () => {
  //   try {
  //     dispatch(startLoading())
  //     const apiOptions = {
  //       url: apiConfig.getProductList,
  //       method: 'Post',
  //       params: {
  //         page: currentPage - 1,
  //         size: currentItem,
  //       },
  //       data: {
  //         ...filter,
  //       },
  //     }
  //     const response = await ApiWithToken(apiOptions)
  //     if (response?.status === 200) {
  //       setTransactionList(response?.data?.content)
  //       setTotalPages(response?.data?.totalPages)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     dispatch(stopLoading())
  //   }
  // }

  return (
    <div>
      <CommonTable type={'products'} head={productTableHead} rows={[]} />
    </div>
  )
}
