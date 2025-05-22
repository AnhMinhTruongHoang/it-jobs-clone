import { useState } from "react";

interface IProps {
  onClose: (v: boolean) => void;
  open: boolean;
  //   dataInit: IResume | null | any;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

const ViewBanners = (props: IProps) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { onClose, open, setDataInit, reloadTable } = props;
};

export default ViewBanners;
