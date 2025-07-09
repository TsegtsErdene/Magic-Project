"use client";
import { useEffect, useState } from "react";

interface FileRow {
  id: number;
  category: string;
  filename: string;
  blobPath: string;
  uploadedAt: string;
}

export default function FileList({ userId, refresh }: { userId: string; refresh: number }) {
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files?userId=${userId}`)
      .then(res => res.json())
      .then(data => setFiles(data))
      .finally(() => setLoading(false));
  }, [userId, refresh]);

  return (
    <div className="mt-8 max-w-lg">
      <h2 className="font-bold mb-2">Файлуудын жагсаалт</h2>
      {loading ? <p>Ачааллаж байна...</p> : null}
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Төрөл</th>
            <th>Файлын нэр</th>
            <th>Огноо</th>
            <th>Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id}>
              <td>{file.category}</td>
              <td>{file.filename}</td>
              <td>{file.uploadedAt && file.uploadedAt.substring(0, 10)}</td>
              <td>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/files/url?blobPath=${encodeURIComponent(file.blobPath)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Татах / Preview
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
