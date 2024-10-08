"use client";
// Packages
import { useQuery } from "@tanstack/react-query";
import { CircleOff, Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";

// Components
import { TextEffect } from "@/components/ui/text-effect";
const PackageForm = dynamic(() => import("./packageForm"), {
    ssr: false,
});

const Package = ({ packageId }) => {
    const {
        data: packageData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["packages", packageId],
        queryFn: () =>
            fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/package/${packageId}`
            ).then((res) => res.json()),
        enabled: packageId?.length >= 12,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-280px)]">
                <Loader2Icon className="h-7 w-7 animate-spin text-tourHub-green-dark" />
            </div>
        );
    } else if (isError) {
        return (
            <div className="w-full flex flex-col gap-2 justify-center items-center min-h-[60vh] font-inter">
                <CircleOff className="h-7 w-7 text-red-600" />
                <p className="max-w-[400px] text-center text-14px text-tourHub-gray">
                    <TextEffect per="char" preset="fade">
                        {error.message}
                    </TextEffect>
                </p>
            </div>
        );
    }

    return (
        <div>
            <PackageForm singlePackage={packageData?.data} />
        </div>
    );
};

export default Package;
