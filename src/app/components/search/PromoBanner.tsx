export default function PromoBanner() {
    return (
        <div className="grid gap-6 md:grid-cols-2 mx-auto max-w-7xl pt-3 pb-3">
            {/* E-commerce Banner */}
            <div
                className="group relative overflow-hidden rounded-2xl bg-cover bg-center p-6 text-white shadow-lg"
                style={{
                    backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg width="1071" height="404" viewBox="0 0 1071 404" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.3923 403.607H1053.39C1062.99 403.607 1070.78 395.837 1070.78 386.254V17.9908C1070.78 8.40639 1062.99 0.636459 1053.39 0.636459H17.3923C7.78565 0.636459 0 8.40639 0 17.9908V386.254C0 395.837 7.78565 403.607 17.3923 403.607Z" fill="#006495"/>
<path d="M467.29 131.042C487.819 237.463 434.936 306.266 369.897 315.468C271.653 329.367 172.897 352.302 139.236 403.607H968.304C977.91 403.607 985.697 395.837 985.697 386.254V17.6495C985.697 8.06507 977.91 0.296295 968.304 0.296295H517.669C517.669 0.296295 448.533 33.8104 467.29 131.042Z" fill="#2297DD"/>
<path d="M685.271 67.2271C682.748 129.074 732.078 139.51 729.351 204.506C726.829 264.633 696.562 315.468 624.68 315.468C552.797 315.468 481.969 352.302 457.583 403.607H1053.39C1062.99 403.607 1070.78 395.837 1070.78 386.254V17.6495C1070.78 8.06507 1062.99 0.296295 1053.39 0.296295H722.789C722.789 0.296295 687.236 19.0066 685.271 67.2271Z" fill="#86C5EB"/>
</svg>

        `)}')`
                }}
            >
                {/* Nội dung còn lại giữ nguyên */}
                <div className="relative z-10 h-full">
                    <h2 className="mb-2 max-w-[200px] text-2xl font-bold leading-tight">
                        E-commerce Is a Commercial Transaction
                    </h2>
                    <button
                        className="mt-4 rounded-full bg-white px-6 py-2 text-sm font-medium text-blue-900 transition-transform hover:scale-105">
                        Show NOW
                    </button>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
                    <div className="relative h-48 w-64">
                        <img src="/image/banner01.svg" alt="Description of SVG"
                             className="w-full h-full object-contain"/>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-400 opacity-50 blur-2xl"/>
                <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-300 opacity-30 blur-3xl"/>

                {/* Optional: Dark overlay to improve text readability */}
                <div className="absolute inset-0 bg-black/20"/>
            </div>
            {/* Netflix Banner */}
            <div
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 p-6 shadow-lg">
                <div className="relative z-10">
                    <div className="flex items-baseline gap-1">
                        <img
                            src="/placeholder.svg?height=24&width=80"
                            alt="Netflix"
                            className="h-6"
                        />
                        <span className="text-3xl font-bold text-red-600">79K</span>
                        <span className="text-lg font-medium text-gray-600">/THÁNG</span>
                    </div>
                    <div
                        className="mt-2 inline-block rounded-full bg-purple-200 px-3 py-1 text-sm font-medium text-purple-700">
                        XEM PHIM 4K
                    </div>
                    <div className="mt-4 flex justify-end">
                        <div className="relative h-32 w-32">
                            {/* Isometric illustration placeholder */}
                            <div
                                className="absolute bottom-0 right-0 h-24 w-24 rounded-xl bg-teal-300/50 backdrop-blur-sm"/>
                            <div className="absolute right-8 top-4 h-16 w-16 rounded-lg bg-yellow-300/50"/>
                            <div className="absolute right-4 top-0 h-12 w-12 rounded-full bg-red-300/50"/>
                        </div>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-300 opacity-30 blur-2xl"/>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-purple-200 opacity-40 blur-xl"/>
            </div>
        </div>
    )
}
