"use client";

// Packages
import { StarFilledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import Image from "next/image";

// Components
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMemo } from "react";
import PackagesRowActions from "./PackagesRowActions";

export const usePackageColumns = () => {
  return useMemo(() => {
    return [
      {
        accessorKey: "cardImage",
        header: "Image",
        cell: ({ row }) => {
          const cardImage = row.getValue("cardImage");

          return (
            <div>
              <Image
                src={cardImage}
                alt="Image"
                width={80}
                height={60}
                className="bg-gray-100 rounded-md"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: null,
        filterFn: (row, id, value) => {
          // Get the category from the row
          const rowCategory = row.getValue(id);

          // Check if the rowCategory includes any of the selected filter values
          return (
            value.length === 0 ||
            rowCategory.some(({ _id }) => value.includes(_id))
          );
        },
        cell: ({ row }) => {
          const { category } = row.original || {};
          return (
            <div className="flex items-center gap-x-1">
              {category?.map(({ name, _id }) => (
                <p key={_id}>{name}</p>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "country",
        header: "Country",
      },
      {
        accessorKey: "totalPeople",
        header: "Total People",
        cell: ({ row }) => {
          const people = row.getValue("totalPeople");

          return <p className="text-center">{people}</p>;
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          const description = row.getValue("description");
          const charLimit = 30; // Limit the number of characters to display

          return (
            <div className="max-w-32">
              <HoverCard>
                <HoverCardTrigger>
                  <p>
                    {description.length > charLimit
                      ? `${description.slice(0, charLimit)}...`
                      : description}
                  </p>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p>{description}</p>
                </HoverCardContent>
              </HoverCard>
            </div>
          );
        },
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => {
          const dateStr = row.getValue("startDate");
          const formattedDate = format(new Date(dateStr), "dd-MM-yyyy");

          return <p className="whitespace-nowrap">{formattedDate}</p>;
        },
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ row }) => {
          const dateStr = row.getValue("endDate");
          const formattedDate = format(new Date(dateStr), "dd-MM-yyyy");

          return <p className="whitespace-nowrap">{formattedDate}</p>;
        },
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
          const price = parseFloat(row.getValue("price"));
          const formattedPrice = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(price);

          return <div className="font-medium">{formattedPrice}</div>;
        },
      },
      {
        accessorKey: "averageRating",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Avg. Rating" />
        ),
        cell: ({ row }) => {
          const rating = row.getValue("averageRating");

          return (
            <p className="flex justify-center items-center gap-x-1">
              {rating}
              <StarFilledIcon className="h-4 text-yellow-500" />
            </p>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const pack = row.original;

          return <PackagesRowActions pack={pack} />;
        },
      },
    ];
  }, []);
};
