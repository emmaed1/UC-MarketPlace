import Header from './Header'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

export default function Router() {
    const Layout = () => {
        return (
            <>
            <Header />
            <div className="content"><Outlet /></div>
            </>
        )
    }

    const BrowserRoutes = () => {
        return (
            <BrowserRouter>
                <Routes>
                <Route path="/" element={<Layout />}>
                    {/* <Route path="/" element={<Home />} /> */}
                    {/* <Route path="/" element={<Products />} />
                    <Route path="/" element={<ContactUs />} /> */}
                </Route>
                </Routes>
            </BrowserRouter>
        )
    }
    return (
        <BrowserRoutes />
    )
}