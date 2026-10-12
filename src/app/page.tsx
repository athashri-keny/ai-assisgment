"use client";

import { useState } from "react";
import { products } from "@/data/product";
import axios from "axios";


export default function Page() {



  const [text, setText] = useState("");
  const [recommendedIds, setRecommendedIds] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


    const visibleProducts = recommendedIds === null ? products : products.filter((p) => recommendedIds.includes(p.id));

  async function handleSearch() {
    if (!text.trim()) {
      setError("Please describe what you are looking for.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const res = await axios.post(`/api/recommend` , {text})
      setRecommendedIds(res.data.ids);
    } catch (err) {
      setError("Something went wrong.");
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setText("");
    setRecommendedIds(null);
    setError("");
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-2 text-3xl font-bold">AI Product Recommender</h1>
      <p className="mb-6 text-white-500">
        Describe what you want, for example &quot;phone under $500&quot;.
      </p>

      <div className="mb-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
          placeholder="I want a phone under $500"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-white"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Recommend"}
        </button>
        <button
          onClick={handleClear}
          className="rounded border border-gray-300 px-4 py-2"
        >
          Clear
        </button>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {recommendedIds !== null && (
        <p className="mb-4 text-xl text-white ">
          {visibleProducts.length > 0
            ? `${visibleProducts.length} recommended product(s)`
            : "No matching products found in this range."}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((p) => (
          <div key={p.id} className="rounded border border-gray-300 p-4">
            <span className="text-xs uppercase text-gray-500">{p.category}</span>
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="mb-2 text-xl font-bold">${p.price}</p>
            <p className="text-sm text-gray-500">{p.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}