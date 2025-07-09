"use client";
import { useState } from "react";

interface FileUploadProps {
  userId: string;
  onUploaded: () => void;
}

const CATEGORIES = [
  { value: "balance", label: "Balance тайлан" },
  { value: "sales", label: "Борлуулалтын тайлан" },
  { value: "cashflow", label: "Мөнгөн гүйлгээ" },
  // ... бусад 13 төрөл ...
];

export default function FileUpload({ userId, onUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category) {
      setMsg("Файл болон төрөл сонгоно уу!");
      return;
    }
    setLoading(true);
    setMsg(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("category", category);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`, {
      method: "POST",
      body: formData,
    });
    setLoading(false);

    if (res.ok) {
      setMsg("Амжилттай илгээгдлээ!");
      setFile(null);
      setCategory("");
      onUploaded(); // 🚩 Амжилттай upload болбол parent-д дохио өгнө
    } else {
      const errorText = await res.text();
      setMsg("Алдаа: " + errorText);
    }
  };

  return (
    <form onSubmit={handleUpload} className="w-full max-w-lg p-6 border rounded-2xl shadow-xl bg-white space-y-4">
      <div>
        <label className="font-semibold">Файл сонгох</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="w-full mt-1"
        />
        {file && <p className="text-xs text-gray-600">{file.name}</p>}
      </div>
      <div>
        <label className="font-semibold">Төрөл</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full mt-1 border rounded p-2"
        >
          <option value="">Файлын төрөл сонгоно уу</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? <span className="animate-spin">⏳</span> : "Upload"}
      </button>
      {msg && (
        <div className="rounded-lg mt-2 bg-gray-100 p-2 text-sm">{msg}</div>
      )}
    </form>
  );
}
