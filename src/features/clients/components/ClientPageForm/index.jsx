import { images } from "../../../../../mockData";

import { Col, Input, Row } from "@components/ui";
import { useForm } from "react-hook-form";
import styles from "./clientPageForm.module.scss";
import InputGroup from "./InputGroup";
import Label from "./Label";
import useToggle from "@hooks/useToggle";
import { useCallback, useMemo, useState } from "react";
import ImagePreviewModal from "./ImagePreviewModal";
import useClientPageForm from "../../hooks/useClientPageForm";
import useAlert from "@hooks/useAlert";
import useAuth from "@hooks/useAuth";
import formatterCurrency from "@utils/formatterCurrency";
import formatDate from "@utils/formatDate";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
import hasRole from "@utils/hasRole";
import selectOptionsCreator from "@utils/selectOptionsCreator";

export default function ClientPageForm({ formId, currentClient, ...props }) {

  const { sidebar } = useToggle(["sidebar", "messenger"]);
  const [imgPreviewModal, setImgPreviewModal] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState(images);
  const [copyPorductImages, setCopyProductImages] = useState(images);
  const { alert } = useAlert();
  
  const { data: executors } = useFetchExecutors();
  const { user } = useAuth();

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: currentClient?.["CardName"] || "Palonchiyev Palonchi",
      photo: [],
      telephone: currentClient?.["Phone1"] || "+998 00 000 00 00",
      code: currentClient?.["CardCode"] || "00000",
      debtClient: formatterCurrency(currentClient?.["DocTotal"] || "0", "USD"),
      product:
        currentClient?.["Dscription"] || "iPhone 16 Pro max 256gb desert",
      deadline: formatDate(currentClient["DueDate"]),
      imei: currentClient?.["IntrSerial"] || "0000000000000000",
    },
  });

  const { onSubmit } = useClientPageForm();

  const handleImageInputClick = useCallback(() => {
    setImgPreviewModal(true);
  }, []);

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      return {
        img: URL.createObjectURL(file),
        title: file.name,
        file,
      };
    });
    setCopyProductImages((prev) => [...prev, ...newImages]);
  }, []);

  const executorsOptions = useMemo(
    () =>
      selectOptionsCreator(executors?.data, {
        label: "SlpName",
        value: "SlpCode",
      }),
    [executors?.data]
  );

  const defaultExecutor = useMemo(
    () =>
      executors?.data?.find(
        (executor) =>
          Number(executor.SlpCode) === Number(currentClient?.SlpCode)
      )?.SlpCode,
    [currentClient, executors] || executorsOptions?.[0]?.value
  );

  return (
    <form
      className={styles.form}
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      {...props}>
      <ImagePreviewModal
        inputId={"photo"}
        images={copyPorductImages}
        isOpen={imgPreviewModal}
        onRemoveImage={(index) => {
          setCopyProductImages((prev) => {
            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
          });
        }}
        onClose={() => {
          setImgPreviewModal(false);
          setCopyProductImages(() => [...selectedProductImages]);
        }}
        onApply={() => {
          alert("Images saved");
          setSelectedProductImages(() => [...copyPorductImages]);
          setImgPreviewModal(false);
        }}
      />
      <Row direction={"row"} gutter={6}>
        <Col>
          <Row gutter={1}>
            <Col>
              <InputGroup>
                <Label icon="avatarFilled">Name</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  disabled={true}
                  style={{ pointerEvents: "all" }}
                  {...register("name")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="avatarFilled">Executor</Label>
                <Input
                  type="select"
                  variant={"filled"}
                  options={executorsOptions}
                  defaultValue={defaultExecutor}
                  size={sidebar.isOpen ? "small" : ""}
                  disabled={!hasRole(user, ["Manager"])}
                  {...register("executor")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="photo" htmlFor={"photo"}>
                  Photo
                </Label>
                <Input
                  id={"photo"}
                  type="file"
                  images={selectedProductImages}
                  accept="image/*"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  className={styles.fileInput}
                  onClick={handleImageInputClick}
                  onChange={handleImageChange}
                  name={"photo"}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="telephoneFilled">Telephone</Label>
                <Input
                  type="tel"
                  control={control}
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  hasIcon={false}
                  disabled={true}
                  style={{ cursor: "auto" }}
                  {...register("telephone")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="barCodeFilled">Code</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  disabled={true}
                  {...register("code")}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row gutter={1}>
            <Col>
              <InputGroup>
                <Label icon="expense">Debt client</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  disabled={true}
                  {...register("debtClient")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="products">Product</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  disabled={true}
                  {...register("product")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="calendar">Deadline</Label>
                <Input
                  type="date"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  control={control}
                  hasIcon={false}
                  disabled={true}
                  {...register("deadline")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="barCodeFilled">IMEI</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  disabled={true}
                  {...register("imei")}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
}
