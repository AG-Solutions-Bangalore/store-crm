import Cropper from "react-easy-crop";
import { Modal, Slider } from "antd";
import { useState, useCallback } from "react";
import getCroppedImg from "./cropImageUtils";

const CropImageModal = ({
  open,
  imageSrc,
  onCancel,
  onCropComplete,
  title = "Crop Image",
  cropSize = { width: 200, height: 200 },
}) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropAreaComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleOk = async () => {
    const croppedImage = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      cropSize
    );
    onCropComplete(croppedImage);
  };

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={handleOk}
      width={800}
      centered
      maskClosable={false}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "60vh",
          backgroundColor: "black",
        }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={cropSize.width / cropSize.height}
          cropSize={cropSize}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropAreaComplete}
          style={{
            containerStyle: {
              width: "100%",
              height: "100%",
              position: "relative",
            },
            mediaStyle: {
              objectFit: "contain", // Keeps image clean and contained
            },
          }}
        />
      </div>
      <div className="mt-4">
        <Slider min={1} max={3} step={0.1} value={zoom} onChange={setZoom} />
      </div>
    </Modal>
  );
};

export default CropImageModal;
