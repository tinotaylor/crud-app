//REACT HOOKS & LIBRARIES ----------------------------------------------------------------
import { useEffect, useState, useContext } from "react";
import { updatingBookContext } from "../helpers/Context";
import axios from "axios";

// COMPONENTS ----------------------------------------------------------------
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddBooks from "../components/AddBooks";
import UpdateForm from "../components/UpdateForm";

// ICONS ----------------------------------------------------------------
import { RefreshIcon } from "@heroicons/react/outline";
import { XCircleIcon } from "@heroicons/react/outline";

// FIREBASE FUNCTIONS ----------------------------------------------------------------
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// NOTE: LOAD STRIPE PACKAGES FIRST BEFORE BEGINNING STRIPE SECTION
// STRIPE PACKAGES
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// STATIC PRODUCT DATA ----------------------------------------------------------------
const staticBooks = [
  {
    id: 1,
    title: "The Millionaire Fastlane",
    href: "#",
    img: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1384971700l/18872437.jpg",
    imageAlt:
      "Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls.",
    price: 20,
  },
  {
    id: 2,
    title: "The Power of Now",
    href: "#",
    img: "https://i.ebayimg.com/images/g/m2wAAOSwIWVZAWok/s-l500.jpg",
    price: 15.99,
  },
  {
    id: 3,
    title: "Think and Grow Rich",
    href: "#",
    img: "https://images-na.ssl-images-amazon.com/images/I/71UypkUjStL.jpg",
    price: 45.99,
  },
  {
    id: 4,
    title: "How to Win Friends and Influence People",
    href: "#",
    img: "https://images-na.ssl-images-amazon.com/images/I/81PQGGNul3L.jpg",
    price: 10,
  },
  // More products...
];

