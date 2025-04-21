import { images } from "../../../../../mockData";

import { Col, Input, Row } from "@components/ui";
import { useForm } from "react-hook-form";
import styles from "./clientPageForm.module.scss";
import InputGroup from "./InputGroup";
import Label from "./Label";
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
import { API_CLIENT_IMAGES } from "@utils/apiUtils";

export default function ClientPageForm({ formId, currentClient, ...props }) {
  const [imgPreviewModal, setImgPreviewModal] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState(images);
  const [copyPorductImages, setCopyProductImages] = useState(images);
  const { alert } = useAlert();

  const { data: executors } = useFetchExecutors();
  const { user } = useAuth();
  const clientImagesWithAPI =
    currentClient?.Images?.map((img) => API_CLIENT_IMAGES + img?.image) || [];
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: currentClient?.["CardName"] || "Palonchiyev Palonchi",
      photo: [],
      telephone: currentClient?.["Phone1"] || "+998 00 000 00 00",
      code: currentClient?.["CardCode"] || "00000",
      debtClient: formatterCurrency(currentClient?.["DocTotal"] || "0", "USD"),
      product:
        currentClient?.["Dscription"] || "iPhone 16 Pro max 256gb desert",
      deadline: formatDate(currentClient?.["DueDate"]),
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
        includeEmpty: true,
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
 console.log(clientImagesWithAPI, "images");
 console.log(API_CLIENT_IMAGES, "images");
  return (
    <form
      className={styles.form}
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      {...props}>
      <ImagePreviewModal
        inputId={"photo"}
        images={clientImagesWithAPI}
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
                <Label icon="avatarFilled">FIO</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={"longer"}
                  disabled={true}
                  style={{ pointerEvents: "all" }}
                  {...register("name")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="avatarFilled">Ijrochi</Label>
                <Input
                  type="select"
                  variant={"filled"}
                  options={executorsOptions}
                  canClickIcon={false}
                  defaultValue={defaultExecutor}
                  size={"longer"}
                  disabled={!hasRole(user, ["Manager"])}
                  {...register("executor")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="photo" htmlFor={"photo"}>
                  Rasm
                </Label>
                <Input
                  id={"photo"}
                  type="file"
                  images={clientImagesWithAPI}
                  accept="image/*"
                  variant={"filled"}
                  size={"longer"}
                  className={styles.fileInput}
                  onClick={handleImageInputClick}
                  onChange={handleImageChange}
                  name={"images"}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="telephoneFilled">Telefon raqami</Label>
                <Input
                  type="tel"
                  control={control}
                  variant={"filled"}
                  size={"longer"}
                  hasIcon={false}
                  disabled={true}
                  style={{ cursor: "auto" }}
                  {...register("telephone")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="barCodeFilled">Mijoz kodi</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={"longer"}
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
                <Label icon="expense">Jami qarzdorlik</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={"longer"}
                  disabled={true}
                  {...register("debtClient")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="products">Mahsulot nomi</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={"longer"}
                  disabled={true}
                  {...register("product")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="calendar">To'lov muddati</Label>
                <Input
                  type="date"
                  variant={"filled"}
                  size={"longer"}
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
                  size={"longer"}
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
