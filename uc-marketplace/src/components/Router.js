import Header from './Header/Header'
import Footer from './Footer/Footer'
import Home from '../pages/HomePage/Home';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import AccountView from '../pages/AccountViewPage/AccountView';
import NewListing from '../pages/new-listing/new-listing';
import Products from '../pages/Products/products';
import Services from '../pages/ServicesPage/Services';
import ContactUs from "../pages/ContactUsPage/ContactUs"

export default function Router() {
    const Layout = () => {
        return (
            <>
            <Header />
            <div className="content"><Outlet /></div>
            <Footer />
            </>
        )
    }

    const BrowserRoutes = () => {
        return (
            <BrowserRouter>
                <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/account-view" element={<AccountView />} />
                    <Route path="/new-listing" element={<NewListing />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/services" element={<Services />} /> 
                    <Route path="/contact-us" element={<ContactUs />} />
                </Route>
                </Routes>
            </BrowserRouter>
        )
    }
    return (
        <BrowserRoutes />
    )
}