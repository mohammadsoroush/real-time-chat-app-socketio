import React from "react";

export const RecipientInfo = ({
  ShowRecipientInfo,
  SetShowRecipientInfo,
}: {
  ShowRecipientInfo: boolean;
  SetShowRecipientInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center gap-x-3">
      <div className="drawer w-fit drawer-end">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer"
            className="cursor-pointer drawer-button"
          ></label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          >
            close
          </label>
        </div>
      </div>
    </div>
  );
};
