"use client";

import store from "@/redux/store";
import { Provider } from "react-redux";

export const Redux_provider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
