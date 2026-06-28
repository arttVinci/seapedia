import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const CartPage = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
      <p className="mb-4">Halaman keranjang belanja belum sepenuhnya diimplementasikan (T3-11), tetapi Anda dapat melanjutkan ke Checkout.</p>
      <Link to="/buyer/checkout">
        <Button>Checkout</Button>
      </Link>
    </div>
  );
};

export default CartPage;