export default function Home() {
  // BOOKS COLLECTION & ITEM STATE
  const [item, setItem] = useState(null);
  const [books, setBooks] = useState([]);

  // UPDATING STATE
  const [bookId, setBookId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // NEW BOOK INPUT STATES
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newImage, setNewImage] = useState("");

  // NOTE: FIREBASE CODE STARTS HERE
  // 1. GET ALL BOOKS FROM FIREBASE AND MAP THEM OUT ✅
  useEffect(() => {
    const ref = collection(db, "books");
    const getBooks = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.map((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setBooks(results);
    });

    return () => getBooks();
  }, []);

  // 2. CREATE A ADD BOOK FUNCTION IN OTHER COMPONENT THAT WILL TRIGGER ONCLICK ✅
  const addBook = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "books"), {
      title: newTitle,
      price: Number(newPrice),
      img: newImage,
    });
    setNewTitle("");
    setNewPrice(0);
    setNewImage("");
  };

  //3. CREATE A DELETE BOOK FUNCTION THAT WILL TAKE A SINGLE BOOK ID TO DELETE IT
  const deleteBook = async (id) => {
    const bookDoc = doc(db, "books", id);
    await deleteDoc(bookDoc);
  };

  //4. CREATE STATE FOR BOOK ID AND UPDATING TO TRIGGER MODAL✅
  // 4.1 ADD TERNARY OPERATION TO CHECK IF UPDATING IS TRUE BEFORE RENDERING UPDATE FORM COMPONENT ✅
  // 4.2 ADD A CONDITION TO CHECK IF UPDATING STATE IS TRUE AND THEN SHOW MODAL ✅
  useEffect(() => {
    if (bookId != null) setIsUpdating(true);
  }, [bookId]);

  //4.3 CREATE RESET BOOK ID FUNCTION & PASS TO UPDATEFORM FOR WHEN USER CLOSES MODAL✅
  const resetBookId = () => {
    setBookId(null);
  };

  // 4.4 CREATE A UPDATE BOOK FUNCTION THAT WILL TAKE NEW VALUES FOR A SPECIFIC BOOK ID AND UPDATE THE RELEVANT INFORMATION
  //  PASS TO COMPONENT
  const updateBook = async () => {
    const bookDoc = doc(db, "books", bookId);
    await updateDoc(bookDoc, {
      title: newTitle,
      price: Number(newPrice),
      img: newImage,
    });
    setBookId(null);
    setNewTitle("");
    setNewPrice(0);
    setNewImage("");
    setIsUpdating(false);
  };

  // NOTE: STRIPE CODE STARTS HERE
  //5. CREATE ONCLICK ON BUY BUTTON TO SET ITEM WITH [{ title, price, img }]
  //6. FUNCTION TO CREATE CHECKOUT SESSION WHEN USER CLICKS BUY BUTTON
  const createCheckoutSession = async () => {
    // WAIT FOR STRIPE PROMISE TO LOAD
    const stripe = await stripePromise;

    //CREATE THE CHECKOUT SESSION & SET UP BACK END
    const checkoutSession = await axios.post("/api/checkout_session", {
      item,
    });

    // GET THE CHECKOUT SESSION ID BACK FROM ENDPOINT AND REDIRECT USER TO STRIPE CHECKOUT
    const result = await stripe.redirectToCheckout({
      // SESSION ID IS TAKEN FROM CHECKOUT SESSION
      sessionId: checkoutSession.data.id,
    });

    // IF THERE IS AN ERROR WITH REDIRECTING USER TO STRIPE SHOW IT
    if (result) alert(result.error.message);
  };

  //7. FIRE OFF CHECKOUT SESSION ONCE SINGLE ITEM STATE HAS BEEN UPDATED
  useEffect(() => {
    if (item != null) {
      createCheckoutSession();
    }
  }, [item]);

  return (
    <updatingBookContext.Provider
      value={{
        isUpdating,
        setIsUpdating,
        newTitle,
        newPrice,
        newImage,
        setNewTitle,
        setNewPrice,
        setNewImage,
      }}
    >
      <Navbar />
      <Header />
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="flex place-items-center justify-between">
            <h2 className="text-xl font-bold underline-offset-4 decoration-1 text-gray-900">
              Our Latest Additions
            </h2>
            <h2 className="text-sm font-bold underline-offset-4 decoration-1 text-">
              View More
            </h2>
          </div>

          {/* NOTE: MODAL FOR UPDATING BOOK */}
          {isUpdating ? (
            <UpdateForm updateBook={updateBook} resetBookId={resetBookId} />
          ) : null}

          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-7">
            {books &&
              books.map(({ id, title, price, img }) => (
                <div key={id} className=" shadow-lg rounded-md py-2 px-2">
                  <div className="relative">
                    <div className="relative w-full h-72 rounded-lg overflow-hidden">
                      <img
                        src={img}
                        alt="/"
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="relative mt-4">
                      <p className="text-sm text-gray-500">Audiobook</p>
                      <h3 className="text-xl truncate max-w-xs  font-semibold text-gray-900">
                        {title}
                      </h3>
                    </div>
                    <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                      />
                      <p className="relative text-lg font-semibold text-white">
                        £{price}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setItem([{ title, price, img }])}
                      disabled={item}
                      className={`mt-6 ${
                        item ? "cursor-not-allowed" : ""
                      } w-full`}
                    >
                      <span
                        href="/"
                        className={`relative flex ${
                          item ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
                        } border border-transparent rounded-md py-2 px-8 h-full items-center justify-center text-sm font-medium text-gray-900 `}
                      >
                        {!item ? "Buy now" : "Loading..."}
                        <span className="sr-only">, {title}</span>
                      </span>
                    </button>
                    <div className="flex w-1/2 space-x-1">
                      <button
                        disabled={item}
                        onClick={() => deleteBook(id)}
                        className={`mt-6 ${
                          item ? "cursor-not-allowed" : ""
                        } w-1/2`}
                      >
                        <span
                          href="/"
                          className={`relative flex ${
                            item ? "bg-red-400" : "bg-red-500 hover:bg-red-400"
                          } border border-transparent rounded-md py-2  items-center justify-center text-sm font-medium text-white`}
                        >
                          <XCircleIcon className="h-6 w-6" />
                        </span>
                      </button>
                      <button
                        disabled={item}
                        onClick={() => setBookId(id)}
                        className={`mt-6 ${
                          item ? "cursor-not-allowed" : ""
                        } w-1/2`}
                      >
                        <span
                          href="/"
                          className={`relative flex ${
                            item
                              ? "bg-green-400"
                              : "bg-green-500 hover:bg-green-400"
                          } border border-transparent rounded-md py-2 items-center justify-center text-sm font-medium text-white`}
                        >
                          <RefreshIcon className="h-6 w-6" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <AddBooks addBook={addBook} />
      <Footer />
    </updatingBookContext.Provider>
  );
}
