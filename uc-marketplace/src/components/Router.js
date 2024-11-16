
import Header from './Header/Header'
import Footer from './Footer/Footer'
import Home from '../pages/HomePage/Home';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import AccountView from '../pages/AccountViewPage/AccountView';
import NewListing from '../pages/new-listing/new-listing';
import NewService from '../pages/new-services/new-service';
import Products from '../pages/Products/products';
import ProductDetails from '../pages/Products/productdetails';
import Services from '../pages/ServicesPage/Services';
import ServiceDetails from '../pages/ServicesPage/servicesdetails';
import ContactUs from "../pages/ContactUsPage/ContactUs";
import Checkout from "../pages/Checkout/Checkout"; // Import Checkout page
import Confirmation from "../pages/Confirmation/Confirmation"; // Import Confirmation page

export default function Router() {
    const Layout = () => {
        return ( 
            <>
            <Header />
            <div className="content"><Outlet /></div>
            <Footer />
            </>
        );
    };

    const BrowserRoutes = () => {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} /> {/* Default route for "/" */}
                        <Route path="/account-view" element={<AccountView />} />
                        <Route path="/new-listing" element={<NewListing />} />
                        <Route path="/new-service" element={<NewService />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetails />} /> {/* Route for product details */}
                        <Route path="/services" element={<Services />} /> 
                        <Route path="/services/:id" element={<ServiceDetails />} /> {/* Route for service details */}
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/checkout" element={<Checkout />} /> {/* Route for Checkout */}
                        <Route path="/confirmation" element={<Confirmation />} /> {/* Route for Confirmation */}
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    };

    return <BrowserRoutes />;
}
