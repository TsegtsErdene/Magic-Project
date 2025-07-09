"use client";
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";

export default function DashboardPage() {
  const [refresh, setRefresh] = useState(0);
  const userId = "testuser"; // (Жишээ, login logic-оос авна)

  return (
    <div>
      <FileUpload userId={userId} onUploaded={() => setRefresh(r => r + 1)} />
      <FileList userId={userId} refresh={refresh} />
    </div>
  );
}
