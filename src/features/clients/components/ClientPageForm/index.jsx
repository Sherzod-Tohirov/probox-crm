import { Col, Input, Row } from "@components/ui";
import { useForm } from "react-hook-form";
import styles from "./clientPageForm.module.scss";
import InputGroup from "./InputGroup";
import Label from "./Label";
import { useCallback, useEffect, useMemo, useState } from "react";
import ImagePreviewModal from "./ImagePreviewModal";
import useAlert from "@hooks/useAlert";
import useAuth from "@hooks/useAuth";
import formatterCurrency from "@utils/formatterCurrency";
import formatDate from "@utils/formatDate";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
import useMutateClientImages from "@hooks/data/useMutateClientImages";
import hasRole from "@utils/hasRole";
import selectOptionsCreator from "@utils/selectOptionsCreator";
import { API_CLIENT_IMAGES } from "@utils/apiUtils";
import { v4 as uuidv4 } from "uuid";
export default function ClientPageForm({
  formId,
  onSubmit,
  currentClient,
  setIsSaveButtonDisabled,
  ...props
}) {
  const [imgPreviewModal, setImgPreviewModal] = useState(false);
  const [softDeletedImageIds, setSoftDeletedImageIds] = useState([]);
  const [uploadedImage, setUploadedImage] = useState([]);

  const { data: executors } = useFetchExecutors();
  const { user } = useAuth();

  const updateMutation = useMutateClientImages("update");
  const deleteMutation = useMutateClientImages("delete");

  const clientImagesWithAPI =
    currentClient?.Images?.map((img) => ({
      id: img._id,
      image: API_CLIENT_IMAGES + img?.image,
      type: "server",
    })) || [];

  const [allImages, setAllImages] = useState([...clientImagesWithAPI]);

  const { register, handleSubmit, control, watch } = useForm({
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
  const executor = watch("executor");

  const handleImageInputClick = useCallback(() => {
    setImgPreviewModal(true);
  }, []);

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      return {
        id: uuidv4(),
        image: URL.createObjectURL(file),
        file,
        type: "upload",
      };
    });

    setUploadedImage((prev) => [...prev, ...newImages]);
  }, []);

  const handleImageUpload = useCallback(() => {
    const commonPayload = {
      docEntry: currentClient?.["DocEntry"],
      installmentId: currentClient?.["InstlmntID"],
    };

    const formDataImages = new FormData();
    uploadedImage.forEach((img) => {
      formDataImages.append("files", img.file);
    });
    const updatePayload = {
      ...commonPayload,
      data: formDataImages,
    };
    updateMutation.mutate(updatePayload);

    if (softDeletedImageIds.length > 0) {
      softDeletedImageIds.forEach(async (id) => {
        const deletePayload = {
          ...commonPayload,
          id,
        };
        await deleteMutation.mutate(deletePayload);
      });
    }

    if (!updateMutation.isError) {
      setUploadedImage([]);
    }

    setSoftDeletedImageIds([]);
    setImgPreviewModal(false);
  }, [uploadedImage]);

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
      )?.SlpCode || executorsOptions?.[0]?.value,
    [currentClient, executors]
  );

  useEffect(() => {
    setAllImages((prev) => [...prev, ...uploadedImage]);
  }, [uploadedImage]);

  useEffect(() => {
    if ((executor || "") !== defaultExecutor) {
      setIsSaveButtonDisabled(false);
    }
  }, [executor]);
  console.log(allImages, "all");
  return (
    <form
      className={styles.form}
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      {...props}>
      <ImagePreviewModal
        inputId={"photo"}
        images={allImages}
        isOpen={imgPreviewModal}
        isLoading={updateMutation.isPending || deleteMutation.isPending}
        isDisabled={uploadedImage.length === 0 || softDeletedImageIds.length === 0}
        onRemoveImage={(img, index) => {
          setAllImages((prev) => {
            if (img.type === "server") {
              setSoftDeletedImageIds((p) => [...p, img.id]);
            }

            if (img.type === "upload") {
              setUploadedImage((p) =>
                p.filter((prevImg) => prevImg.id !== img.id)
              );
            }

            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
          });
        }}
        onClose={() => {
          setImgPreviewModal(false);
          setUploadedImage([]);
          setSoftDeletedImageIds([]);
        }}
        onApply={handleImageUpload}
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
                  multiple={true}
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
