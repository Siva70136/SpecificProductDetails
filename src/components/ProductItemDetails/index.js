// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusconstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {productItem: [], apiStatus: apiStatusconstants.initial, count: 1}

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusconstants.loading,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const url = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = {
        availability: data.availability,
        id: data.id,
        brand: data.brand,
        price: data.price,
        description: data.description,
        rating: data.rating,
        imageUrl: data.image_url,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products,
      }
      console.log(data)
      this.setState({
        productItem: updatedData,
        apiStatus: apiStatusconstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusconstants.failure,
      })
    }
  }

  increase = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  decrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  renderSuccessView = () => {
    const {productItem, count} = this.state
    const {
      availability,
      brand,
      price,
      description,
      rating,
      imageUrl,
      title,
      totalReviews,
      similarProducts,
    } = productItem

    const updatedData = similarProducts.map(data => ({
      availability: data.availability,
      id: data.id,
      brand: data.brand,
      price: data.price,
      description: data.description,
      rating: data.rating,
      imageUrl: data.image_url,
      style: data.style,
      title: data.title,
      totalReviews: data.total_reviews,
    }))

    return (
      <div className="product-item-container">
        <div className="image-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="data-container">
            <h1 className="title1">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star"
                  alt="star"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="available">Availability:{availability}</p>
            <p className="brand">Brand:{brand}</p>
            <div className="button-container">
              <button
                type="button"
                className="count-button"
                onClick={this.decrease}
                data-testid="minus"
              >
                <BsPlusSquare />
              </button>
              <p className="count">{count}</p>
              <button
                type="button"
                className="count-button"
                onClick={this.increase}
                data-testid="plus"
              >
                <BsDashSquare />
              </button>
            </div>
            <button type="button" className="cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <ul className="similar-products">
          {updatedData.map(each => (
            <SimilarProductItem item={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  gotoProducts = () => {
    const {history} = this.props

    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-view">
      <div className="">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="failure"
        />
        <h1 className="">Product Not Found</h1>
        <button
          type="button"
          className="cart-button"
          onClick={this.gotoProducts}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )

  renderItems = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusconstants.success:
        return this.renderSuccessView()
      case apiStatusconstants.failure:
        return this.renderFailureView()
      case apiStatusconstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-containers">
        <Header />
        <div className="">
          <ul className="product-items">{this.renderItems()}</ul>
        </div>
      </div>
    )
  }
}

export default ProductItemDetails
