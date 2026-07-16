"use client";

import Link from "next/link";
import { 
    LayoutDashboard,
    CalendarDays,
    Scissors,
    LogOut
} from "lucide-react";

import { useRouter } from "next/navigation";


export default function AdminLayout({
    children
}:{
    children:React.ReactNode
}){

    const router = useRouter();


    const logout = ()=>{

        localStorage.removeItem("token");

        router.push("/login");

    };


    return (

        <div className="
            min-h-screen
            flex
            bg-[#FAF8F5]
        ">


            {/* Sidebar */}

            <aside className="
                w-72
                bg-[#1C1C1C]
                text-white
                p-8
                flex
                flex-col
            ">


                <h1 className="
                    text-2xl
                    font-semibold
                    tracking-wide
                ">
                    Luxe Studio
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-gray-400
                ">
                    Admin Panel
                </p>



                <nav className="
                    mt-10
                    space-y-3
                    flex-1
                ">


                    <Link
                    href="/admin"
                    className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    hover:bg-white/10
                    "
                    >

                        <LayoutDashboard size={20}/>
                        Dashboard

                    </Link>



                    <Link
                    href="/admin/bookings"
                    className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    hover:bg-white/10
                    "
                    >

                        <CalendarDays size={20}/>
                        Bookings

                    </Link>



                    <Link
                    href="/admin/services"
                    className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    hover:bg-white/10
                    "
                    >

                        <Scissors size={20}/>
                        Services

                    </Link>


                </nav>



                <button
                onClick={logout}
                className="
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-red-400
                hover:bg-white/10
                "
                >

                    <LogOut size={20}/>
                    Logout

                </button>


            </aside>



            {/* Main Content */}

            <main className="
                flex-1
                p-10
            ">

                {children}

            </main>


        </div>

    );

}