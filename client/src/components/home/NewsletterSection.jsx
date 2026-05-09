export default function NewsletterSection() {
  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-teal-600">Stay Updated</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Get updates on new products and seller launches
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Join our email list to receive marketplace updates, featured products,
              and curated new arrivals.
            </p>
          </div>

          <form className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-12 flex-1 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
            />
            <button
              type="submit"
              className="rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}