import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Col, Input, Row } from "@components/ui";
import { useForm } from "react-hook-form";

import ImagePreviewModal from "./ImagePreviewModal";
import InputGroup from "./InputGroup";
import Label from "./Label";

import useAuth from "@hooks/useAuth";
import useAlert from "@hooks/useAlert";
import useFetchExecutors from "@hooks/data/clients/useFetchExecutors";
import useMutateClientImages from "@hooks/data/clients/useMutateClientImages";

import styles from "./clientPageForm.module.scss";

import selectOptionsCreator from "@utils/selectOptionsCreator";
import formatterCurrency from "@utils/formatterCurrency";
import { API_CLIENT_IMAGES } from "@utils/apiUtils";
import formatDate from "@utils/formatDate";
import { v4 as uuidv4 } from "uuid";
import hasRole from "@utils/hasRole";
import { store } from "@store/store";
import moment from "moment";

function ClientPageForm({
  formId,
  onSubmit,
  setIsSaveButtonDisabled,
  ...props
}) {
  const currentClient = store.getState().page.clients.currentClient;
  const [imgPreviewModal, setImgPreviewModal] = useState(false);
  const [softDeletedImageIds, setSoftDeletedImageIds] = useState([]);
  const [uploadedImage, setUploadedImage] = useState([]);
  const [isImgSaveButtonDisabled, setImgSaveButtonDisabled] = useState(true);
  const { data: executors } = useFetchExecutors();

  const { user } = useAuth();
  const { alert } = useAlert();

  const updateMutation = useMutateClientImages("update");
  const deleteMutation = useMutateClientImages("delete");

  const clientImagesWithAPI = useMemo(
    () =>
      currentClient?.Images?.map(
        (img) =>
          ({
            id: img._id,
            image: API_CLIENT_IMAGES + img?.image,
            type: "server",
          } || [])
      ),
    [currentClient]
  );
  const [allImages, setAllImages] = useState([]);
  const executorsOptions = useMemo(
    () =>
      selectOptionsCreator(executors, {
        label: "SlpName",
        value: "SlpCode",
        includeEmpty: true,
        isEmptySelectable: false,
      }),
    [executors]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: currentClient?.["CardName"] || "Mavjud emas",
      executor: executorsOptions?.[0]?.value,
      photo: [],
      telephone: currentClient?.["Phone1"] || "+998 00 000 00 00",
      additional_telephone: currentClient?.["Phone2"] || "",
      code: currentClient?.["CardCode"] || "00000",
      debtClient: formatterCurrency(
        currentClient?.["MaxDocTotal"] || "0",
        "USD"
      ),
      passportSeries: currentClient?.["Cellular"] || "Mavjud emas",
      product:
        currentClient?.["Dscription"] || "iPhone 16 Pro max 256gb desert",
      deadline: formatDate(currentClient?.["DueDate"]),
      agreementDate: formatDate(currentClient?.["NewDueDate"]) || "",
      imei: currentClient?.["IntrSerial"] || "0000000000000000",
    },
  });

  const handleImageInputClick = useCallback(() => {
    setImgPreviewModal(true);
  }, []);

  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/svg+xml",
  ];

  const allowedExtensions = ["png", "jpg", "jpeg", "svg"];

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      return (
        allowedTypes.includes(file.type) && allowedExtensions.includes(ext)
      );
    });
    // Show error or ignore invalid files
    if (validFiles.length !== files.length) {
      alert("Faqat png, jpg, jpeg, svg fayllarni yuklang!", { type: "info" });
    }
    // Continue with validFiles
    setUploadedImage((prev) => [
      ...prev,
      ...validFiles.map((file) => ({
        id: uuidv4(),
        image: URL.createObjectURL(file),
        file,
        type: "upload",
      })),
    ]);
  }, []);
  const handleImageUpload = useCallback(async () => {
    const commonPayload = {
      docEntry: currentClient?.["DocEntry"],
      installmentId: currentClient?.["InstlmntID"],
    };

    try {
      if (uploadedImage.length > 0) {
        const formDataImages = new FormData();
        uploadedImage.forEach((img) => {
          formDataImages.append("files", img.file);
        });
        const updatePayload = {
          ...commonPayload,
          data: formDataImages,
        };
        await updateMutation.mutateAsync(updatePayload);
        if (!updateMutation.isError) {
          setUploadedImage([]);
        }
      }
      if (softDeletedImageIds.length > 0) {
        await Promise.all(
          softDeletedImageIds.map((id) => {
            const deletePayload = {
              ...commonPayload,
              id,
            };
            return deleteMutation.mutateAsync(deletePayload);
          })
        );
        setSoftDeletedImageIds([]);
      }
    } catch (error) {
      console.log("Update/Delete Images error: ", error);
    } finally {
      setImgPreviewModal(false);
    }
  }, [uploadedImage, softDeletedImageIds, currentClient]);

  useEffect(() => {
    setAllImages((prev) => {
      const filteredImages = uploadedImage.filter((img) =>
        prev.every((allImg) => allImg.id !== img.id)
      );
      return [...prev, ...filteredImages];
    });
    if (uploadedImage.length > 0) setImgSaveButtonDisabled(false);
  }, [uploadedImage]);

  useEffect(() => {
    const foundExecutor = executors?.find(
      (executor) => Number(executor?.SlpCode) === Number(currentClient?.SlpCode)
    );
    if (foundExecutor) {
      setValue("executor", foundExecutor.SlpCode);
    }
  }, [executors]);

  useEffect(() => {
    setIsSaveButtonDisabled(!isDirty);
  }, [isDirty]);

  useEffect(() => {
    const imagesWithApi = currentClient?.Images?.map(
      (img) =>
        ({
          id: img._id,
          image: API_CLIENT_IMAGES + img?.image,
          type: "server",
        } || [])
    );
    setAllImages(() => imagesWithApi);
  }, [currentClient]);

  return (
    <form
      className={styles.form}
      id={formId}
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
        reset(data);
      })}
      {...props}>
      <ImagePreviewModal
        inputId={"photo"}
        images={allImages}
        isOpen={imgPreviewModal}
        isLoading={updateMutation.isPending || deleteMutation.isPending}
        isDisabled={isImgSaveButtonDisabled}
        onRemoveImage={(img) => {
          setImgSaveButtonDisabled(false);
          if (img.type === "server") {
            setSoftDeletedImageIds((p) => [...p, img.id]);
          }
          if (img.type === "upload") {
            setUploadedImage((p) =>
              p.filter((prevImg) => prevImg.id !== img.id)
            );
          }
          setAllImages((prev) =>
            prev.filter((imgItem) => imgItem.id !== img.id)
          );
        }}
        onClose={() => {
          setAllImages([...clientImagesWithAPI]);
          setImgPreviewModal(false);
          setUploadedImage([]);
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
                  accept="image/png,image/jpg,image/jpeg,image/svg+xml"
                  multiple
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
                  style={{ cursor: "auto" }}
                  {...register("telephone")}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="telephoneFilled">Telefon raqami 2</Label>
                <Input
                  type="text"
                  control={control}
                  variant={"filled"}
                  size={"longer"}
                  hasIcon={false}
                  style={{ cursor: "auto" }}
                  {...register("additional_telephone")}
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
                <Label icon="calendar">Kelishilgan sana</Label>
                <Input
                  type="date"
                  variant={"filled"}
                  size={"longer"}
                  control={control}
                  hasIcon={false}
                  {...register("agreementDate")}
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
            <Col>
              <InputGroup>
                <Label icon="barCodeFilled">Passport seriyasi</Label>
                <Input
                  type="text"
                  variant={"filled"}
                  size={"longer"}
                  disabled={true}
                  {...register("passportSeries")}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
}

export default memo(ClientPageForm);
