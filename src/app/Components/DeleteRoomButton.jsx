"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, toast } from "@heroui/react";

const DeleteRoomButton = ({ id }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this room?");

    if (!confirmDelete) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${id}`,
      {
        method: "DELETE",
      },
    );

    const data = await res.json();

    if (res.ok) {
      toast.success("Room deleted successfully");

      router.refresh();
    } else {
      toast.error(data.message || "Failed to delete");
    }
  };

  return (
    <Button
      onPress={handleDelete}
      className="rounded-full bg-rose-500 text-white"
    >
      Delete
    </Button>
  );
};

export default DeleteRoomButton;
