/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Loader2,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const HomePage = () => {
  const [services, setServices] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [filters, setFilters] =
    useState({
      search: "",
      category: "",
      state: "",
    });

  const fetchServices = async (
    customFilters = filters
  ) => {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      if (customFilters.search) {
        params.append(
          "search",
          customFilters.search
        );
      }

      if (customFilters.category) {
        params.append(
          "category",
          customFilters.category
        );
      }

      if (customFilters.state) {
        params.append(
          "state",
          customFilters.state
        );
      }

      const response = await api.get(
        `/services?${params.toString()}`
      );

      setServices(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response =
        await api.get("/categories");

      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    fetchServices(filters);
  };

  const handleCategoryFilter = (
    slug
  ) => {
    const updatedFilters = {
      ...filters,
      category: slug,
    };

    setFilters(updatedFilters);

    fetchServices(updatedFilters);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="absolute -top-37.5 -right-25 w-87.5 h-87.5 bg-violet-200/40 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-5 pt-16 pb-12 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              Trusted local services
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.05]">
              Find professionals you can trust
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl">
              Discover trusted experts for
              cleaning, repairs, beauty,
              tech, home services and more.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-10 bg-white border border-gray-200 rounded-[28px] p-3 shadow-xl shadow-gray-100"
          >
            <div className="grid lg:grid-cols-[1fr_1fr_180px] gap-3">
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Search
                  size={20}
                  className="text-gray-400"
                />

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="What service do you need?"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>

              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-gray-50 border border-gray-100">
                <MapPin
                  size={20}
                  className="text-gray-400"
                />

                <input
                  type="text"
                  name="state"
                  value={filters.state}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                className="h-14 rounded-2xl bg-violet-700 hover:bg-violet-800 text-white font-semibold transition shadow-lg shadow-violet-200"
              >
                Search
              </button>
            </div>
          </form>

          {/* CATEGORY FILTERS */}
          <div className="mt-6">
            {/* MOBILE DROPDOWN */}
            <div className="sm:hidden">
              <select
                value={filters.category}
                onChange={(e) =>
                  handleCategoryFilter(
                    e.target.value
                  )
                }
                className="w-full h-12 px-4 rounded-2xl border border-gray-200 bg-white text-sm font-medium outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              >
                <option value="">
                  All services
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={
                        category.slug
                      }
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* DESKTOP PILLS */}
            <div className="hidden sm:flex flex-wrap gap-3">
              <button
                onClick={() =>
                  handleCategoryFilter("")
                }
                className={`px-5 h-11 rounded-2xl text-sm font-medium transition ${
                  filters.category ===
                  ""
                    ? "bg-violet-700 text-white shadow-lg shadow-violet-200"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                All services
              </button>

              {categories.map(
                (category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      handleCategoryFilter(
                        category.slug
                      )
                    }
                    className={`px-5 h-11 rounded-2xl text-sm font-medium whitespace-nowrap transition ${
                      filters.category ===
                      category.slug
                        ? "bg-violet-700 text-white shadow-lg shadow-violet-200"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {category.name}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Available services
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {services.length} services
              found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-violet-700" />
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-4xl p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              No services found
            </h3>

            <p className="text-gray-500 mt-3">
              Try changing your filters or
              search query.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="group bg-white border border-gray-200 rounded-[30px] p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200 transition duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                      {
                        service.category_name
                      }
                    </span>

                    <h3 className="mt-4 text-2xl font-bold text-gray-900 leading-tight line-clamp-2">
                      {service.title}
                    </h3>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg">
                    {service.username
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-gray-500 line-clamp-3">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      @
                      {
                        service.username
                      }
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {service.state}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-xl text-sm font-medium">
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span>
                      {Number(
                        service.average_rating
                      ) > 0
                        ? service.average_rating
                        : "New"}
                    </span>

                    <span className="text-yellow-600/70">
                      (
                      {service.total_reviews ||
                        0}
                      )
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
                      Starting from
                    </p>

                    <p className="mt-1 text-2xl font-black text-violet-700">
                      {service.price
                        ? `₦${service.price}`
                        : "Negotiable"}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 capitalize">
                    {
                      service.price_type
                    }
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;