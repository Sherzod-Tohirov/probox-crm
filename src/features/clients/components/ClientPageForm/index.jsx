import { Col, Input, Row } from "@components/ui";
import { useForm } from "react-hook-form";
import styles from "./clientPageForm.module.scss";
import InputGroup from "./InputGroup";
import Label from "./Label";
import useToggle from "@hooks/useToggle";
import { images } from "../../../../../mockData";
import { useCallback, useState } from "react";
import ImagePreviewModal from "./ImagePreviewModal";
import useClientPageForm from "../../hooks/useClientPageForm";
import useAlert from "@hooks/useAlert";

export default function ClientPageForm({ formId, ...props }) {
  const { sidebar } = useToggle(["sidebar", "messenger"]);
  const [imgPreviewModal, setImgPreviewModal] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState(images);
  const [copyPorductImages, setCopyProductImages] = useState(images);
  const { alert } = useAlert();

  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      name: "Maqsudov Nodir",
      photo: [],
      telephone: "+998 94 534 33 24",
      code: "20470",
      debtClient: "1800",
      product: "iPhone 16 Pro max 256gb desert",
      deadline: "12.03.2030",
      imei: "345345345453455",
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
                  {...register("name")}
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
                  variant={"filled"}
                  size={sidebar.isOpen ? "small" : ""}
                  value={"+998 94 534 33 24"}
                  hasIcon={false}
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
                  value={"20470"}
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
                  value={"1800"}
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
                  value={"iPhone 16 Pro max 256gb desert"}
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
                  value={"345345345453455"}
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
