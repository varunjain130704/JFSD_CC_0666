import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

const initialState = {
  plants: [
    { id: 1, name: "Snake Plant", price: 15, category: "Low Light", thumbnail: "https://via.placeholder.com/100" },
    { id: 2, name: "Spider Plant", price: 12, category: "Hanging", thumbnail: "https://via.placeholder.com/100" },
    { id: 3, name: "Fiddle Leaf Fig", price: 30, category: "Large", thumbnail: "https://via.placeholder.com/100" },
    { id: 4, name: "Peace Lily", price: 18, category: "Low Light", thumbnail: "https://via.placeholder.com/100" },
    { id: 5, name: "Pothos", price: 14, category: "Hanging", thumbnail: "https://via.placeholder.com/100" },
    { id: 6, name: "ZZ Plant", price: 20, category: "Low Light", thumbnail: "https://via.placeholder.com/100" },
  ],
  cart: {},
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.plant.id]: (state.cart[action.plant.id] || 0) + 1,
        },
      };
    case "INCREASE":
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.id]: state.cart[action.id] + 1,
        },
      };
    case "DECREASE":
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.id]: Math.max(state.cart[action.id] - 1, 1),
        },
      };
    case "DELETE":
      const newCart = { ...state.cart };
      delete newCart[action.id];
      return { ...state, cart: newCart };
    default:
      return state;
  }
}

const store = createStore(reducer);

const Header = () => {
  const cart = useSelector((state) => state.cart);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <header className="flex justify-between p-4 bg-green-700 text-white">
      <Link to="/" className="text-2xl font-bold">Plant Shop</Link>
      <nav className="flex gap-4 items-center">
        <Link to="/">Home</Link>
        <Link to="/cart" className="flex items-center gap-1">
          <ShoppingCart />
          <span>{cartCount}</span>
        </Link>
      </nav>
    </header>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center bg-cover bg-center min-h-screen flex flex-col justify-center items-center" style={{ backgroundImage: 'url(https://via.placeholder.com/1200x600)' }}>
      <h1 className="text-5xl text-white font-bold">Welcome to Plant Haven</h1>
      <p className="mt-4 text-white">Your one-stop shop for beautiful houseplants</p>
      <button onClick={() => navigate('/products')} className="mt-6 bg-white text-green-700 px-4 py-2 rounded-xl">Get Started</button>
    </div>
  );
};

const ProductListing = () => {
  const { plants, cart } = useSelector((state) => state);
  const dispatch = useDispatch();

  const groupedPlants = plants.reduce((acc, plant) => {
    if (!acc[plant.category]) acc[plant.category] = [];
    acc[plant.category].push(plant);
    return acc;
  }, {});

  return (
    <div className="p-4">
      {Object.keys(groupedPlants).map((category) => (
        <div key={category} className="mb-6">
          <h2 className="text-2xl mb-4">{category}</h2>
          <div className="grid grid-cols-3 gap-4">
            {groupedPlants[category].map((plant) => (
              <div key={plant.id} className="border p-4 rounded-xl">
                <img src={plant.thumbnail} alt={plant.name} className="mb-2" />
                <h3 className="text-lg font-semibold">{plant.name}</h3>
                <p>${plant.price}</p>
                <button
                  className="mt-2 bg-green-700 text-white px-3 py-1 rounded-xl disabled:opacity-50"
                  onClick={() => dispatch({ type: 'ADD_TO_CART', plant })}
                  disabled={cart[plant.id]}
                >
                  {cart[plant.id] ? "Added" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const CartPage = () => {
  const { plants, cart } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const plant = plants.find((p) => p.id === parseInt(id));
    return { ...plant, quantity };
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Shopping Cart</h2>
      <p>Total Items: {totalItems}</p>
      <p>Total Cost: ${totalPrice}</p>
      <div className="mt-4">
        {cartItems.map((item) => (
          <div key={item.id} className="border p-4 mb-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={item.thumbnail} alt={item.name} />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p>Unit Price: ${item.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => dispatch({ type: 'DECREASE', id: item.id })}><Minus /></button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch({ type: 'INCREASE', id: item.id })}><Plus /></button>
              <button onClick={() => dispatch({ type: 'DELETE', id: item.id })}><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>
      <button className="bg-green-700 text-white px-4 py-2 rounded-xl mr-4" onClick={() => alert('Coming Soon')}>Checkout</button>
      <button className="bg-gray-500 text-white px-4 py-2 rounded-xl" onClick={() => navigate('/products')}>Continue Shopping</button>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
