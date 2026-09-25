import { Link } from 'react-router-dom';
import { Leaf } from '../components/Icons';

export default function NotFound() {
  return (
    <div className="shell flex flex-col items-center gap-5 py-28 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-leaf-100 text-leaf-700">
        <Leaf className="h-7 w-7" />
      </span>
      <p className="font-display text-6xl font-extrabold text-leaf-800">404</p>
      <h1 className="text-3xl font-extrabold">This page went to seed</h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink-500">
        The link is broken or the page has moved. The shelf is still stocked, though.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/shop" className="btn btn-lg btn-primary">
          Go to the shop
        </Link>
        <Link to="/" className="btn btn-lg btn-secondary">
          Back home
        </Link>
      </div>
    </div>
  );
}
