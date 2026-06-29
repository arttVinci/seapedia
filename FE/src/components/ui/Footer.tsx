import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full mt-auto bg-gray-900">
      <div className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
          <div className="col-span-full lg:col-span-1">
            <span className="flex-none text-xl font-semibold text-white">SEAPEDIA</span>
            <p className="my-5 text-gray-400 text-sm">
              Pusat belanja gadget, laptop, dan handphone terlengkap. Kami menyediakan produk original dengan garansi resmi dan harga terbaik.
            </p>
          </div>

          <div className="grid col-span-1 gap-5">
            <div>
              <h4 className="font-semibold text-gray-100">Metode Pengiriman</h4>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Instant</span>
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Next Day</span>
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Regular</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-100">Metode Pembayaran</h4>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Wallet SEAPEDIA</span>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-gray-100">Bantuan</h4>
            <div className="grid mt-3 space-y-3">
              <Link to="/catalog" className="inline-flex text-gray-400 gap-x-2 hover:text-gray-200 text-sm">
                Katalog Produk
              </Link>
              <span className="inline-flex text-gray-400 gap-x-2 text-sm cursor-pointer hover:text-gray-200">
                Hubungi Kami
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-5 sm:mt-12">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SEAPEDIA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
