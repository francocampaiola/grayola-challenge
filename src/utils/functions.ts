"use client";
import { IResponse } from "@/app/types";

export const handleRequest = async <T>(
  request: () => Promise<IResponse<T>>
): Promise<{ data?: T; success: boolean; errorMessage?: string }> => {
  const requestData = await request();
  if (Array.isArray(requestData?.errorMessage)) {
    return {
      success: false,
      errorMessage: requestData.errorMessage[0],
    };
  } else if (typeof requestData?.errorMessage === "string") {
    console.log(requestData?.errorMessage);
    return { success: false };
  }

  return { data: requestData?.data, success: true };
};
