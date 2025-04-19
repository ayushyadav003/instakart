import '../CollectionPage.scss'
import { Clear, Delete } from '@mui/icons-material'
export default function Cart({ cartItems, setCartItems, setCart }) {
  const calculateTotalAmount = () => {
    return cartItems?.reduce((acc, current) => {
      let price = current?.price
      return price + acc
    }, 0)
  }

  return (
    <div className="shopping-cart">
      <div className="title">
        Shopping Bag <Clear onClick={() => setCart(false)} />
      </div>
      <div>
        {cartItems?.length > 0 &&
          cartItems?.map((item) => (
            <div className="item" key={item?._id}>
              <div className="description">
                <img src={item?.mediaUrls[0]} alt="" />
                <div>
                  <span>{item?.title}</span>
                  <span>{item?.varient?.title}</span>
                </div>
              </div>

              <div className="quantity">
                {item?.quantity < 2 ? (
                  <Delete className="dltBtn" />
                ) : (
                  <button className="plus-btn" type="button" name="button">
                    -
                  </button>
                )}
                <input type="text" name="name" value={item?.quantity} />
                <button className="minus-btn" type="button" name="button">
                  +
                </button>
              </div>

              <div className="total-price">
                Rs. {item?.price * item?.quantity}
              </div>
            </div>
          ))}
      </div>
      <div className="cartFooter">
        <div className="priceInfo">
          <h3>Rs. {calculateTotalAmount()}</h3>
        </div>
        <button>Checkout</button>
      </div>
    </div>
  )
}
