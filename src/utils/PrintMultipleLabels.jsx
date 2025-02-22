/* eslint-disable react/prop-types */
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import moment from 'moment/moment'
import QRCode from 'react-qr-code'
import '../components/printLabel/printLabel.scss'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { startLoading, stopLoading } from '../redux/features/userSlice'
import { PDFDocument } from 'pdf-lib'
import { delhiveryLogo, expressLogo, logo } from './logosBase84'

export const PrintMultipleLabel = ({
  open,
  vendorCode,
  labelRef,
  clientLogo,
}) => {
  return (
    <div
      style={{
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
      ref={labelRef}
    >
      <div
        style={{
          width: '340px',
          height: '600px',
          border: '1px solid #000',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              borderBottom: '1px solid #000',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '70%',
              height: clientLogo ? '150px' : '110px',
              borderRight: '1px solid #000',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '40%',
                padding: '5px 0',
                display: clientLogo ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={`data:image/png;base64,${clientLogo}`}
                style={{
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div
              style={{
                width: '100%',
                height: clientLogo ? '50%' : '90%',
                padding: '5px 0',
                borderTop: clientLogo ? '1px solid #000' : 'none',
              }}
            >
              <img
                src={open?.barcode}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
          <div style={{ width: '40%' }}>
            <div
              style={{
                height: '60px',
                borderBottom: '1px solid #000',
                display: 'flex',
                justifyContent: 'center',
                padding: '0 5px',
              }}
            >
              <img src={logo} style={{ width: '100%', objectFit: 'contain' }} />
            </div>
            <div
              style={{
                height: '60px',
                borderBottom: '1px solid #000',
                display: 'flex',
                justifyContent: 'center',
                padding: '0 5px',
              }}
            >
              <img
                src={vendorCode == 'DL' ? delhiveryLogo : expressLogo}
                style={{ width: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              borderRight: '1px solid #000',
              padding: '7px',
              width: '100%',
            }}
          >
            <span>
              <b>Shipping To:</b>
            </span>
            <p style={{ fontSize: '13px', margin: '0' }}>
              {open?.name || '##'}
            </p>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                maxWidth: '170px',
              }}
            >
              {open?.address || '##'}
            </span>
          </div>
          <div style={{ textAlign: 'center', margin: '5px 0 0 0 ' }}>
            <span style={{ fontSize: '12px' }}>
              <b>PIN:</b>
              {open?.pin}
            </span>
            <div
              style={{
                border: '1px solid #000',
                height: 'fit-content',
                width: '102px',
                margin: '10px',
              }}
            >
              <span style={{ fontSize: '11px', margin: '0' }}>
                <b>Delivery Station:</b>
              </span>
              <p style={{ fontSize: '13px', margin: '0' }}>
                {open?.destination_city}
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid #000',
          }}
        >
          <div
            style={{
              borderRight: '1px solid #000',
              padding: '5px',
              width: '100%',
            }}
          >
            <span style={{ display: 'flex', gap: '10px', fontSize: '14px' }}>
              <b>Shipping Date:</b>
              <b>{moment(open?.cd).format('DD-MM-YYYY')}</b>
            </span>
          </div>
          <div
            style={{
              borderRight: 'none',
              padding: '7px',
              width: '40%',
            }}
          >
            <span>
              <b>{open?.pt}</b>
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid #000',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              borderRight: '1px solid #000',
              padding: '5px',
              width: '100%',
            }}
          >
            <b>Seller Name:</b> {open?.snm}
          </div>
          <div
            style={{
              fontSize: '10px',
              borderRight: '1px solid #000',
              padding: '5px',
              width: '100%',
            }}
          >
            <b>Seller Address:</b> {open?.sadd}
          </div>
        </div>
        <div
          style={{
            height: '20px',
            borderTop: '1px solid #000',
            display: 'flex',
          }}
        >
          <div
            style={{
              borderRight: '1px solid #000',
              borderBottom: '1px solid #000',
              width: '100%',
              display: 'flex',
              height: 'fit-content',
            }}
          >
            <span
              style={{
                padding: '5px',
                textAlign: 'center',
                fontSize: '11px',
              }}
            >
              <b>Product</b>
            </span>
          </div>
          <div
            style={{
              borderRight: 'none',
              borderBottom: '1px solid #000',
              width: '100%',
              display: 'flex',
              height: 'fit-content',
            }}
          >
            <span
              style={{
                padding: '5px',
                textAlign: 'center',
                fontSize: '11px',
                borderRight: '1px solid #000',
                width: '100%',
              }}
            >
              <b>Price</b>
            </span>
            <span
              style={{
                padding: '5px',
                textAlign: 'center',
                fontSize: '11px',
                width: '100%',
              }}
            >
              <b>Total</b>
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              height: '60px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '1px solid #000',
            }}
          >
            <b>{open?.prd}</b>
          </span>
          <span
            style={{
              borderRight: '1px solid #000',
              display: 'flex',
              height: '60px',

              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5px',
            }}
          >
            <span style={{ borderRight: 'none' }}>Rs.{open?.rs}</span>
          </span>
          <span
            style={{
              borderRight: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5px',
            }}
          >
            <span style={{ borderRight: 'none' }}>Rs.{open?.rs}</span>
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            borderTop: '1px solid #000',
            height: '100px',
            padding: '7px',
          }}
        >
          <p style={{ width: '60%', fontSize: '13px' }}>
            <b>
              Note: Shipper Declares that package does not include any
              prohibited items & is itself responsible for it.
            </b>
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0',
            }}
          >
            <QRCode size={76} value={open?.oid || '0'} viewBox={`0 0 56 56`} />
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '11px',
                height: '0',
                marginTop: '10px',
                marginLeft: '-7px',
              }}
            >
              <b>OrderId:</b> {open?.oid}
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            borderTop: '1px solid gray',
            padding: '5px',
            borderBottom: '1px solid gray',
          }}
        >
          Powered By www.blitzshipz.com
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            height: '100px',
          }}
        >
          <span style={{ padding: '10px' }}>
            <b>Return Address:</b> ##
          </span>
        </div>
      </div>
    </div>
  )
}
export const PrintLabels = ({ multipleLabelData, clientLogo }) => {
  const dispatch = useDispatch()
  const labelRefs = useRef([])

  if (multipleLabelData.length < 0) {
    return
  }

  const handleDownload = async () => {
    dispatch(startLoading())
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    })

    for (let i = 0; i < multipleLabelData.length; i++) {
      const labelElement = labelRefs.current[i]
      const canvas = await html2canvas(labelElement, {
        scale: 2,
        useCORS: true,
      })
      const imgData = canvas.toDataURL('image/png')

      if (i > 0) pdf.addPage()

      pdf.addImage(imgData, 'PNG', 0, 0, 595, 842)
    }
    dispatch(stopLoading())
    pdf.save('Delhivery-orders-label.pdf')
  }

  useEffect(() => {
    handleDownload()
  }, [multipleLabelData])

  return (
    <div>
      {multipleLabelData.map((data, i) => (
        <div
          key={i}
          style={{ position: 'fixed', bottom: '-120vh', zIndex: '-999' }}
        >
          <PrintMultipleLabel
            open={data?.label || {}}
            vendorCode={data?.vendorCode}
            clientLogo={clientLogo}
            labelRef={(el) => (labelRefs.current[i] = el)}
          />
        </div>
      ))}
    </div>
  )
}

export const printMultipleDtdcLabel = async (dtdcArray) => {
  try {
    const mergedPdf = await PDFDocument.create()

    for (const { label } of dtdcArray) {
      const pdfBytes = await label.arrayBuffer()
      const pdfToMerge = await PDFDocument.load(pdfBytes)

      const pages = await mergedPdf.copyPages(
        pdfToMerge,
        pdfToMerge.getPageIndices(),
      )

      pages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedPdfBytes = await mergedPdf.save()

    const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
    const blobUrl = URL.createObjectURL(mergedBlob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = 'DTDC-orders-label.pdf'
    link.click()
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Error merging PDFs:', error)
  }
}
