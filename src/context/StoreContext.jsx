import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [sampleBook, setSampleBook] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [userRole, setUserRole] = useState('customer'); // 'customer' | 'admin'
  const [toasts, setToasts] = useState([]);
  const [recentOrder, setRecentOrder] = useState(null);

  // Fetch books from backend API
  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const res = await fetch('/api/books');
      const data = await res.json();
      if (data.success) {
        setBooks(data.books);
      }
    } catch (err) {
      console.error('Error loading books:', err);
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const addToCart = (book, quantity = 1) => {
    if (book.stock_quantity <= 0) {
      addToast(`"${book.title}" is currently out of stock!`, 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.book_id === book.book_id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > book.stock_quantity) {
          addToast(`Only ${book.stock_quantity} copies available in stock`, 'warning');
          return prev;
        }
        addToast(`Updated quantity of "${book.title}" in cart`);
        return prev.map(item => item.book_id === book.book_id ? { ...item, quantity: newQty } : item);
      }
      addToast(`Added "${book.title}" to cart!`);
      return [...prev, { ...book, quantity }];
    });
  };

  const updateCartQuantity = (bookId, newQty) => {
    const book = books.find(b => b.book_id === bookId);
    if (book && newQty > book.stock_quantity) {
      addToast(`Cannot exceed available stock (${book.stock_quantity})`, 'warning');
      return;
    }

    if (newQty <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev => prev.map(item => item.book_id === bookId ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (bookId) => {
    setCart(prev => prev.filter(item => item.book_id !== bookId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = cart.length === 0 ? 0 : (subtotal >= STORE_CONFIG.freeShippingThreshold ? 0 : STORE_CONFIG.flatShippingFee);
  const grandTotal = subtotal + shippingFee;

  return (
    <StoreContext.Provider
      value={{
        books,
        loadingBooks,
        fetchBooks,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        shippingFee,
        grandTotal,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedBook,
        setSelectedBook,
        sampleBook,
        setSampleBook,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackerOpen,
        setIsTrackerOpen,
        isAdminOpen,
        setIsAdminOpen,
        userRole,
        setUserRole,
        toasts,
        addToast,
        recentOrder,
        setRecentOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
