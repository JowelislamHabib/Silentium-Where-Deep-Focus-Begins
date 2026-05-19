"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  FieldError,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { RiPencilLine } from "react-icons/ri";

const amenityOptions = [
  "Whiteboard",
  "Projector",
  "Wi‑Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

const fieldGroupClassName = "flex flex-col gap-2";
const labelClassName = "text-sm font-medium text-gray-900";
const inputClassName =
  "w-full h-12 rounded border border-stone-200 bg-white px-4 text-sm text-gray-900 transition-colors placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white";
const textAreaClassName =
  "w-full resize-none rounded border border-stone-200 bg-white p-4 text-sm leading-relaxed text-gray-900 transition-colors placeholder:text-gray-500 focus:border-indigo-500";

const EditRoom = ({ room }) => {
  const router = useRouter();

  const {
    _id,
    name = "",
    description = "",
    image = "",
    floor = "",
    capacity = "",
    hourlyRate = "",
    amenities = [],
  } = room ?? {};

  const roomAmenities = Array.isArray(amenities) ? amenities : [];

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedRoom = {
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image"),
      floor: formData.get("floor"),
      capacity: Number(formData.get("capacity")),
      hourlyRate: Number(formData.get("hourlyRate")),
      amenities: formData.getAll("amenities"),
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRoom),
      },
    );

    const data = await res.json();

    if (res.ok) {
      toast.success("Room updated");
      router.refresh();
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  return (
    <Modal className="w-full">
      <Button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
        <RiPencilLine className="size-4" />
        Edit
      </Button>

      <Modal.Backdrop className="bg-stone-900/40 backdrop-blur-sm">
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            <Modal.CloseTrigger className="top-5 right-5 text-stone-400 transition-colors hover:text-indigo-600" />

            <Modal.Header className="flex flex-col gap-1 border-b border-stone-200 bg-stone-50 p-8 pb-6">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <RiPencilLine className="size-6" />
                </span>
                <div>
                  <Modal.Heading className="text-2xl font-bold text-gray-900">
                    Edit focus space
                  </Modal.Heading>
                  <p className="mt-1 text-sm text-gray-500">
                    Update listing details guests see when browsing.
                  </p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="max-h-[70vh] overflow-y-auto p-8">
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="space-y-6">
                  <TextField
                    name="name"
                    isRequired
                    defaultValue={name}
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Room name</Label>
                    <Input
                      placeholder="e.g. Silentium Alcove"
                      className={inputClassName}
                    />
                    <FieldError className="text-sm font-medium text-rose-500" />
                  </TextField>

                  <TextField
                    name="description"
                    isRequired
                    defaultValue={description}
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Description</Label>
                    <TextArea
                      placeholder="Lighting, acoustics, seating..."
                      rows={4}
                      className={textAreaClassName}
                    />
                    <FieldError className="text-sm font-medium text-rose-500" />
                  </TextField>

                  <TextField
                    name="image"
                    type="url"
                    isRequired
                    defaultValue={image}
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Image URL</Label>
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      className={inputClassName}
                    />
                    <FieldError className="text-sm font-medium text-rose-500" />
                  </TextField>
                </div>

                <div className="grid grid-cols-1 gap-6 border-t border-stone-200 pt-8 sm:grid-cols-3">
                  <TextField
                    name="floor"
                    isRequired
                    defaultValue={floor}
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Floor</Label>
                    <Input
                      placeholder="3rd Floor"
                      className={inputClassName}
                    />
                    <FieldError className="text-sm font-medium text-rose-500" />
                  </TextField>

                  <TextField
                    name="capacity"
                    type="number"
                    isRequired
                    defaultValue={String(capacity)}
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Capacity</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="2"
                      className={inputClassName}
                    />
                    <FieldError className="text-sm font-medium text-rose-500" />
                  </TextField>

                  <TextField
                    name="hourlyRate"
                    type="number"
                    isRequired
                    defaultValue={String(hourlyRate)}
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Hourly rate ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="5"
                      className={inputClassName}
                    />
                    <FieldError className="text-sm font-medium text-rose-500" />
                  </TextField>
                </div>

                <div className="space-y-4 border-t border-stone-200 pt-8">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Amenities
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select everything included with this space.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {amenityOptions.map((option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer select-none items-center gap-4 rounded-lg border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-medium text-gray-900 transition-colors hover:border-indigo-500 hover:bg-indigo-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
                      >
                        <input
                          type="checkbox"
                          name="amenities"
                          value={option}
                          defaultChecked={roomAmenities.includes(option)}
                          className="h-4 w-4 shrink-0 rounded border-stone-200 text-indigo-500 accent-indigo-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 border-t border-stone-200 pt-6">
                  <Button
                    slot="close"
                    variant="flat"
                    className="h-12 flex-1 rounded-xl bg-stone-100 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    slot="close"
                    className="h-12 flex-[2] rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
                  >
                    Save changes
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditRoom;
